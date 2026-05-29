import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={styles.footer}>
    <div style={styles.container}>
      <div style={styles.grid}>
        <div>
          <h3 style={styles.brand}>🌸 She Can Foundation</h3>
          <p style={styles.tagline}>
            Empowering youth through education, digital initiatives, and community-driven programs.
          </p>
        </div>
        <div>
          <h4 style={styles.heading}>Quick Links</h4>
          {[['/', 'Home'], ['/about', 'About Us'], ['/contact', 'Contact'], ['/volunteer', 'Volunteer']].map(([to, label]) => (
            <Link key={to} to={to} style={styles.link}>{label}</Link>
          ))}
        </div>
        <div>
          <h4 style={styles.heading}>Contact</h4>
          <p style={styles.info}>📧 info@shecanfoundation.org</p>
          <p style={styles.info}>🌐 www.shecanfoundation.org</p>
          <p style={styles.info}>📸 @shecanfoundation.ngo</p>
        </div>
      </div>
      <div style={styles.bottom}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} She Can Foundation. All rights reserved.
        </p>
        <Link to="/admin/login" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
          Admin
        </Link>
      </div>
    </div>
  </footer>
);

const styles = {
  footer: {
    background: '#1a1a2e',
    color: '#fff',
    marginTop: '4rem',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '3rem 1.5rem 1.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  brand: {
    fontSize: '1.2rem',
    marginBottom: '0.75rem',
    fontFamily: "'Playfair Display', serif",
  },
  tagline: {
    fontSize: '0.88rem',
    color: 'rgba(255,255,255,0.55)',
    lineHeight: '1.7',
  },
  heading: {
    fontSize: '0.85rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--primary)',
    marginBottom: '1rem',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: '600',
  },
  link: {
    display: 'block',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
    transition: 'color 0.2s',
  },
  info: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.88rem',
    marginBottom: '0.5rem',
  },
  bottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1.5rem',
  },
};

export default Footer;
