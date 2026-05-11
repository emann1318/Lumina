import { useState, useEffect } from 'react';
import { journalAPI } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit3, Calendar, Search, X, Check, Image as ImageIcon, Camera } from 'lucide-react';

export default function Dashboard() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    content: '', 
    date: new Date().toISOString().split('T')[0],
    image: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  const userStr = localStorage.getItem('user');
  const isDemo = userStr ? JSON.parse(userStr).isDemo : false;

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      if (isDemo) {
        const local = localStorage.getItem('demo_journals');
        setJournals(local ? JSON.parse(local) : [
          {
            _id: 'demo-1',
            title: 'Welcome to your Demo Journal',
            content: "Since the database isn't connected yet, your reflections are being saved in your browser's local storage. This allows you to explore the interface and see how Lumina works.\n\nOnce you connect a MongoDB database, you can sign up for a real account to sync your journal across devices.",
            date: new Date().toISOString(),
            image: ''
          },
          {
            _id: 'demo-2',
            title: 'Midnight Musings',
            content: "The ink flows better in the dark of night. There's a certain clarity that only silence brings.",
            date: new Date(Date.now() - 86400000).toISOString(),
            image: ''
          }
        ]);
        setLoading(false);
        return;
      }
      const { data } = await journalAPI.getJournals();
      setJournals(data);
    } catch (err) {
      console.error('Error fetching journals:', err);
      if (err.response?.status === 503) {
        const local = localStorage.getItem('demo_journals');
        setJournals(local ? JSON.parse(local) : []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isDemo) {
        let newDocs = [...journals];
        if (editingId) {
          newDocs = newDocs.map(j => j._id === editingId ? { ...j, ...formData } : j);
        } else {
          newDocs.unshift({ ...formData, _id: Date.now().toString() });
        }
        localStorage.setItem('demo_journals', JSON.stringify(newDocs));
        setJournals(newDocs);
        closeForm();
        return;
      }
      
      if (editingId) {
        await journalAPI.updateJournal(editingId, formData);
      } else {
        await journalAPI.createJournal(formData);
      }
      fetchJournals();
      closeForm();
    } catch (err) {
      console.error('Error saving journal:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        if (isDemo) {
          const newDocs = journals.filter(j => j._id !== id);
          localStorage.setItem('demo_journals', JSON.stringify(newDocs));
          setJournals(newDocs);
          return;
        }
        await journalAPI.deleteJournal(id);
        setJournals(journals.filter(j => j._id !== id));
      } catch (err) {
        console.error('Error deleting journal:', err);
      }
    }
  };

  const openEdit = (journal) => {
    setFormData({
      title: journal.title,
      content: journal.content,
      date: new Date(journal.date).toISOString().split('T')[0],
      image: journal.image || ''
    });
    setEditingId(journal._id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', content: '', date: new Date().toISOString().split('T')[0], image: '' });
  };

  const filteredJournals = journals.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-border focus:outline-none focus:border-gold transition-colors bg-sidebar"
          />
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-gold text-black rounded-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-gold/10 uppercase text-xs tracking-widest"
        >
          <Plus className="w-5 h-5" />
          Write New Entry
        </button>
      </div>

      {/* Form Overlay */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeForm}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-sidebar rounded-2xl p-8 w-full max-w-2xl shadow-2xl relative z-10 border border-border my-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif italic text-text">
                  {editingId ? 'Edit Reflection' : 'New Reflection'}
                </h2>
                <button onClick={closeForm} className="p-2 hover:bg-surface rounded-lg transition-colors">
                  <X className="w-5 h-5 text-muted hover:text-text" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-bold text-muted mb-2">Title</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-text focus:outline-none focus:border-gold transition-all"
                        placeholder="Reflections on today..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-bold text-muted mb-2">Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input 
                          type="date" 
                          required 
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-bg text-text focus:outline-none focus:border-gold transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-muted mb-2">Visual Memory</label>
                    <div className="relative group aspect-video bg-bg rounded-xl border border-border border-dashed flex items-center justify-center overflow-hidden">
                      {formData.image ? (
                        <>
                          <img src={formData.image} alt="Upload preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, image: ''})}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-2 p-4 text-center">
                          <div className="p-3 bg-sidebar rounded-full group-hover:scale-110 transition-transform">
                            <Camera className="w-6 h-6 text-gold" />
                          </div>
                          <span className="text-[10px] uppercase tracking-widest text-muted font-bold">Upload Image</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-muted mb-2">Content</label>
                  <textarea 
                    required 
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-text focus:outline-none focus:border-gold transition-all resize-none italic font-serif leading-relaxed"
                    placeholder="Write your thoughts here..."
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={closeForm}
                    className="flex-1 py-3 border border-border rounded-xl font-bold text-muted hover:bg-surface uppercase text-xs tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-gold text-black rounded-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-gold/10 uppercase text-xs tracking-widest flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    {editingId ? 'Update Entry' : 'Save Entry'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Journal List */}
      <div className="grid gap-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted space-y-4">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            <p className="uppercase text-[10px] tracking-widest font-bold">Summoning reflections...</p>
          </div>
        ) : filteredJournals.length > 0 ? (
          filteredJournals.map((journal) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              key={journal._id}
              className="bg-sidebar p-0 rounded-2xl border border-border hover:border-gold/50 transition-all group relative overflow-hidden flex flex-col md:flex-row h-full"
            >
              {journal.image && (
                <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative overflow-hidden border-b md:border-b-0 md:border-r border-border">
                  <img src={journal.image} alt={journal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              )}
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3 text-[10px] text-gold uppercase tracking-widest font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(journal.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} • {new Date(journal.date).getFullYear()}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openEdit(journal)}
                      className="p-2 text-muted hover:text-text hover:bg-surface rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(journal._id)}
                      className="p-2 text-muted hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-serif italic text-text mb-3 leading-tight tracking-tight">{journal.title}</h3>
                <p className="text-text-dim whitespace-pre-wrap line-clamp-4 leading-relaxed font-serif italic text-sm flex-1">
                  {journal.content}
                </p>
                
                <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                  <div className="flex items-center text-gold text-[10px] uppercase tracking-tighter font-bold space-x-2">
                    <span>#reflection</span>
                    <span className="text-border">•</span>
                    <span>#journal</span>
                  </div>
                  <div className="text-[10px] text-muted/50 uppercase tracking-widest font-bold">
                    Lumina Journal
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-24 bg-sidebar rounded-2xl border border-dashed border-border group">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-6 border border-border group-hover:scale-110 transition-transform">
              <Book className="w-8 h-8 text-muted" />
            </div>
            <h3 className="text-text font-serif italic text-xl mb-2">The pages are empty.</h3>
            <p className="text-muted text-sm mb-8 font-serif italic">
              {searchTerm ? 'Nothing found in the archives.' : 'Speak your truth. The journal is listening.'}
            </p>
            {!searchTerm && (
              <button 
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl text-muted font-bold uppercase text-[10px] tracking-widest hover:text-text hover:border-gold transition-all"
              >
                <Plus className="w-4 h-4" />
                Begin Writing
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
