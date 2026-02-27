import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flame, Zap, Trophy, BookOpen, ArrowRight, Star, TrendingUp, Clock, Award, Sparkles, Ear } from 'lucide-react';
import Icon from '../components/Icon';
import { useUser } from '../contexts/UserContext';
import { courses } from '../data/courses';
import { getLevelFromXP } from '../data/badges';
import './Dashboard.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }) };

export default function Dashboard() {
    const { user } = useUser();
    const { level, currentXP, nextLevelXP } = getLevelFromXP(user.xp);
    const activeCourses = courses.filter(c => c.progress && c.progress > 0);
    const recommended = courses.filter(c => !c.progress || c.progress === 0).slice(0, 3);
    const unlockedBadges = user.badges.filter(b => b.unlocked);
    const weeklyData = [30, 45, 20, 60, 80, 40, 55];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const maxVal = Math.max(...weeklyData);

    return (
        <main className="dashboard container" role="main" aria-labelledby="dash-heading">
            <motion.div className="dash-welcome" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                <div>
                    <h1 id="dash-heading">Welcome back, <span className="text-gradient">{user.name}</span>!</h1>
                    <p>Keep up the great work! You're on a {user.streakDays}-day streak.</p>
                </div>
                <div className="dash-streak-badge">
                    <Flame size={24} /> <span>{user.streakDays} days</span>
                </div>
            </motion.div>

            <div className="dash-stats-row">
                {[
                    { icon: <Zap size={20} />, label: 'Total XP', value: user.xp.toLocaleString(), color: '#ffffff' },
                    { icon: <Star size={20} />, label: 'Level', value: level, color: '#d0d0d0' },
                    { icon: <BookOpen size={20} />, label: 'Lessons', value: user.lessonsCompleted, color: '#a0a0a0' },
                    { icon: <Trophy size={20} />, label: 'Badges', value: unlockedBadges.length, color: '#808080' },
                ].map((s, i) => (
                    <motion.div key={i} className="card dash-stat" initial="hidden" animate="visible" variants={fadeUp} custom={i + 1}>
                        <div className="dash-stat-icon" style={{ color: s.color, background: `${s.color}15` }}>{s.icon}</div>
                        <div className="dash-stat-info">
                            <span className="dash-stat-value">{s.value}</span>
                            <span className="dash-stat-label">{s.label}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div className="card dash-xp-card" initial="hidden" animate="visible" variants={fadeUp} custom={5}>
                <div className="dash-xp-header">
                    <span>Level {level}</span>
                    <span className="dash-xp-text">{currentXP} / {nextLevelXP} XP</span>
                    <span>Level {level + 1}</span>
                </div>
                <div className="xp-bar-container">
                    <div className="xp-bar-fill" style={{ width: `${(currentXP / nextLevelXP) * 100}%` }} role="progressbar" aria-valuenow={currentXP} aria-valuemin={0} aria-valuemax={nextLevelXP} aria-label={`XP progress: ${currentXP} of ${nextLevelXP}`} />
                </div>
            </motion.div>

            <div className="dash-grid">
                <motion.section className="card dash-courses-section" initial="hidden" animate="visible" variants={fadeUp} custom={6} aria-labelledby="active-courses">
                    <div className="dash-section-header">
                        <h2 id="active-courses"><BookOpen size={20} /> Active Courses</h2>
                        <Link to="/courses" className="btn btn-ghost btn-sm">View All <ArrowRight size={16} /></Link>
                    </div>
                    <div className="dash-course-list">
                        {activeCourses.map(course => (
                            <Link key={course.id} to={`/course/${course.id}`} className="dash-course-item" aria-label={`${course.title}, ${course.progress}% complete`}>
                                <span className="dash-course-thumb"><Icon name={course.thumbnail} size={24} /></span>
                                <div className="dash-course-info">
                                    <span className="dash-course-title">{course.title}</span>
                                    <div className="xp-bar-container" style={{ height: 6 }}>
                                        <div className="xp-bar-fill" style={{ width: `${course.progress}%` }} />
                                    </div>
                                    <span className="dash-course-progress">{course.progress}% complete</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.section>

                <motion.section className="card dash-chart-section" initial="hidden" animate="visible" variants={fadeUp} custom={7} aria-labelledby="weekly-activity">
                    <h2 id="weekly-activity"><TrendingUp size={20} /> Weekly Activity</h2>
                    <div className="dash-chart" role="img" aria-label="Weekly learning activity chart">
                        {weeklyData.map((val, i) => (
                            <div key={i} className="dash-chart-bar-wrapper">
                                <div className="dash-chart-bar" style={{ height: `${(val / maxVal) * 100}%` }}><span className="sr-only">{days[i]}: {val} minutes</span></div>
                                <span className="dash-chart-label">{days[i]}</span>
                            </div>
                        ))}
                    </div>
                    <p className="dash-chart-summary"><Clock size={14} /> Total: {weeklyData.reduce((a, b) => a + b, 0)} min this week</p>
                </motion.section>
            </div>

            <motion.section className="dash-badges-section" initial="hidden" animate="visible" variants={fadeUp} custom={8} aria-labelledby="recent-badges">
                <h2 id="recent-badges"><Award size={20} /> Recent Badges</h2>
                <div className="dash-badges-row">
                    {unlockedBadges.slice(0, 4).map((badge, i) => (
                        <motion.div key={badge.id} className="card dash-badge-card" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 200 }}>
                            <span className="dash-badge-icon"><Icon name={badge.icon} size={28} /></span>
                            <span className="dash-badge-name">{badge.name}</span>
                            <span className={`badge badge-${badge.tier === 'gold' ? 'warning' : badge.tier === 'silver' ? 'accent' : 'success'}`}>{badge.tier}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <motion.section initial="hidden" animate="visible" variants={fadeUp} custom={9} aria-labelledby="recommended">
                <div className="dash-section-header">
                    <h2 id="recommended"><Sparkles size={20} /> Recommended for You</h2>
                    <Link to="/courses" className="btn btn-ghost btn-sm">Browse All <ArrowRight size={16} /></Link>
                </div>
                <div className="dash-rec-grid">
                    {recommended.map(course => (
                        <Link key={course.id} to={`/course/${course.id}`} className="card dash-rec-card">
                            <span className="dash-rec-thumb"><Icon name={course.thumbnail} size={28} /></span>
                            <h3>{course.title}</h3>
                            <p>{course.instructor} · {course.duration}</p>
                            <div className="dash-rec-badges">
                                {course.hasCaptions && <span className="badge badge-accent" title="Captions available">CC</span>}
                                {course.hasSignLanguage && <span className="badge badge-success" title="Sign language"><Ear size={12} /> SL</span>}
                                {course.hasAudioDescription && <span className="badge badge-warning" title="Audio description">AD</span>}
                            </div>
                        </Link>
                    ))}
                </div>
            </motion.section>
        </main>
    );
}
