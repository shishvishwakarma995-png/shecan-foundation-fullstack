import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSubmissions, updateSubmissionStatus, deleteSubmission } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const statusOptions = ['new', 'read', 'replied'];
const statusColors = {
  new: { bg: '#e8f5e9', color: '#2e7d32' },
  read: { bg: '#fff3e0', color: '#e65100' },
  replied: { bg: '#e3f2fd', color: '#0d47a1' },
};

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const fetchData = () => {
    setLoading(true);
    getSubmissions({ page, limit: 10, status: statusFilter || undefined })
      .then((res) => { setSubmissions(res.data.data); setTotal(res.data.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page, statusFilter]);

  const handleStatus = async (id, status) => {
    await updateSubmissionStatus(id, status);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this submission?')) {
      await deleteSubmission(id);
      fetchData();
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <span>🌸</span>
          <span style={{ fontFamily: "'Playfair Display', serif" }}>She Can</span>
        </div>
        <nav style={styles.sideNav}>
          {[
            { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
            { to: '/admin/submissions', icon: '📩', label: 'Submissions' },
            { to: '/admin/volunteers', icon: '🤝', label: 'Volunteers' },
          ].map((item) => (
            <Link key={item.to} to={item.to} style={styles.navLink}><span>{item.icon}</span> {item.label}</Link>
          ))}
        </nav>
        <div style={styles.sidebarFooter}>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>{admin?.name}</p>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main style={styles.main}>
        <div style={styles.topBar}>
          <h1 style={styles.pageTitle}>Contact Submissions</h1>
          <p style={styles.meta}>{total} total submissions</p>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          {['', ...statusOptions].map((s) => (
            <button
              key={s}
              style={{ ...styles.filterBtn, background: statusFilter === s ? 'var(--primary)' : 'var(--surface)', color: statusFilter === s ? '#fff' : 'var(--text)' }}
              onClick={() => { setStatusFilter(s); setPage(1); }}
            >
              {s || 'All'}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={styles.tableCard}>
          {loading ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</p>
          ) : submissions.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No submissions found.</p>
          ) : (
            submissions.map((row) => (
              <div key={row.id} style={styles.rowCard}>
                <div style={styles.rowTop}>
                  <div>
                    <strong style={{ fontSize: '0.95rem' }}>{row.name}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.75rem' }}>{row.email}</span>
                    {row.phone && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.75rem' }}>{row.phone}</span>}
                  </div>
                  <div style={styles.rowActions}>
                    <span style={{ ...styles.badge, ...statusColors[row.status] }}>{row.status}</span>
                    <select
                      style={styles.statusSelect}
                      value={row.status}
                      onChange={(e) => handleStatus(row.id, e.target.value)}
                    >
                      {statusOptions.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <button style={styles.expandBtn} onClick={() => setExpanded(expanded === row.id ? null : row.id)}>
                      {expanded === row.id ? 'Hide' : 'Read'}
                    </button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(row.id)}>Delete</button>
                  </div>
                </div>
                <div style={styles.rowMeta}>
                  <span>📌 {row.subject}</span>
                  <span>📅 {new Date(row.created_at).toLocaleString()}</span>
                </div>
                {expanded === row.id && (
                  <div style={styles.messageBox}>
                    <p style={styles.messageText}>{row.message}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {total > 10 && (
          <div style={styles.pagination}>
            <button style={styles.pageBtn} disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Page {page} of {Math.ceil(total / 10)}</span>
            <button style={styles.pageBtn} disabled={page >= Math.ceil(total / 10)} onClick={() => setPage(page + 1)}>Next →</button>
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: 'var(--bg)' },
  sidebar: { width: '220px', background: '#1a1a2e', color: '#fff', display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff' },
  sideNav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  navLink: { display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 0.8rem', borderRadius: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' },
  sidebarFooter: { borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '1rem' },
  logoutBtn: { background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' },
  main: { flex: 1, padding: '2rem', overflow: 'auto' },
  topBar: { marginBottom: '1.5rem' },
  pageTitle: { fontSize: '1.8rem', marginBottom: '0.25rem' },
  meta: { color: 'var(--text-muted)', fontSize: '0.9rem' },
  filters: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  filterBtn: { padding: '0.4rem 1rem', border: '1px solid var(--border)', borderRadius: '50px', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit' },
  tableCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' },
  rowCard: { padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' },
  rowTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' },
  rowActions: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  rowMeta: { display: 'flex', gap: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '600' },
  statusSelect: { padding: '0.3rem 0.6rem', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.82rem', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' },
  expandBtn: { padding: '0.3rem 0.7rem', background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' },
  deleteBtn: { padding: '0.3rem 0.7rem', background: '#ffeaea', color: 'var(--danger)', border: 'none', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' },
  messageBox: { marginTop: '0.75rem', background: 'var(--bg)', borderRadius: '8px', padding: '0.75rem 1rem', borderLeft: '3px solid var(--primary)' },
  messageText: { fontSize: '0.9rem', lineHeight: '1.6' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '1.5rem' },
  pageBtn: { padding: '0.5rem 1rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--surface)', cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'inherit' },
};

export default AdminSubmissions;
