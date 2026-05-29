import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const team = [
  { name: 'Priya Sharma', role: 'Founder & CEO', emoji: '👩‍💼' },
  { name: 'Anjali Verma', role: 'Head of Programs', emoji: '👩‍🏫' },
  { name: 'Riya Patel', role: 'Tech Lead', emoji: '👩‍💻' },
  { name: 'Sneha Gupta', role: 'Community Manager', emoji: '👩‍🤝‍👩' },
];

const milestones = [
  { year: '2020', title: 'Foundation Established', desc: 'She Can Foundation was started with a vision to empower youth through education.' },
  { year: '2021', title: 'First 100 Students', desc: 'Reached 100 students across 3 cities with digital literacy programs.' },
  { year: '2022', title: 'Tech Internship Launch', desc: 'Launched beginner-friendly tech internships for students and freshers.' },
  { year: '2023', title: '500+ Lives Impacted', desc: 'Expanded to 5 cities with 50+ active volunteers and 20+ programs.' },
  { year: '2024', title: 'Digital Platform', desc: 'Launched our online platform to connect volunteers and learners nationwide.' },
];

const values = [
  { icon: '💡', title: 'Innovation', desc: 'We embrace creativity and new ideas to solve real-world challenges.' },
  { icon: '🤝', title: 'Inclusion', desc: 'Every student deserves a fair chance regardless of background.' },
  { icon: '🌱', title: 'Growth', desc: 'We foster continuous learning and personal development.' },
  { icon: '❤️', title: 'Compassion', desc: 'We lead with empathy and genuine care for our community.' },
];

