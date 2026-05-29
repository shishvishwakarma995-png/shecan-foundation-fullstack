import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../api';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  new: { bg: '#e8f5e9', color: '#2e7d32' },
  read: { bg: '#fff3e0', color: '#e65100' },
  replied: { bg: '#e3f2fd', color: '#0d47a1' },
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardStats()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  if (loading) return (
    <div style={styles.loading}>
      <span style={{ fontSize: '2rem' }}>🌸</span>
      <p>Loading dashboard...</p>
    </div>
  );

  const s = data?.stats || {};

  const statCards = [
    { label: 'Total Submissions', value: s.total_submissions || 0, icon: '📩', color: '#b5446e' },
    { label: 'New Messages', value: s.new_submissions || 0, icon: '🆕', color: '#e65100' },
    { label: 'Total Volunteers', value: s.total_volunteers || 0, icon: '🤝', color: '#1976d2' },
    { label: 'Approved Volunteers', value: s.approved_volunteers || 0, icon: '✅', color: '#388e3c' },
  ];

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <span style={{ fontSize: '1.5rem' }}>🌸</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem' }}>She Can</span>
        </div>
        <nav style={styles.sideNav}>
          {[
            { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
            { to: '/admin/submissions', icon: '📩', label: 'Submissions' },
            { to: '/admin/volunteers', icon: '🤝', label: 'Volunteers' },
          ].map((item) => (
            <Link key={item.to} to={item.to} style={styles.navLink}>
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
        <div style={styles.sidebarFooter}>
          <p style={styles.adminName}>{admin?.name}</p>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <div style={styles.topBar}>
          <h1 style={styles.pageTitle}>Dashboard</h1>
          <p style={styles.welcome}>Welcome back, {admin?.name?.split(' ')[0]}! 👋</p>
        </div>

        {/* Stat Cards */}
        <div style={styles.statsGrid}>
          {statCards.map((sc) => (
            <div key={sc.label} style={styles.statCard}>
              <span style={styles.statIcon}>{sc.icon}</span>
              <div>
                <p style={{ ...styles.statValue, color: sc.color }}>{sc.value}</p>
                <p style={styles.statLabel}>{sc.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Submissions */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>Recent Submissions</h2>
            <Link to="/admin/submissions" style={styles.viewAll}>View All →</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  {['Name', 'Email', 'Subject', 'Status', 'Date'].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.recentSubmissions?.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No submissions yet</td></tr>
                ) : (
                  data?.recentSubmissions?.map((row) => (
                    <tr key={row.id} style={styles.tr}>
                      <td style={styles.td}>{row.name}</td>
                      <td style={styles.td}>{row.email}</td>
                      <td style={styles.td}>{row.subject}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...statusColors[row.status] }}>
                          {row.status}
                        </span>
                      </td>
                      <td style={styles.td}>{new Date(row.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: 'var(--bg)' },
  sidebar: {
    width: '220px',
    background: '#1a1a2e',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem 1rem',
    position: 'sticky',
    top: 0,
    height: '100vh',
    flexShrink: 0,
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
  },
  sideNav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.7rem 0.8rem',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.9rem',
    transition: 'background 0.2s',
  },
  sidebarFooter: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '1rem',
    marginTop: '1rem',
  },
  adminName: { fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' },
  logoutBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#fff',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  main: { flex: 1, padding: '2rem', overflow: 'auto' },
  topBar: { marginBottom: '2rem' },
  pageTitle: { fontSize: '1.8rem', marginBottom: '0.25rem' },
  welcome: { color: 'var(--text-muted)', fontSize: '0.95rem' },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  statIcon: { fontSize: '2rem' },
  statValue: { fontSize: '1.8rem', fontWeight: '700', fontFamily: "'Playfair Display', serif" },
  statLabel: { fontSize: '0.82rem', color: 'var(--text-muted)' },
  tableCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--border)',
  },
  tableTitle: { fontSize: '1.1rem', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' },
  viewAll: { color: 'var(--primary)', fontSize: '0.88rem', fontWeight: '500' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: 'var(--bg)' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr: { borderBottom: '1px solid var(--border)' },
  td: { padding: '0.9rem 1rem', fontSize: '0.9rem' },
  badge: {
    padding: '0.25rem 0.7rem',
    borderRadius: '50px',
    fontSize: '0.78rem',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: '1rem', color: 'var(--text-muted)' },
};

export default Dashboard;
