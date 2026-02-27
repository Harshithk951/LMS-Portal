import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Mic, Gamepad2, Shield, ArrowRight, Users, GraduationCap, DollarSign, Globe } from 'lucide-react';
import './Landing.css';

const features = [
    { icon: <Sparkles size={32} />, title: 'AI-Powered Captions', desc: 'Auto-generate captions, transcripts & sign language from any video using Whisper + Gemini AI.', color: '#6C3BF4' },
    { icon: <Mic size={32} />, title: 'Voice Navigation', desc: 'Navigate the entire platform hands-free with natural voice commands.', color: '#22c55e' },
    { icon: <Gamepad2 size={32} />, title: 'Gamified Learning', desc: 'Stay motivated with XP, badges, streaks, and leaderboards — like Duolingo for education.', color: '#f59e0b' },
    { icon: <Shield size={32} />, title: 'WCAG 2.2 AAA', desc: '8 accessibility themes, keyboard navigation, screen reader optimized — accessible by default.', color: '#ec4899' },
];

const stats = [
    { icon: <Users size={28} />, value: '200M+', label: 'Disabled Learners Underserved' },
    { icon: <GraduationCap size={28} />, value: '95%', label: 'Exclusion Rate in Education' },
    { icon: <DollarSign size={28} />, value: '$0', label: 'Cost (vs $500K Retrofit)' },
    { icon: <Globe size={28} />, value: '1.3B', label: 'People with Disabilities' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }) };

export default function Landing() {
    return (
        <main className="landing" role="main">
            <section className="hero" aria-labelledby="hero-heading">
                <div className="hero-bg">
                    <div className="hero-orb hero-orb-1" />
                    <div className="hero-orb hero-orb-2" />
                    <div className="hero-orb hero-orb-3" />
                </div>
                <div className="container hero-content">
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <span className="hero-badge badge badge-accent">
                            <Sparkles size={14} /> InclusiveLMS
                        </span>
                    </motion.div>
                    <motion.h1 id="hero-heading" className="hero-title" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
                        Defying the Gravity of<br /><span className="text-gradient">Educational Exclusion</span>
                    </motion.h1>
                    <motion.p className="hero-subtitle" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                        Free, AI-powered learning platform designed for 200M+ disabled learners worldwide.
                        Auto-generated captions, voice navigation, and gamified learning — accessible by default.
                    </motion.p>
                    <motion.div className="hero-cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }}>
                        <Link to="/login" className="btn btn-primary btn-lg">
                            Start Learning Free <ArrowRight size={20} />
                        </Link>
                        <Link to="/courses" className="btn btn-secondary btn-lg">
                            Browse Courses
                        </Link>
                    </motion.div>
                </div>
            </section>

            <section className="features container" aria-labelledby="features-heading">
                <motion.h2 id="features-heading" className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
                    Innovation That <span className="text-gradient">Lifts Everyone Up</span>
                </motion.h2>
                <div className="features-grid">
                    {features.map((f, i) => (
                        <motion.div key={i} className="card feature-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}>
                            <div className="feature-icon" style={{ color: f.color, background: `${f.color}15` }}>{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="stats container" aria-labelledby="stats-heading">
                <motion.h2 id="stats-heading" className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
                    The <span className="text-gradient">Problem</span> We're Solving
                </motion.h2>
                <div className="stats-grid">
                    {stats.map((s, i) => (
                        <motion.div key={i} className="card stat-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}>
                            <div className="stat-icon">{s.icon}</div>
                            <div className="stat-value">{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="cta-section" aria-labelledby="cta-heading">
                <div className="container">
                    <motion.div className="cta-card card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
                        <h2 id="cta-heading">Ready to <span className="text-gradient">Defy Gravity</span>?</h2>
                        <p>Join us in making education truly accessible for every learner, everywhere.</p>
                        <Link to="/login" className="btn btn-primary btn-lg">
                            Get Started Now <ArrowRight size={20} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            <footer className="landing-footer" role="contentinfo">
                <div className="container">
                    <p>Built by Harshith Kumar M · MIT License</p>
                </div>
            </footer>
        </main>
    );
}
