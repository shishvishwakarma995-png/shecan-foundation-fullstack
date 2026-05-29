require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/volunteers', require('./routes/volunteers'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'She Can Foundation API is running 🚀' });
});

// Dashboard stats (admin)
const authMiddleware = require('./middleware/auth');
app.get('/api/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const [[subStats]] = await pool.query(`
      SELECT
        COUNT(*) as total_submissions,
        SUM(status = 'new') as new_submissions,
        SUM(status = 'read') as read_submissions,
        SUM(status = 'replied') as replied_submissions
      FROM submissions
    `);
    const [[volStats]] = await pool.query(`
      SELECT
        COUNT(*) as total_volunteers,
        SUM(status = 'pending') as pending_volunteers,
        SUM(status = 'approved') as approved_volunteers
      FROM volunteers
    `);
    const [recentSubs] = await pool.query(
      'SELECT id, name, email, subject, status, created_at FROM submissions ORDER BY created_at DESC LIMIT 5'
    );
    res.json({
      success: true,
      stats: { ...subStats, ...volStats },
      recentSubmissions: recentSubs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🌸 She Can Foundation Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🔒 Admin Login: POST /api/auth/login\n`);
});
