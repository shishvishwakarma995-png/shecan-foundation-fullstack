const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

// POST /api/volunteers - public: register as volunteer
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('motivation').trim().isLength({ min: 20 }).withMessage('Please tell us a bit more about your motivation (min 20 chars)'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, city, skills, motivation } = req.body;

    try {
      // Check for duplicate email
      const [existing] = await pool.query('SELECT id FROM volunteers WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(409).json({ success: false, message: 'This email has already been registered as a volunteer.' });
      }

      const [result] = await pool.query(
        'INSERT INTO volunteers (name, email, phone, city, skills, motivation) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, phone, city, skills || null, motivation]
      );

      res.status(201).json({
        success: true,
        message: 'Thank you for registering! We will contact you soon.',
        id: result.insertId,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
  }
);

// GET /api/volunteers - admin: get all volunteers
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM volunteers';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM volunteers${status ? ' WHERE status = ?' : ''}`,
      status ? [status] : []
    );

    res.json({ success: true, data: rows, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /api/volunteers/:id/status - admin: approve/reject
router.patch('/:id/status', authMiddleware, async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }
  try {
    await pool.query('UPDATE volunteers SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Volunteer status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/volunteers/stats - admin: summary stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const [[stats]] = await pool.query(`
      SELECT
        COUNT(*) as total,
        SUM(status = 'pending') as pending,
        SUM(status = 'approved') as approved,
        SUM(status = 'rejected') as rejected
      FROM volunteers
    `);
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
