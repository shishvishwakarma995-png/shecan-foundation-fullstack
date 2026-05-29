import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getVolunteers, updateVolunteerStatus } from '../api';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  pending: { bg: '#fff3e0', color: '#e65100' },
  approved: { bg: '#e8f5e9', color: '#2e7d32' },
  rejected: { bg: '#ffeaea', color: '#c62828' },
};

const AdminVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const fetchData = () => {
    setLoading(true);
    getVolunteers({ page, limit: 10, status: statusFilter || undefined })
      .then((res) => { setVolunteers(res.data.data); setTotal(res.data.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page, statusFilter]);

  const handleStatus = async (id, status) => {
    await updateVolunteerStatus(id, status);
    fetchData();
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
          <h1 style={styles.pageTitle}>Volunteer Applications</h1>
          <p style={styles.meta}>{total} total volunteers</p>
        </div>

        <div style={styles.filters}>
          {['', 'pending', 'approved', 'rejected'].map((s) => (
            <button
              key={s}
              style={{ ...styles.filterBtn, background: statusFilter === s ? 'var(--primary)' : 'var(--surface)', color: statusFilter === s ? '#fff' : 'var(--text)' }}
              onClick={() => { setStatusFilter(s); setPage(1); }}
            >
              {s || 'All'}
            </button>
          ))}
        </div>

        <div style={styles.tableCard}>
          {loading ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</p>
          ) : volunteers.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No volunteers found.</p>
          ) : (
            volunteers.map((v) => (
              <div key={v.id} style={styles.rowCard}>
                <div style={styles.rowTop}>
                  <div>
                    <strong>{v.name}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.75rem' }}>{v.email}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.75rem' }}>📍 {v.city}</span>
                  </div>
                  <div style={styles.rowActions}>
                    <span style={{ ...styles.badge, ...statusColors[v.status] }}>{v.status}</span>
                    <select
                      style={styles.statusSelect}
                      value={v.status}
                      onChange={(e) => handleStatus(v.id, e.target.value)}
                    >
                      {['pending', 'approved', 'rejected'].map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <button style={styles.expandBtn} onClick={() => setExpanded(expanded === v.id ? null : v.id)}>
                      {expanded === v.id ? 'Hide' : 'View Details'}
                    </button>
                  </div>
                </div>
                <div style={styles.rowMeta}>
                  <span>📱 {v.phone}</span>
                  <span>📅 {new Date(v.created_at).toLocaleDateString()}</span>
                </div>
                {expanded === v.id && (
                  <div style={styles.detailBox}>
                    {v.skills && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Skills:</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {v.skills.split(',').map((s) => (
                            <span key={s} style={styles.skillTag}>{s.trim()}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Motivation:</span>
                      <p style={{ fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>{v.motivation}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

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
  detailBox: { marginTop: '0.75rem', background: 'var(--bg)', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  detailRow: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  detailLabel: { fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  skillTag: { background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.78rem', fontWeight: '500' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '1.5rem' },
  pageBtn: { padding: '0.5rem 1rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--surface)', cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'inherit' },
};

export default AdminVolunteers;
