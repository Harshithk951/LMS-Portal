import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, Star, FileText, Ear } from 'lucide-react';
import Icon from '../components/Icon';
import { courses } from '../data/courses';
import './Courses.css';

const categories = ['All', 'Web Development', 'AI/ML', 'Data Science', 'Design', 'Mobile Dev', 'Security', 'Cloud'];
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }) };

export default function Courses() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    const filtered = courses.filter(c => {
        const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
        const matchCat = category === 'All' || c.category === category;
        return matchSearch && matchCat;
    });

    return (
        <main className="courses-page container" role="main" aria-labelledby="courses-heading">
            <motion.div className="courses-header" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 id="courses-heading">Explore <span className="text-gradient">Courses</span></h1>
                <p>All courses are WCAG 2.2 compliant with AI-generated accessibility features</p>
            </motion.div>

            <motion.div className="courses-filters" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="input-wrapper search-wrapper">
                    <Search size={18} className="input-icon" />
                    <input type="search" className="input input-with-icon" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Search courses" />
                </div>
                <div className="category-pills" role="tablist" aria-label="Filter by category">
                    {categories.map(cat => (
                        <button key={cat} className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCategory(cat)} role="tab" aria-selected={category === cat}>
                            {cat === 'All' && <Filter size={14} />} {cat}
                        </button>
                    ))}
                </div>
            </motion.div>

            <div className="courses-grid" role="list">
                {filtered.map((course, i) => (
                    <motion.div key={course.id} role="listitem" initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                        <Link to={`/course/${course.id}`} className="card course-card" aria-label={`${course.title} by ${course.instructor}, ${course.difficulty}, ${course.rating} stars`}>
                            <div className="course-thumb-area">
                                <span className="course-thumb"><Icon name={course.thumbnail} size={36} /></span>
                                <span className={`badge ${course.difficulty === 'Beginner' ? 'badge-success' : course.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-error'}`}>{course.difficulty}</span>
                            </div>
                            <h3 className="course-title">{course.title}</h3>
                            <p className="course-instructor">{course.instructor}</p>
                            <p className="course-desc">{course.description.slice(0, 80)}...</p>
                            <div className="course-meta">
                                <span><BookOpen size={14} /> {course.lessons} lessons</span>
                                <span><Star size={14} /> {course.rating}</span>
                                <span>{course.duration}</span>
                            </div>
                            <div className="course-a11y-badges">
                                {course.hasCaptions && <span className="badge badge-accent" title="Closed Captions">CC</span>}
                                {course.hasTranscripts && <span className="badge badge-accent" title="Transcripts"><FileText size={12} /> TXT</span>}
                                {course.hasSignLanguage && <span className="badge badge-success" title="Sign Language"><Ear size={12} /> SL</span>}
                                {course.hasAudioDescription && <span className="badge badge-warning" title="Audio Description">AD</span>}
                                <span className="badge badge-accent">WCAG {course.wcagLevel}</span>
                            </div>
                            {course.progress !== undefined && course.progress > 0 && (
                                <div className="course-progress">
                                    <div className="xp-bar-container" style={{ height: 6 }}>
                                        <div className="xp-bar-fill" style={{ width: `${course.progress}%` }} />
                                    </div>
                                    <span>{course.progress}%</span>
                                </div>
                            )}
                        </Link>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="courses-empty">
                    <p>No courses found matching your search. Try a different keyword or category.</p>
                </div>
            )}
        </main>
    );
}
