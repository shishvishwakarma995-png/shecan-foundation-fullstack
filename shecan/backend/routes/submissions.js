const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

// POST /api/submissions - public: submit contact form
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
    body('subject').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, message, subject } = req.body;

    try {
      const [result] = await pool.query(
        'INSERT INTO submissions (name, email, phone, message, subject) VALUES (?, ?, ?, ?, ?)',
        [name, email, phone || null, message, subject || 'General Enquiry']
      );
      res.status(201).json({
        success: true,
        message: 'Form Submitted Successfully! We will get back to you soon.',
        id: result.insertId,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
  }
);

// GET /api/submissions - admin: get all submissions
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM submissions';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM submissions${status ? ' WHERE status = ?' : ''}`,
      status ? [status] : []
    );

    res.json({ success: true, data: rows, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /api/submissions/:id/status - admin: update status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['new', 'read', 'replied'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  try {
    await pool.query('UPDATE submissions SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/submissions/:id - admin: delete submission
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM submissions WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Submission deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
