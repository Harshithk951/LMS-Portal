import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Mic, MicOff, Settings, LogOut, Trophy, BookOpen, Home, Sparkles, User, Accessibility, Sun, Moon } from 'lucide-react';
import Icon from '../Icon';
import { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useVoice } from '../../contexts/VoiceContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getLevelFromXP } from '../../data/badges';
import './Navbar.css';

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useUser();
    const { isListening, toggleListening, isSupported, feedback, micLevel } = useVoice();
    const { config, setTheme } = useTheme();
    const location = useLocation();
    const isDark = config.theme === 'dark' || config.theme.startsWith('high-contrast-dark');
    const level = getLevelFromXP(user.xp);

    const navLinks = [
        { to: '/', label: 'Home', icon: <Home size={18} /> },
        { to: '/dashboard', label: 'Dashboard', icon: <BookOpen size={18} /> },
        { to: '/courses', label: 'Courses', icon: <BookOpen size={18} /> },
        { to: '/ai-generator', label: 'AI Generator', icon: <Sparkles size={18} /> },
        { to: '/leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> },
    ];

    return (
        <header className="navbar" role="banner">
            <nav className="navbar-inner container" aria-label="Main navigation">
                <Link to="/" className="navbar-logo" aria-label="InclusiveLMS Home">
                    <span className="logo-icon"><Accessibility size={20} /></span>
                    <span className="logo-text">Inclusive<span className="text-gradient">LMS</span></span>
                </Link>

                <div className="navbar-links hide-mobile">
                    {navLinks.map(link => (
                        <Link key={link.to} to={link.to} className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}>
                            {link.icon} {link.label}
                        </Link>
                    ))}
                </div>

                <div className="navbar-actions">
                    {isSupported && (
                        <div className="voice-btn-wrapper">
                            <button
                                className={`btn btn-icon voice-btn ${isListening ? 'listening' : ''}`}
                                onClick={toggleListening}
                                aria-label={isListening ? 'Stop voice navigation' : 'Start voice navigation'}
                                title="Voice Navigation"
                            >
                                {isListening ? <Mic size={20} /> : <MicOff size={20} />}
                                {isListening && <span className="voice-pulse" />}
                            </button>
                            {isListening && (
                                <div className="mic-level-bar" aria-hidden="true">
                                    <div className="mic-level-fill" style={{ width: `${micLevel}%`, background: micLevel > 60 ? '#22c55e' : micLevel > 25 ? '#f59e0b' : '#ef4444' }} />
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        className="btn btn-icon theme-toggle-btn"
                        onClick={() => setTheme(isDark ? 'light' : 'dark')}
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        title={isDark ? 'Light mode' : 'Dark mode'}
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <Link to="/settings" className="btn btn-icon" aria-label="Accessibility Settings" title="Settings">
                        <Settings size={20} />
                    </Link>

                    {user.isLoggedIn ? (
                        <div className="user-menu">
                            <div className="user-avatar-badge">
                                <span className="user-avatar"><Icon name={user.avatar} size={20} /></span>
                                <span className="user-level">Lv.{level.level}</span>
                            </div>
                            <button className="btn btn-icon" onClick={logout} aria-label="Log out" title="Log out">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary btn-sm">
                            <User size={16} /> Sign In
                        </Link>
                    )}

                    <button className="btn btn-icon hide-desktop" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu" aria-expanded={mobileOpen}>
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div className="mobile-nav" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                        {navLinks.map(link => (
                            <Link key={link.to} to={link.to} className={`mobile-nav-link ${location.pathname === link.to ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                                {link.icon} {link.label}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {feedback && (
                    <motion.div className="voice-feedback" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} role="status" aria-live="polite">
                        <Mic size={16} /> {feedback}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