const About = () => {
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.fade-in').forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div>
      <style>{`
        .fade-in { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        .fade-in-left { opacity: 0; transform: translateX(-30px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-in-left.visible { opacity: 1; transform: translateX(0); }
        .team-card:hover { transform: translateY(-6px); box-shadow: 0 12px 30px rgba(181,68,110,0.15); }
        .value-card:hover { border-color: var(--primary) !important; transform: translateY(-4px); }
      `}</style>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <span style={styles.badge} className="fade-in">Our Story</span>
          <h1 style={styles.heroTitle} className="fade-in">About She Can Foundation</h1>
          <p style={styles.heroSub} className="fade-in">
            A youth-driven NGO committed to breaking barriers and creating meaningful opportunities
            for every student who dares to dream.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.mvGrid}>
            <div style={styles.mvCard} className="fade-in">
              <span style={styles.mvIcon}>🎯</span>
              <h2 style={styles.mvTitle}>Our Mission</h2>
              <p style={styles.mvText}>
                To empower youth through education, digital initiatives, and community-driven programs —
                creating a future where every student gets a fair opportunity to learn, explore, and grow
                without unnecessary pressure or unrealistic expectations.
              </p>
            </div>
            <div style={{ ...styles.mvCard, background: 'var(--primary)', color: '#fff' }} className="fade-in">
              <span style={styles.mvIcon}>🌟</span>
              <h2 style={{ ...styles.mvTitle, color: '#fff' }}>Our Vision</h2>
              <p style={{ ...styles.mvText, color: 'rgba(255,255,255,0.85)' }}>
                A world where talent is not judged only by experience, and where every young person —
                regardless of their background — has access to the skills, mentorship, and opportunities
                they need to thrive in the digital age.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ ...styles.section, background: 'var(--bg)' }}>
        <div style={styles.container}>
          <div style={styles.sectionHeader} className="fade-in">
            <span style={styles.badge}>What We Stand For</span>
            <h2 style={styles.sectionTitle}>Our Core Values</h2>
          </div>
          <div style={styles.valuesGrid}>
            {values.map((v, i) => (
              <div
                key={v.title}
                style={{ ...styles.valueCard, transitionDelay: `${i * 0.1}s` }}
                className="fade-in value-card"
              >
                <span style={styles.valueIcon}>{v.icon}</span>
                <h3 style={styles.valueTitle}>{v.title}</h3>
                <p style={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHeader} className="fade-in">
            <span style={styles.badge}>Our Journey</span>
            <h2 style={styles.sectionTitle}>Milestones</h2>
          </div>
          <div style={styles.timeline}>
            {milestones.map((m, i) => (
              <div
                key={m.year}
                style={{ ...styles.timelineItem, flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}
                className="fade-in"
              >
                <div style={styles.timelineContent}>
                  <span style={styles.timelineYear}>{m.year}</span>
                  <h3 style={styles.timelineTitle}>{m.title}</h3>
                  <p style={styles.timelineDesc}>{m.desc}</p>
                </div>
                <div style={styles.timelineDot} />
                <div style={{ flex: 1 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ ...styles.section, background: 'var(--bg)' }}>
        <div style={styles.container}>
          <div style={styles.sectionHeader} className="fade-in">
            <span style={styles.badge}>The People Behind It</span>
            <h2 style={styles.sectionTitle}>Our Team</h2>
          </div>
          <div style={styles.teamGrid}>
            {team.map((member, i) => (
              <div
                key={member.name}
                style={{ ...styles.teamCard, transitionDelay: `${i * 0.1}s` }}
                className="fade-in team-card"
              >
                <div style={styles.teamAvatar}>{member.emoji}</div>
                <h3 style={styles.teamName}>{member.name}</h3>
                <p style={styles.teamRole}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <div style={styles.container}>
          <h2 style={{ ...styles.sectionTitle, color: '#fff', marginBottom: '1rem' }} className="fade-in">
            Be Part of Our Story
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }} className="fade-in">
            Join us as a volunteer, intern, or campus ambassador and help shape the future.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }} className="fade-in">
            <Link to="/volunteer" style={styles.btnWhite}>Join as Volunteer</Link>
            <Link to="/contact" style={styles.btnOutlineWhite}>Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--bg) 100%)',
    padding: '5rem 1.5rem',
    textAlign: 'center',
  },
  heroInner: { maxWidth: '700px', margin: '0 auto' },
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
  heroTitle: { fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' },
  heroSub: { fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto' },
  section: { padding: '4rem 0' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' },
  sectionHeader: { textAlign: 'center', marginBottom: '3rem' },
  sectionTitle: { fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: '0.5rem' },
  mvGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  mvCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '2.5rem',
  },
  mvIcon: { fontSize: '2.5rem', display: 'block', marginBottom: '1rem' },
  mvTitle: { fontSize: '1.4rem', marginBottom: '1rem' },
  mvText: { color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '0.97rem' },
  valuesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' },
  valueCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1.8rem',
    transition: 'border-color 0.2s, transform 0.2s',
    cursor: 'default',
  },
  valueIcon: { fontSize: '2rem', display: 'block', marginBottom: '0.75rem' },
  valueTitle: { fontSize: '1.05rem', fontFamily: "'DM Sans', sans-serif", fontWeight: '600', marginBottom: '0.5rem' },
  valueDesc: { color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' },
  timeline: { maxWidth: '700px', margin: '0 auto', position: 'relative' },
  timelineItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '2rem',
    position: 'relative',
  },
  timelineContent: {
    flex: 1,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1.25rem 1.5rem',
  },
  timelineYear: {
    display: 'inline-block',
    background: 'var(--primary)',
    color: '#fff',
    padding: '0.2rem 0.7rem',
    borderRadius: '50px',
    fontSize: '0.8rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  timelineTitle: { fontSize: '1rem', fontFamily: "'DM Sans', sans-serif", fontWeight: '600', marginBottom: '0.35rem' },
  timelineDesc: { color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' },
  timelineDot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: 'var(--primary)',
    flexShrink: 0,
    border: '3px solid var(--primary-light)',
  },
  teamGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' },
  teamCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '2rem',
    textAlign: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
  },
  teamAvatar: {
    fontSize: '3rem',
    marginBottom: '1rem',
    display: 'block',
    width: '70px',
    height: '70px',
    background: 'var(--primary-light)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
  },
  teamName: { fontSize: '1rem', fontFamily: "'DM Sans', sans-serif", fontWeight: '600', marginBottom: '0.3rem' },
  teamRole: { color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '500' },
  cta: {
    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
    padding: '4rem 1.5rem',
    textAlign: 'center',
  },
  btnWhite: {
    padding: '0.75rem 1.8rem',
    background: '#fff',
    color: 'var(--primary)',
    borderRadius: '50px',
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  btnOutlineWhite: {
    padding: '0.75rem 1.8rem',
    border: '1.5px solid rgba(255,255,255,0.7)',
    color: '#fff',
    borderRadius: '50px',
    fontWeight: '500',
    fontSize: '0.95rem',
  },
};

export default About;