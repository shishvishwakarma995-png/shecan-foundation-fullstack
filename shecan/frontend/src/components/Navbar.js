import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/volunteer', label: 'Volunteer' },
  ];

  return (
    <>
      <style>{`
        @keyframes navSlide {
          from { opacity: 0; transform: translateY(-100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-root {
          animation: navSlide 0.45s ease both;
          position: sticky; top: 0; z-index: 999;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          transition: box-shadow 0.3s;
        }
        .nav-root.scrolled {
          box-shadow: 0 4px 30px rgba(181,68,110,0.10);
        }
        .nav-link {
          position: relative;
          padding: 0.5rem 0.85rem;
          border-radius: 8px;
          font-size: 0.95rem;
          color: var(--text-muted);
          transition: color 0.2s, background 0.2s;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 2px; left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 60%; height: 2px;
          background: var(--primary);
          border-radius: 2px;
          transition: transform 0.25s ease;
        }
        .nav-link:hover { color: var(--primary); background: var(--primary-light); }
        .nav-link:hover::after { transform: translateX(-50%) scaleX(1); }
        .nav-link.active { color: var(--primary); background: var(--primary-light); font-weight: 600; }
        .nav-link.active::after { transform: translateX(-50%) scaleX(1); }

        .nav-cta {
          padding: 0.5rem 1.25rem;
          background: var(--primary);
          color: #fff !important;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
          margin-left: 0.25rem;
        }
        .nav-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(181,68,110,0.3);
          background: var(--primary-dark);
        }
        .nav-cta::after { display: none !important; }

        .hamburger-btn {
          display: none;
          background: none; border: none;
          font-size: 1.5rem;
          color: var(--text);
          padding: 4px;
          transition: transform 0.2s;
        }
        .hamburger-btn:hover { transform: scale(1.1); color: var(--primary); }

        .mobile-menu {
          display: none;
          flex-direction: column;
          padding: 0.75rem 1.5rem 1rem;
          border-bottom: 1px solid var(--border);
          background: rgba(255,255,255,0.97);
          animation: fadeInUp 0.2s ease;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu .nav-link { padding: 0.7rem 1rem; }
        .mobile-menu .nav-cta { margin: 0.5rem 0 0; text-align: center; }

        @media (max-width: 768px) {
          .desktop-links { display: none !important; }
          .hamburger-btn { display: block; }
        }
      `}</style>

      <nav className={`nav-root${scrolled ? ' scrolled' : ''}`}>
        <div style={styles.container}>
          {/* Logo */}
          <Link to="/" style={styles.logo}>
            <span style={styles.logoIcon} className="anim-float">🌸</span>
            <span>
              She <span style={{ color: 'var(--primary)' }}>Can</span> Foundation
            </span>
          </Link>

          {/* Desktop links */}
          <div className="desktop-links" style={styles.linksRow}>
            {links.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                className={`nav-link${pathname === l.to ? ' active' : ''}`}
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/volunteer" className="nav-cta">Join Us 🌸</Link>
          </div>

          {/* Hamburger */}
          <button
            className="hamburger-btn"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu${open ? ' open' : ''}`}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link${pathname === l.to ? ' active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/volunteer" className="nav-cta">Join Us 🌸</Link>
        </div>
      </nav>
    </>
  );
};

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 1.5rem',
    height: '68px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1.2rem',
    fontWeight: '700',
    fontFamily: "'Playfair Display', serif",
    color: 'var(--text)',
  },
  logoIcon: { fontSize: '1.5rem', display: 'inline-block' },
  linksRow: { display: 'flex', alignItems: 'center', gap: '0.25rem' },
};

export default Navbar;