import { motion } from 'framer-motion';
import { Trophy, Medal, Flame, Award, Star } from 'lucide-react';
import Icon from '../components/Icon';
import { leaderboardData } from '../data/badges';
import './Leaderboard.css';

const fadeUp = { hidden: { opacity: 0, y: 15 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }) };

export default function Leaderboard() {
    return (
        <main className="lb-page container" role="main" aria-labelledby="lb-heading">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 id="lb-heading"><Trophy size={28} /> <span className="text-gradient">Leaderboard</span></h1>
                <p className="lb-subtitle">Top learners this month — earn XP by completing lessons and quizzes!</p>
            </motion.div>

            <div className="lb-podium">
                {leaderboardData.slice(0, 3).map((entry, i) => (
                    <motion.div key={entry.rank} className={`card lb-podium-card rank-${i + 1}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.15, type: 'spring' }}>
                        <span className="lb-medal">{i === 0 ? <Trophy size={20} /> : i === 1 ? <Medal size={20} /> : <Award size={20} />}</span>
                        <span className="lb-avatar"><Icon name={entry.avatar} size={28} /></span>
                        <span className="lb-name">{entry.name}</span>
                        <span className="lb-xp">{entry.xp.toLocaleString()} XP</span>
                        <div className="lb-mini-stats">
                            <span><Flame size={12} /> {entry.streak}</span>
                            <span><Medal size={12} /> {entry.badges}</span>
                            <span>Lv.{entry.level}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="card lb-table-card">
                <table className="lb-table" aria-label="Full leaderboard">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Learner</th>
                            <th>XP</th>
                            <th className="hide-mobile">Level</th>
                            <th className="hide-mobile">Streak</th>
                            <th className="hide-mobile">Badges</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData.map((entry, i) => (
                            <motion.tr key={entry.rank} className={entry.isCurrentUser ? 'current-user' : ''} initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                                <td className="lb-rank">
                                    {entry.rank <= 3 ? <span>{entry.rank === 1 ? <Trophy size={16} /> : entry.rank === 2 ? <Medal size={16} /> : <Award size={16} />}</span> : <span>{entry.rank}</span>}
                                </td>
                                <td className="lb-user">
                                    <span className="lb-podium-avatar"><Icon name={entry.avatar} size={28} /></span>
                                    <span>{entry.name} {entry.isCurrentUser && <span className="badge badge-accent">You</span>}</span>
                                </td>
                                <td className="lb-xp-col"><Star size={14} /> {entry.xp.toLocaleString()}</td>
                                <td className="hide-mobile">{entry.level}</td>
                                <td className="hide-mobile"><Flame size={14} /> {entry.streak}</td>
                                <td className="hide-mobile"><Medal size={14} /> {entry.badges}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
