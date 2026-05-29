import { useState } from 'react';
import { registerVolunteer } from '../api';

const skillOptions = ['Web Development', 'Graphic Design', 'Teaching', 'Content Writing', 'Social Media', 'Event Management', 'Fundraising', 'Photography', 'Video Editing', 'Other'];

const Volunteer = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', skills: [], motivation: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (form.motivation.trim().length < 20) e.motivation = 'Please write at least 20 characters';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const toggleSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setServerError('');
    try {
      const res = await registerVolunteer({ ...form, skills: form.skills.join(', ') });
      setSuccess(res.data.message);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.successPage}>
        <span style={{ fontSize: '4rem' }}>🎉</span>
        <h2 style={styles.successTitle}>Thank You for Registering!</h2>
        <p style={styles.successSub}>{success}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          We will review your application and reach out to you on the provided contact details.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.badge}>Make an Impact</span>
          <h1 style={styles.title}>Volunteer With Us</h1>
          <p style={styles.sub}>Join our community of passionate volunteers and help us empower young lives.</p>
        </div>

        <div style={styles.grid}>
          {/* Benefits */}
          <div>
            <h3 style={styles.sideTitle}>Why Volunteer?</h3>
            {[
              { icon: '📜', t: 'Official Certificate', d: 'Get a verified volunteer certificate.' },
              { icon: '🌟', t: 'Letter of Recommendation', d: 'Performance-based LOR available.' },
              { icon: '🤝', t: 'Networking', d: 'Connect with like-minded change-makers.' },
              { icon: '🚀', t: 'Leadership Roles', d: 'Opportunity to join our core team.' },
            ].map((b) => (
              <div key={b.t} style={styles.benefitCard}>
                <span style={styles.benefitIcon}>{b.icon}</span>
                <div>
                  <p style={styles.benefitTitle}>{b.t}</p>
                  <p style={styles.benefitDesc}>{b.d}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>Volunteer Registration</h2>
            {serverError && <div style={styles.errorBanner}>{serverError}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div style={styles.row}>
                <Field label="Full Name *" error={errors.name}>
                  <input style={iStyle(errors.name)} name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
                </Field>
                <Field label="Email *" error={errors.email}>
                  <input style={iStyle(errors.email)} name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
                </Field>
              </div>

              <div style={styles.row}>
                <Field label="Phone *" error={errors.phone}>
                  <input style={iStyle(errors.phone)} name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                </Field>
                <Field label="City *" error={errors.city}>
                  <input style={iStyle(errors.city)} name="city" value={form.city} onChange={handleChange} placeholder="Your city" />
                </Field>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={styles.label}>Your Skills (Select all that apply)</label>
                <div style={styles.skillsGrid}>
                  {skillOptions.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      style={{
                        ...styles.skillChip,
                        background: form.skills.includes(skill) ? 'var(--primary)' : 'var(--primary-light)',
                        color: form.skills.includes(skill) ? '#fff' : 'var(--primary)',
                      }}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Why do you want to volunteer? *" error={errors.motivation}>
                <textarea
                  style={{ ...iStyle(errors.motivation), resize: 'vertical', minHeight: '120px' }}
                  name="motivation"
                  value={form.motivation}
                  onChange={handleChange}
                  placeholder="Tell us about your motivation and what you hope to contribute..."
                />
              </Field>

              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Submitting...' : 'Register as Volunteer 🌸'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, error, children }) => (
  <div style={{ flex: 1, minWidth: '200px', marginBottom: '1rem' }}>
    <label style={styles.label}>{label}</label>
    {children}
    {error && <span style={styles.errorText}>{error}</span>}
  </div>
);

const iStyle = (err) => ({
  width: '100%',
  padding: '0.7rem 1rem',
  border: `1.5px solid ${err ? 'var(--danger)' : 'var(--border)'}`,
  borderRadius: '8px',
  fontSize: '0.95rem',
  background: '#fff',
  marginTop: '0.3rem',
  outline: 'none',
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
  sideTitle: { fontFamily: "'DM Sans', sans-serif", fontWeight: '700', marginBottom: '1rem', fontSize: '1.1rem' },
  benefitCard: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-start',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1rem',
    marginBottom: '0.75rem',
  },
  benefitIcon: { fontSize: '1.4rem', flexShrink: 0 },
  benefitTitle: { fontWeight: '600', fontSize: '0.92rem', marginBottom: '0.2rem' },
  benefitDesc: { fontSize: '0.83rem', color: 'var(--text-muted)' },
  formCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '2rem',
  },
  formTitle: { fontSize: '1.4rem', marginBottom: '1.5rem', fontFamily: "'Playfair Display', serif" },
  row: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
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
  skillsGrid: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' },
  skillChip: {
    padding: '0.35rem 0.85rem',
    borderRadius: '50px',
    fontSize: '0.82rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
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
  },
  successPage: {
    maxWidth: '500px',
    margin: '5rem auto',
    textAlign: 'center',
    padding: '3rem',
    background: 'var(--surface)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
  },
  successTitle: { fontSize: '1.6rem' },
  successSub: { color: 'var(--primary)', fontWeight: '500' },
};

export default Volunteer;
