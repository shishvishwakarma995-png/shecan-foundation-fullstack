import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/* ── Animated counter ── */
const Counter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const num = parseInt(target);
          const duration = 1500;
          const steps = 50;
          const increment = num / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= num) { setCount(num); clearInterval(timer); }
            else setCount(Math.floor(current));
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ── Scroll-reveal hook ── */
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

const stats = [
  { number: '500', suffix: '+', label: 'Youth Impacted', icon: '👩‍🎓' },
  { number: '50',  suffix: '+', label: 'Volunteers',     icon: '🤝' },
  { number: '20',  suffix: '+', label: 'Programs',       icon: '📚' },
  { number: '5',   suffix: '+', label: 'Cities',         icon: '🏙️' },
];

const programs = [
  { icon: '💻', title: 'Digital Skills',     desc: 'Coding, design & digital literacy for underprivileged youth.',  color: '#fde8f3' },
  { icon: '📚', title: 'Education Support',  desc: 'Scholarships, mentoring and academic assistance programs.',      color: '#e8f3fe' },
  { icon: '🌱', title: 'Community Projects', desc: 'Building awareness and positive change through community action.', color: '#e8fef0' },
  { icon: '🤝', title: 'Internships',        desc: 'Hands-on experience opportunities for students and freshers.',   color: '#fef4e8' },
];

const testimonials = [
  { name: 'Priya Sharma',   role: 'Volunteer, Delhi',   text: '"She Can gave me purpose. I\'ve grown so much as a person and as a leader."', avatar: '👩' },
  { name: 'Aman Verma',     role: 'Intern, Mumbai',     text: '"The internship experience here was better than any course I\'ve taken."',      avatar: '👨' },
  { name: 'Sneha Joshi',    role: 'Student, Pune',      text: '"The digital skills program changed my career path completely."',               avatar: '👩‍💼' },
];

