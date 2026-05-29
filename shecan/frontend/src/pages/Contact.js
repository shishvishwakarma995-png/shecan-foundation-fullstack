import { useState } from 'react';
import { submitContactForm } from '../api';

const subjects = ['General Enquiry', 'Volunteering', 'Donations', 'Partnership', 'Internship', 'Other'];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General Enquiry', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.message.trim()) errs.message = 'Message is required';
    else if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setServerError('');
    try {
      const res = await submitContactForm(form);
      setSuccess(res.data.message);
      setForm({ name: '', email: '', phone: '', subject: 'General Enquiry', message: '' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.badge}>Get In Touch</span>
          <h1 style={styles.title}>Contact Us</h1>
          <p style={styles.sub}>Have a question or want to get involved? We'd love to hear from you.</p>
        </div>

        <div style={styles.grid}>
          {/* Info */}
          <div style={styles.infoCol}>
            {[
              { icon: '📧', label: 'Email', value: 'info@shecanfoundation.org' },
              { icon: '📸', label: 'Instagram', value: '@shecanfoundation.ngo' },
              { icon: '💼', label: 'LinkedIn', value: 'She Can Foundation' },
            ].map((item) => (
              <div key={item.label} style={styles.infoCard}>
                <span style={styles.infoIcon}>{item.icon}</span>
                <div>
                  <p style={styles.infoLabel}>{item.label}</p>
                  <p style={styles.infoValue}>{item.value}</p>
                </div>
              </div>
            ))}
            <div style={styles.missionCard}>
              <h3 style={styles.missionTitle}>Our Mission</h3>
              <p style={styles.missionText}>
                To empower youth through education, digital skills, and community-driven initiatives —
                creating a future where every student gets a fair opportunity to grow.
              </p>
            </div>
          </div>

          {/* Form */}
          <div style={styles.formCard}>
            {success ? (
              <div style={styles.successBox}>
                <span style={{ fontSize: '3rem' }}>✅</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: '0.5rem' }}>Form Submitted Successfully!</h3>
                <p style={{ color: 'var(--text-muted)' }}>{success}</p>
                <button style={styles.resetBtn} onClick={() => setSuccess('')}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h2 style={styles.formTitle}>Send a Message</h2>

                {serverError && <div style={styles.errorBanner}>{serverError}</div>}

                <div style={styles.row}>
                  <Field label="Full Name *" error={errors.name}>
                    <input style={inputStyle(errors.name)} name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
                  </Field>
                  <Field label="Email Address *" error={errors.email}>
                    <input style={inputStyle(errors.email)} name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
                  </Field>
                </div>

                <div style={styles.row}>
                  <Field label="Phone (Optional)">
                    <input style={inputStyle()} name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                  </Field>
                  <Field label="Subject">
                    <select style={inputStyle()} name="subject" value={form.subject} onChange={handleChange}>
                      {subjects.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>

                <Field label="Message *" error={errors.message}>
                  <textarea
                    style={{ ...inputStyle(errors.message), resize: 'vertical', minHeight: '130px' }}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                  />
                </Field>

                <button type="submit" style={styles.submitBtn} disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, error, children }) => (
  <div style={{ flex: 1 }}>
    <label style={styles.label}>{label}</label>
    {children}
    {error && <span style={styles.errorText}>{error}</span>}
  </div>
);

const inputStyle = (error) => ({
  width: '100%',
  padding: '0.7rem 1rem',
  border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
  borderRadius: '8px',
  fontSize: '0.95rem',
  background: '#fff',
  outline: 'none',
  transition: 'border 0.2s',
  marginTop: '0.3rem',
});

const styles = {
  page: { padding: '3rem 0 5rem' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' },
  header: { textAlign: 'center', marginBottom: '3rem' },
  badge: {
    display: 'inline-block',
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    padding: '0.35rem 1rem',
    borderRadius: '50px',
    fontSize: '0.82rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  title: { fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '0.75rem' },
  sub: { color: 'var(--text-muted)', fontSize: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' },
  infoCol: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  infoCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  infoIcon: { fontSize: '1.5rem' },
  infoLabel: { fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' },
  infoValue: { fontSize: '0.92rem', fontWeight: '500' },
  missionCard: {
    background: 'var(--primary-light)',
    borderRadius: 'var(--radius)',
    padding: '1.5rem',
    borderLeft: '4px solid var(--primary)',
  },
  missionTitle: { fontFamily: "'DM Sans', sans-serif", fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' },
  missionText: { fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7' },
  formCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '2rem',
  },
  formTitle: { fontSize: '1.4rem', marginBottom: '1.5rem', fontFamily: "'Playfair Display', serif" },
  row: { display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' },
  label: { fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block' },
  errorText: { fontSize: '0.8rem', color: 'var(--danger)', marginTop: '0.25rem', display: 'block' },
  errorBanner: {
    background: '#ffeaea',
    border: '1px solid var(--danger)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: 'var(--danger)',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  submitBtn: {
    width: '100%',
    marginTop: '1rem',
    padding: '0.85rem',
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  successBox: {
    textAlign: 'center',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
  },
  resetBtn: {
    marginTop: '1rem',
    padding: '0.6rem 1.5rem',
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    border: 'none',
    borderRadius: '50px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};

export default Contact;
