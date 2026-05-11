import express from 'express';
import Journal from '../models/Journal.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /journals - Fetch entries for current user
router.get('/', auth, async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(journals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching journals' });
  }
});

// POST /journals - Create entry
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, date } = req.body;
    const newJournal = new Journal({
      title,
      content,
      date: date || Date.now(),
      userId: req.user.id
    });
    const savedJournal = await newJournal.save();
    res.status(201).json(savedJournal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating journal' });
  }
});

// PUT /journals/:id - Update entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, date } = req.body;
    
    let journal = await Journal.findById(req.params.id);
    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    // Verify ownership
    if (journal.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    journal = await Journal.findByIdAndUpdate(
      req.params.id,
      { $set: { title, content, date: date || journal.date } },
      { new: true }
    );

    res.json(journal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating journal' });
  }
});

// DELETE /journals/:id - Delete entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    // Verify ownership
    if (journal.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Journal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Journal removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting journal' });
  }
});

export default router;