const Home = () => {
  useReveal();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="page-enter">
      <style>{`
        .hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.25;
          pointer-events: none;
          animation: floatSlow 8s ease-in-out infinite;
        }
        .program-card-home {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.8rem;
          cursor: default;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s;
          position: relative;
          overflow: hidden;
        }
        .program-card-home::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(181,68,110,0.05), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .program-card-home:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(181,68,110,0.14);
          border-color: var(--primary-light);
        }
        .program-card-home:hover::before { opacity: 1; }
        .stat-card-home {
          text-align: center;
          color: #fff;
          padding: 1.5rem 1rem;
          border-radius: var(--radius);
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.15);
          transition: transform 0.25s, background 0.25s;
        }
        .stat-card-home:hover { transform: translateY(-4px); background: rgba(255,255,255,0.18); }
        .testimonial-card {
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .cta-btn-primary {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.85rem 2rem;
          background: var(--primary);
          color: #fff; border-radius: 50px;
          font-weight: 600; font-size: 0.95rem;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .cta-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(181,68,110,0.35);
          background: var(--primary-dark);
        }
        .cta-btn-outline {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.85rem 2rem;
          border: 2px solid var(--primary);
          color: var(--primary); border-radius: 50px;
          font-weight: 600; font-size: 0.95rem;
          transition: transform 0.2s, background 0.2s, color 0.2s;
        }
        .cta-btn-outline:hover {
          background: var(--primary);
          color: #fff;
          transform: translateY(-3px);
        }
        .floating-petals span {
          position: fixed; top: -30px; font-size: 1.2rem;
          pointer-events: none; z-index: 0; opacity: 0;
          animation: petal-drift linear infinite;
        }
        @keyframes hero-glow {
          0%, 100% { box-shadow: 0 0 40px rgba(181,68,110,0.2); }
          50%       { box-shadow: 0 0 80px rgba(181,68,110,0.4); }
        }
        .hero-illus {
          animation: float 4s ease-in-out infinite, hero-glow 4s ease-in-out infinite;
        }
      `}</style>

      {/* Floating petals */}
      <div className="floating-petals" aria-hidden="true">
        {['🌸','🌺','🌷','✿','🌼'].map((p, i) => (
          <span key={i} style={{
            left: `${8 + i * 18}%`,
            animationDuration: `${7 + i * 1.5}s`,
            animationDelay: `${i * 1.4}s`,
          }}>{p}</span>
        ))}
      </div>

      {/* ── Hero ── */}
      <section style={styles.heroSection}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div className="hero-blob" style={{ width: 500, height: 500, background: 'var(--primary-light)', top: -100, right: -100 }} />
          <div className="hero-blob" style={{ width: 300, height: 300, background: '#fde8b4', bottom: 0, left: -80, animationDelay: '2s' }} />
        </div>

        <div style={styles.heroInner}>
          <div className="anim-fade-left" style={styles.heroContent}>
            <span className="badge-pill delay-1 anim-fade-in" style={{ marginBottom: '1.4rem' }}>
              🌸 Youth-Driven NGO
            </span>
            <h1 className="anim-fade-up delay-2" style={styles.heroTitle}>
              Empowering Youth,<br />
              <span className="gradient-text">Changing Lives</span>
            </h1>
            <p className="anim-fade-up delay-3" style={styles.heroSub}>
              She Can Foundation creates opportunities, awareness, and positive social impact through
              education, digital initiatives, and community-driven programs.
            </p>
            <div className="anim-fade-up delay-4" style={styles.heroBtns}>
              <Link to="/volunteer" className="cta-btn-primary">Join as Volunteer →</Link>
              <Link to="/about"     className="cta-btn-outline">Learn More</Link>
            </div>
          </div>

          <div className="anim-fade-right delay-2" style={styles.heroVisual}>
            <div className="hero-illus" style={styles.heroIllus}>
              <span style={{ fontSize: '7rem', display: 'block', marginBottom: '1rem' }}>🌸</span>
              <p style={styles.heroQuote}>
                <em>"She believed she could,<br />so she did."</em>
              </p>
              <div style={styles.heroTags}>
                {['Education', 'Digital Skills', 'Community'].map(t => (
                  <span key={t} style={styles.heroTag}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={styles.statsSection} className="reveal">
        <div style={styles.statsGrid}>
          {stats.map((s, i) => (
            <div key={s.label} className={`stat-card-home`} style={{ animationDelay: `${i * 0.1}s` }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>{s.icon}</span>
              <span style={styles.statNumber}>
                <Counter target={s.number} suffix={s.suffix} />
              </span>
              <span style={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Programs ── */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div className="reveal" style={styles.sectionHeader}>
            <span className="badge-pill">What We Do</span>
            <h2 style={{ ...styles.sectionTitle, marginTop: '0.75rem' }}>Our Programs</h2>
            <div style={styles.titleUnderline} />
            <p style={styles.sectionSub}>
              Comprehensive programs designed to uplift, educate, and empower the next generation.
            </p>
          </div>
          <div style={styles.programGrid}>
            {programs.map((p, i) => (
              <div
                key={p.title}
                className="program-card-home reveal"
                style={{ animationDelay: `${i * 0.12}s`, transitionDelay: `${i * 0.08}s` }}
              >
                <div style={{ ...styles.programIconWrap, background: p.color }}>
                  <span style={{ fontSize: '2rem' }}>{p.icon}</span>
                </div>
                <h3 style={styles.programTitle}>{p.title}</h3>
                <p style={styles.programDesc}>{p.desc}</p>
                <span style={styles.programArrow}>→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={styles.testimonialSection}>
        <div style={styles.container}>
          <div className="reveal" style={styles.sectionHeader}>
            <span className="badge-pill">Stories</span>
            <h2 style={{ ...styles.sectionTitle, marginTop: '0.75rem' }}>Voices of Change</h2>
            <div style={styles.titleUnderline} />
          </div>

          <div style={styles.testimonialWrap}>
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="testimonial-card"
                style={{
                  ...styles.testimonialCard,
                  opacity: i === activeTestimonial ? 1 : 0.35,
                  transform: i === activeTestimonial ? 'scale(1.03)' : 'scale(0.97)',
                  border: i === activeTestimonial ? '2px solid var(--primary)' : '1px solid var(--border)',
                }}
                onClick={() => setActiveTestimonial(i)}
              >
                <span style={{ fontSize: '2.5rem' }}>{t.avatar}</span>
                <p style={styles.testimonialText}>{t.text}</p>
                <p style={styles.testimonialName}>{t.name}</p>
                <p style={styles.testimonialRole}>{t.role}</p>
              </div>
            ))}
          </div>

          <div style={styles.dotNav}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                style={{
                  ...styles.dot,
                  background: i === activeTestimonial ? 'var(--primary)' : 'var(--border)',
                  transform: i === activeTestimonial ? 'scale(1.4)' : 'scale(1)',
                }}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="reveal" style={styles.ctaSection}>
        <div style={styles.container}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🚀</span>
          <h2 style={{ ...styles.sectionTitle, color: '#fff', marginBottom: '1rem' }}>
            Ready to Make a Difference?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
            Join hundreds of volunteers helping us create a brighter future.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/volunteer" style={styles.ctaBtnWhite}>Become a Volunteer</Link>
            <Link to="/contact"   style={styles.ctaBtnBorder}>Get In Touch</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  heroSection: {
    position: 'relative',
    overflow: 'hidden',
    padding: '1rem 0 2rem',
  },
  heroInner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '4rem 1.5rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  heroContent: {},
  heroTitle: {
    fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
    lineHeight: 1.2,
    marginBottom: '1.2rem',
    letterSpacing: '-0.01em',
  },
  heroSub: {
    fontSize: '1.05rem',
    color: 'var(--text-muted)',
    lineHeight: 1.75,
    marginBottom: '2rem',
    maxWidth: '490px',
  },
  heroBtns: { display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' },
  heroVisual: { display: 'flex', justifyContent: 'center' },
  heroIllus: {
    background: 'linear-gradient(135deg, var(--primary-light), #fde8f8)',
    borderRadius: '28px',
    padding: '3rem 2.5rem',
    textAlign: 'center',
    width: '100%',
    border: '1px solid rgba(181,68,110,0.15)',
  },
  heroQuote: {
    color: 'var(--primary)',
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.1rem',
    lineHeight: 1.6,
    marginBottom: '1.5rem',
  },
  heroTags: { display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' },
  heroTag: {
    background: 'rgba(181,68,110,0.12)',
    color: 'var(--primary)',
    padding: '0.3rem 0.8rem',
    borderRadius: '50px',
    fontSize: '0.78rem',
    fontWeight: '600',
  },
  statsSection: {
    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
    padding: '3rem 1.5rem',
  },
  statsGrid: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '1rem',
  },
  statNumber: {
    display: 'block',
    fontSize: '2.4rem',
    fontWeight: '700',
    fontFamily: "'Playfair Display', serif",
    color: '#fff',
  },
  statLabel: { fontSize: '0.85rem', opacity: 0.85, letterSpacing: '0.05em', color: '#fff' },
  section: { padding: '5rem 0' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' },
  sectionHeader: { textAlign: 'center', marginBottom: '3rem' },
  sectionTitle: { fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', marginBottom: '0.5rem' },
  titleUnderline: {
    width: 60, height: 3,
    background: 'linear-gradient(90deg, var(--primary), var(--accent))',
    borderRadius: 3,
    margin: '0.75rem auto 1rem',
    animation: 'draw-line 0.8s ease both',
  },
  sectionSub: { color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' },
  programGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '1.5rem',
  },
  programIconWrap: {
    width: 58, height: 58,
    borderRadius: '16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '1.1rem',
  },
  programTitle: { fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.5rem', fontFamily: "'DM Sans', sans-serif" },
  programDesc: { color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 },
  programArrow: {
    display: 'inline-block',
    marginTop: '0.9rem',
    color: 'var(--primary)',
    fontSize: '1.1rem',
    fontWeight: '700',
    transition: 'transform 0.2s',
  },

  testimonialSection: { padding: '5rem 0', background: '#fdf5f8' },
  testimonialWrap: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '2rem',
  },
  testimonialCard: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: '2rem',
    maxWidth: '280px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'opacity 0.5s, transform 0.5s, border 0.3s',
  },
  testimonialText: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    lineHeight: 1.7,
    margin: '1rem 0 0.75rem',
    fontStyle: 'italic',
  },
  testimonialName: { fontWeight: '700', fontSize: '0.92rem' },
  testimonialRole: { fontSize: '0.8rem', color: 'var(--primary)' },
  dotNav: { display: 'flex', gap: '0.5rem', justifyContent: 'center' },
  dot: {
    width: 10, height: 10,
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.3s, transform 0.3s',
  },

  ctaSection: {
    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark), #6a1f3a)',
    backgroundSize: '300% 300%',
    animation: 'gradient-shift 8s ease infinite',
    padding: '5rem 1.5rem',
    textAlign: 'center',
  },
  ctaBtnWhite: {
    padding: '0.85rem 2rem',
    background: '#fff',
    color: 'var(--primary)',
    borderRadius: '50px',
    fontWeight: '700',
    fontSize: '0.95rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'inline-block',
  },
  ctaBtnBorder: {
    padding: '0.85rem 2rem',
    border: '2px solid rgba(255,255,255,0.7)',
    color: '#fff',
    borderRadius: '50px',
    fontWeight: '600',
    fontSize: '0.95rem',
    display: 'inline-block',
    transition: 'background 0.2s, transform 0.2s',
  },
};

export default Home;