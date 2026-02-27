import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Accessibility, Ear, Hand, Brain } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import FaceUnlock from '../components/FaceUnlock/FaceUnlock';
import '../components/FaceUnlock/FaceUnlock.css';
import './Login.css';

const demoAccounts = [
    { email: 'demo-blind@test.com', pass: 'Demo2026!', label: 'Visual Impairment', icon: <Eye size={20} /> },
    { email: 'demo-deaf@test.com', pass: 'Demo2026!', label: 'Hearing Impairment', icon: <Ear size={20} /> },
    { email: 'demo-motor@test.com', pass: 'Demo2026!', label: 'Mobility Impairment', icon: <Hand size={20} /> },
    { email: 'demo-cognitive@test.com', pass: 'Demo2026!', label: 'Cognitive Accessibility', icon: <Brain size={20} /> },
];

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showFaceUnlock, setShowFaceUnlock] = useState(false);
    const { login } = useUser();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(email || 'demo-blind@test.com');
        navigate('/dashboard');
    };

    const quickLogin = (demoEmail: string) => {
        login(demoEmail);
        navigate('/dashboard');
    };

    const handleFaceUnlocked = () => {
        // This app uses demo auth; we log in the provided email (or default demo) after a face is detected.
        setShowFaceUnlock(false);
        login(email || 'demo-blind@test.com');
        navigate('/dashboard');
    };

    return (
        <main className="login-page">
            <div className="login-bg">
                <div className="hero-orb hero-orb-1" />
                <div className="hero-orb hero-orb-2" />
            </div>
            <motion.div className="login-card card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <div className="login-header">
                    <Accessibility size={40} className="text-gradient" />
                    <h1>Welcome to <span className="text-gradient">InclusiveLMS</span></h1>
                    <p>Sign in to continue your accessible learning journey</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form" aria-label="Sign in form">
                    <div className="form-group">
                        <label htmlFor="email" className="label">Email</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input id="email" type="email" className="input input-with-icon" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} aria-describedby="email-desc" />
                        </div>
                        <span id="email-desc" className="sr-only">Enter your email address or use a demo account below</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="label">Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input id="password" type={showPass ? 'text' : 'password'} className="input input-with-icon" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                            <button type="button" className="pass-toggle btn btn-icon" onClick={() => setShowPass(!showPass)} aria-label={showPass ? 'Hide password' : 'Show password'}>
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full">
                        Sign In <ArrowRight size={18} />
                    </button>

                    <button
                        type="button"
                        className={`btn w-full ${showFaceUnlock ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setShowFaceUnlock(v => !v)}
                        aria-pressed={showFaceUnlock}
                        aria-label="Toggle face unlock"
                        style={{ marginTop: 10 }}
                    >
                        Face Unlock
                    </button>

                    {showFaceUnlock && (
                        <FaceUnlock enabled={showFaceUnlock} onUnlocked={handleFaceUnlocked} />
                    )}
                </form>

                <div className="divider"><span>or try a demo account</span></div>

                <div className="demo-accounts">
                    {demoAccounts.map(acc => (
                        <button key={acc.email} className="demo-btn btn btn-secondary" onClick={() => quickLogin(acc.email)} aria-label={`Quick login as ${acc.label} demo account`}>
                            <span className="demo-icon">{acc.icon}</span>
                            <span>{acc.label}</span>
                        </button>
                    ))}
                </div>
            </motion.div>
        </main>
    );
}
