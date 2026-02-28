import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Captions, Hand, FileText, ChevronLeft, CheckCircle, Circle, Keyboard, Zap, FlaskConical, ListOrdered } from 'lucide-react';
import { courses, sampleLessons, sampleCaptions, quizQuestions } from '../data/courses';
import { useUser } from '../contexts/UserContext';
import { useVoice } from '../contexts/VoiceContext';
import SignInterpreter from '../components/SignInterpreter/SignInterpreter';
import '../components/SignInterpreter/SignInterpreter.css';
import './CoursePlayer.css';

export default function CoursePlayer() {
    const { id } = useParams<{ id: string }>();
    const course = courses.find(c => c.id === id) || courses[0];
    const lessons = sampleLessons;
    const { addXP, completeLesson } = useUser();
    const { autoPlayCourseId, clearAutoPlay } = useVoice();

    const [currentLesson, setCurrentLesson] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showCaptions, setShowCaptions] = useState(true);
    const [showTranscript, setShowTranscript] = useState(true);
    const [showSignLanguage, setShowSignLanguage] = useState(false);
    const [recognizedSign, setRecognizedSign] = useState('');
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [captionIndex, setCaptionIndex] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [xpGained, setXpGained] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
    const lastSpokenIndex = useRef(-1);

    // Text-to-Speech narrator: speak each caption when it becomes active
    const speakCaption = useCallback((text: string) => {
        if (isMuted || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = playbackSpeed;
        utter.pitch = 1.05;
        utter.volume = 1;          // max volume
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.lang.startsWith('en') && v.name.includes('Samantha'))
            || voices.find(v => v.lang.startsWith('en') && v.localService)
            || voices.find(v => v.lang.startsWith('en'));
        if (preferred) utter.voice = preferred;
        speechRef.current = utter;
        window.speechSynthesis.speak(utter);
    }, [isMuted, playbackSpeed]);

    // When caption index advances while playing, speak the new caption
    useEffect(() => {
        if (isPlaying && captionIndex !== lastSpokenIndex.current) {
            lastSpokenIndex.current = captionIndex;
            speakCaption(sampleCaptions[captionIndex]?.text || '');
        }
    }, [captionIndex, isPlaying, speakCaption]);

    // Stop speech on pause or unmount
    useEffect(() => {
        if (!isPlaying) {
            window.speechSynthesis?.cancel();
        }
        return () => { window.speechSynthesis?.cancel(); };
    }, [isPlaying]);

    // Preload voices (some browsers load them async)
    useEffect(() => {
        window.speechSynthesis?.getVoices();
        const h = () => window.speechSynthesis?.getVoices();
        window.speechSynthesis?.addEventListener?.('voiceschanged', h);
        return () => window.speechSynthesis?.removeEventListener?.('voiceschanged', h);
    }, []);

    // Auto-play when voice command navigates here
    useEffect(() => {
        if (autoPlayCourseId && autoPlayCourseId === id) {
            setIsPlaying(true);
            clearAutoPlay();
        }
    }, [autoPlayCourseId, id, clearAutoPlay]);

    // Listen for voice player controls dispatched by VoiceContext
    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            const speedSteps = [0.5, 0.75, 1, 1.25, 1.5, 2];
            switch (detail) {
                case 'play': setIsPlaying(true); break;
                case 'pause': setIsPlaying(false); break;
                case 'mute-toggle': setIsMuted(m => { if (!m) window.speechSynthesis?.cancel(); return !m; }); break;
                case 'next': setCurrentLesson(l => { const next = Math.min(l + 1, lessons.length - 1); setCaptionIndex(0); setXpGained(false); return next; }); break;
                case 'prev': setCurrentLesson(l => { const prev = Math.max(l - 1, 0); setCaptionIndex(0); setXpGained(false); return prev; }); break;
                case 'slow-down': setPlaybackSpeed(s => { const idx = speedSteps.indexOf(s); return speedSteps[Math.max(0, idx - 1)]; }); break;
                case 'speed-up': setPlaybackSpeed(s => { const idx = speedSteps.indexOf(s); return speedSteps[Math.min(speedSteps.length - 1, idx + 1)]; }); break;
            }
        };
        document.addEventListener('voice-player-control', handler);
        return () => document.removeEventListener('voice-player-control', handler);
    }, [lessons.length]);

    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => {
            setCaptionIndex(prev => (prev + 1) % sampleCaptions.length);
        }, 3500 / playbackSpeed);
        return () => clearInterval(interval);
    }, [isPlaying, playbackSpeed]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
            switch (e.key) {
                case ' ': e.preventDefault(); setIsPlaying(p => !p); break;
                case 'c': case 'C': setShowCaptions(p => !p); break;
                case 't': case 'T': setShowTranscript(p => !p); break;
                case 's': case 'S': setShowSignLanguage(p => !p); break;
                case 'm': case 'M': setIsMuted(m => { if (!m) window.speechSynthesis?.cancel(); return !m; }); break;
                case 'ArrowRight': setCaptionIndex(p => Math.min(p + 1, sampleCaptions.length - 1)); break;
                case 'ArrowLeft': setCaptionIndex(p => Math.max(p - 1, 0)); break;
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    const handleCompleteLesson = () => {
        if (!xpGained) { addXP(50); completeLesson(); setXpGained(true); }
    };

    const handleSubmitQuiz = () => {
        setQuizSubmitted(true);
        const correct = quizQuestions.filter(q => quizAnswers[q.id] === q.correctAnswer).length;
        if (correct >= 3) addXP(100);
    };

    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

    return (
        <main className="player-page" role="main" aria-labelledby="player-heading">
            <div className="player-topbar container">
                <Link to="/courses" className="btn btn-ghost btn-sm"><ChevronLeft size={18} /> Back to Courses</Link>
                <h1 id="player-heading" className="player-course-title">{course.thumbnail} {course.title}</h1>
            </div>

            <div className="player-layout container">
                <div className="player-main">
                    <div className="player-video-area" role="region" aria-label="Video player">
                        <div className="player-video-placeholder">
                            <span className="player-video-emoji">{course.thumbnail}</span>
                            <span className="player-video-lesson">{lessons[currentLesson]?.title}</span>
                            {isPlaying && <div className="player-playing-indicator"><span /><span /><span /><span /></div>}
                            {playbackSpeed !== 1 && <span className="speed-badge">{playbackSpeed}x</span>}
                        </div>

                        {showSignLanguage && (
                            <motion.div className="sign-language-overlay" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} aria-label="Sign language interpreter">
                                <div className="sign-avatar"><Hand size={32} /></div>
                                <span className="sign-label">Sign Language</span>
                            </motion.div>
                        )}

                        <AnimatePresence>
                            {showCaptions && isPlaying && (
                                <motion.div className="caption-overlay" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} role="status" aria-live="polite" aria-label="Captions">
                                    {sampleCaptions[captionIndex]?.text}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="player-controls" role="toolbar" aria-label="Video controls">
                            <div className="player-controls-left">
                                <button className="btn btn-icon" onClick={() => setCaptionIndex(p => Math.max(0, p - 1))} aria-label="Previous"><SkipBack size={18} /></button>
                                <button className="btn btn-icon" onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? 'Pause' : 'Play'}>
                                    {isPlaying ? <Pause size={22} /> : <Play size={22} />}
                                </button>
                                <button className="btn btn-icon" onClick={() => setCaptionIndex(p => Math.min(p + 1, sampleCaptions.length - 1))} aria-label="Next"><SkipForward size={18} /></button>
                                <button className={`btn btn-icon ${isMuted ? 'muted' : ''}`} onClick={() => { setIsMuted(m => !m); if (!isMuted) window.speechSynthesis?.cancel(); }} aria-label={isMuted ? 'Unmute narration' : 'Mute narration'} aria-pressed={isMuted}>
                                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                </button>
                            </div>
                            <div className="player-controls-right">
                                <button className={`btn btn-sm ${showCaptions ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowCaptions(!showCaptions)} aria-label="Toggle captions" aria-pressed={showCaptions}>
                                    <Captions size={16} /> CC
                                </button>
                                <button className={`btn btn-sm ${showSignLanguage ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowSignLanguage(!showSignLanguage)} aria-label="Toggle sign language" aria-pressed={showSignLanguage}>
                                    <Hand size={16} /> Sign
                                </button>
                                <button className={`btn btn-sm ${showTranscript ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowTranscript(!showTranscript)} aria-label="Toggle transcript" aria-pressed={showTranscript}>
                                    <FileText size={16} />
                                </button>
                                <select className="input speed-select" value={playbackSpeed} onChange={e => setPlaybackSpeed(Number(e.target.value))} aria-label="Playback speed">
                                    {speeds.map(s => <option key={s} value={s}>{s}x</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="player-shortcuts card">
                        <Keyboard size={16} /> <strong>Shortcuts:</strong> Space=Play/Pause · ←→=Seek · C=Captions · T=Transcript · S=Sign Language · M=Mute
                    </div>

                    {showSignLanguage && (
                        <div style={{ marginTop: 12 }}>
                            <SignInterpreter
                                enabled={showSignLanguage}
                                onRecognized={(text) => setRecognizedSign(text)}
                            />
                            {recognizedSign && (
                                <div className="card" style={{ marginTop: 12 }} aria-live="polite">
                                    Recognized: <strong>{recognizedSign}</strong>
                                </div>
                            )}
                        </div>
                    )}

                    {showTranscript && (
                        <motion.section className="card transcript-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-label="Transcript">
                            <h3><FileText size={16} /> Transcript</h3>
                            <div className="transcript-content">
                                {sampleCaptions.map((cap, i) => (
                                    <p key={i} className={`transcript-line ${i === captionIndex ? 'active' : ''}`} onClick={() => setCaptionIndex(i)} role="button" tabIndex={0}>
                                        <span className="transcript-time">{cap.time}</span> {cap.text}
                                    </p>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    <div className="player-actions">
                        <button className="btn btn-primary" onClick={handleCompleteLesson} disabled={xpGained}>
                            {xpGained ? <><CheckCircle size={18} /> Completed (+50 XP)</> : <><Zap size={18} /> Mark Complete (+50 XP)</>}
                        </button>
                        <button className="btn btn-secondary" onClick={() => setShowQuiz(!showQuiz)}>
                            {showQuiz ? 'Hide Quiz' : <><FlaskConical size={14} /> Take Quiz</>}
                        </button>
                    </div>

                    <AnimatePresence>
                        {showQuiz && (
                            <motion.section className="card quiz-section" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} aria-label="Quiz">
                                <h3><FlaskConical size={16} /> Lesson Quiz</h3>
                                {quizQuestions.map((q, qi) => (
                                    <div key={q.id} className="quiz-question">
                                        <p className="quiz-q-text">{qi + 1}. {q.question}</p>
                                        <div className="quiz-options" role="radiogroup" aria-label={`Question ${qi + 1}`}>
                                            {q.options.map((opt, oi) => (
                                                <button key={oi} className={`quiz-option ${quizAnswers[q.id] === oi ? 'selected' : ''} ${quizSubmitted ? (oi === q.correctAnswer ? 'correct' : quizAnswers[q.id] === oi ? 'wrong' : '') : ''}`} onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [q.id]: oi }))} role="radio" aria-checked={quizAnswers[q.id] === oi} disabled={quizSubmitted}>
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {!quizSubmitted ? (
                                    <button className="btn btn-primary" onClick={handleSubmitQuiz} disabled={Object.keys(quizAnswers).length < quizQuestions.length}>Submit Quiz</button>
                                ) : (
                                    <div className="quiz-result">
                                        <p>Score: {quizQuestions.filter(q => quizAnswers[q.id] === q.correctAnswer).length}/{quizQuestions.length}</p>
                                        {quizQuestions.filter(q => quizAnswers[q.id] === q.correctAnswer).length >= 3 && <p className="quiz-bonus">+100 XP Bonus!</p>}
                                    </div>
                                )}
                            </motion.section>
                        )}
                    </AnimatePresence>
                </div>

                <aside className="player-sidebar" aria-label="Lesson list">
                    <h3><ListOrdered size={16} /> Lessons ({lessons.length})</h3>
                    <div className="lesson-list">
                        {lessons.map((lesson, i) => (
                            <button key={lesson.id} className={`lesson-item ${currentLesson === i ? 'active' : ''}`} onClick={() => { setCurrentLesson(i); setXpGained(false); setCaptionIndex(0); setIsPlaying(false); }} aria-current={currentLesson === i ? 'true' : undefined}>
                                <span className="lesson-status">{lesson.completed ? <CheckCircle size={16} /> : <Circle size={16} />}</span>
                                <div className="lesson-info">
                                    <span className="lesson-title">{lesson.title}</span>
                                    <span className="lesson-dur">{lesson.duration}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>
            </div>
        </main>
    );
}
