import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../api';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginAdmin(form);
      login(res.data.token, res.data.admin);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-12px) rotate(5deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
        @keyframes petal-fall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .login-card { animation: fadeInUp 0.6s ease both; }
        .logo-flower { animation: float 3s ease-in-out infinite; display: inline-block; }
        .pulse-ring {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 70px; height: 70px;
          border-radius: 50%;
          border: 2px solid var(--primary);
          animation: pulse-ring 1.8s ease-out infinite;
        }
        .login-btn {
          background: linear-gradient(90deg, var(--primary), #e05b8a, var(--primary));
          background-size: 200% auto;
          transition: background-position 0.4s, transform 0.15s, box-shadow 0.2s;
        }
        .login-btn:hover:not(:disabled) {
          background-position: right center;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(181,68,110,0.35);
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .login-input {
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .login-input:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 3px rgba(181,68,110,0.12);
          outline: none;
        }
        .error-box { animation: shake 0.4s ease; }
        .petal {
          position: fixed; top: -30px; font-size: 1.4rem;
          animation: petal-fall linear infinite;
          pointer-events: none; z-index: 0;
          user-select: none;
        }
        .show-pass-btn {
          background: none; border: none;
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted); cursor: pointer;
          font-size: 1rem; padding: 4px;
        }
        .show-pass-btn:hover { color: var(--primary); }
      `}</style>

      {/* Floating petals background */}
      {['🌸','🌺','🌷','🌼','✿'].map((petal, i) => (
        <span key={i} className="petal" style={{
          left: `${10 + i * 18}%`,
          animationDuration: `${6 + i * 1.5}s`,
          animationDelay: `${i * 1.2}s`,
        }}>{petal}</span>
      ))}

      <div style={styles.page}>
        <div className="login-card" style={styles.card}>

          {/* Logo area */}
          <div style={styles.logoArea}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.5rem' }}>
              <span className="pulse-ring" />
              <span className="logo-flower" style={{ fontSize: '2.8rem', position: 'relative', zIndex: 1 }}>🌸</span>
            </div>
            <h1 style={styles.title}>She Can Foundation</h1>
            <p style={styles.sub}>Admin Portal</p>
          </div>

          {error && (
            <div className="error-box" style={styles.errorBanner}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                className="login-input"
                style={styles.input}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@shecanfoundation.org"
                required
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="login-input"
                  style={{ ...styles.input, paddingRight: '2.5rem' }}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="show-pass-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" style={styles.btn} disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span style={styles.spinner} /> Signing in...
                </span>
              ) : (
                '🔐 Sign In to Admin Panel'
              )}
            </button>
          </form>

          <div style={styles.hint}>
            <span style={{ marginRight: '0.4rem' }}>🔑</span>
            Default: admin@shecanfoundation.org / Admin@123
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f7d6e3 0%, #fdf8f5 50%, #f0e6f0 100%)',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  card: {
    background: '#fff',
    borderRadius: '24px',
    padding: '2.8rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(181,68,110,0.15), 0 4px 20px rgba(0,0,0,0.05)',
    border: '1px solid rgba(181,68,110,0.1)',
    position: 'relative',
    zIndex: 1,
  },
  logoArea: { textAlign: 'center', marginBottom: '2rem' },
  title: {
    fontSize: '1.45rem',
    marginTop: '0.6rem',
    marginBottom: '0.3rem',
    color: '#1a1a2e',
    fontFamily: "'Playfair Display', serif",
  },
  sub: { color: '#6b6b8a', fontSize: '0.88rem', letterSpacing: '0.08em', textTransform: 'uppercase' },
  errorBanner: {
    background: '#fff0f0',
    border: '1px solid #e74c3c',
    borderLeft: '4px solid #e74c3c',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#c0392b',
    fontSize: '0.88rem',
    marginBottom: '1.2rem',
  },
  fieldGroup: { marginBottom: '1.3rem' },
  label: {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: '600',
    color: '#6b6b8a',
    marginBottom: '0.45rem',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: '0.8rem 1rem',
    border: '1.5px solid #e8ddd5',
    borderRadius: '10px',
    fontSize: '0.95rem',
    background: '#fafafa',
    color: '#1a1a2e',
    boxSizing: 'border-box',
  },
  btn: {
    width: '100%',
    padding: '0.9rem',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.5rem',
    letterSpacing: '0.02em',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.4)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  hint: {
    marginTop: '1.6rem',
    textAlign: 'center',
    fontSize: '0.78rem',
    color: '#6b6b8a',
    background: '#fdf8f5',
    padding: '0.65rem',
    borderRadius: '8px',
    border: '1px solid #e8ddd5',
  },
};

export default AdminLogin;