import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileVideo, FileText, Sparkles, Captions, HelpCircle, BookOpen, Loader, CheckCircle2 } from 'lucide-react';
import { sampleCaptions, quizQuestions } from '../data/courses';
import './AIGenerator.css';

const steps = [
    { label: 'Uploading file', icon: <Upload size={18} /> },
    { label: 'Transcribing with Whisper AI', icon: <Sparkles size={18} /> },
    { label: 'Generating captions (VTT)', icon: <Captions size={18} /> },
    { label: 'Creating quiz with Gemini', icon: <HelpCircle size={18} /> },
    { label: 'Generating summary', icon: <BookOpen size={18} /> },
];

export default function AIGenerator() {
    const [file, setFile] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [currentStep, setCurrentStep] = useState(-1);
    const [done, setDone] = useState(false);
    const [activeTab, setActiveTab] = useState<'captions' | 'transcript' | 'quiz' | 'summary'>('captions');

    const handleUpload = () => {
        if (file) {
            setProcessing(true);
            setCurrentStep(0);
        }
    };

    useEffect(() => {
        if (!processing || currentStep < 0) return;
        if (currentStep >= steps.length) {
            setProcessing(false);
            setDone(true);
            return;
        }
        const timer = setTimeout(() => setCurrentStep(p => p + 1), 1500);
        return () => clearTimeout(timer);
    }, [processing, currentStep]);

    const tabs = [
        { id: 'captions' as const, label: 'Captions', icon: <Captions size={16} /> },
        { id: 'transcript' as const, label: 'Transcript', icon: <FileText size={16} /> },
        { id: 'quiz' as const, label: 'Quiz', icon: <HelpCircle size={16} /> },
        { id: 'summary' as const, label: 'Summary', icon: <BookOpen size={16} /> },
    ];

    return (
        <main className="ai-page container" role="main" aria-labelledby="ai-heading">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 id="ai-heading"><Sparkles size={28} /> AI Content <span className="text-gradient">Generator</span></h1>
                <p className="ai-subtitle">Upload a video or PDF — our AI pipeline auto-generates accessible content using OpenAI Whisper + Google Gemini</p>
            </motion.div>

            {!done && !processing && (
                <motion.div className="card upload-zone" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} onClick={() => setFile('sample_lecture.mp4')} role="button" tabIndex={0} aria-label="Upload file zone">
                    <Upload size={48} className="upload-icon" />
                    <h3>Drag & drop your file here</h3>
                    <p>or click to browse — supports MP4, WebM, PDF, DOCX</p>
                    {file && (
                        <motion.div className="uploaded-file" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <FileVideo size={20} /> <span>{file}</span>
                        </motion.div>
                    )}
                </motion.div>
            )}

            {file && !processing && !done && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="upload-actions">
                    <button className="btn btn-primary btn-lg" onClick={handleUpload}>
                        <Sparkles size={20} /> Generate Accessible Content
                    </button>
                </motion.div>
            )}

            {processing && (
                <motion.div className="card processing-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3><Loader size={20} className="spinner" /> Processing with AI...</h3>
                    <div className="processing-steps">
                        {steps.map((step, i) => (
                            <div key={i} className={`processing-step ${i < currentStep ? 'done' : i === currentStep ? 'active' : ''}`}>
                                <span className="step-icon">{i < currentStep ? <CheckCircle2 size={18} /> : step.icon}</span>
                                <span>{step.label}</span>
                                {i === currentStep && <Loader size={14} className="spinner" />}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {done && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="ai-success"><CheckCircle2 size={24} /> Content generated successfully!</div>
                    <div className="ai-tabs" role="tablist">
                        {tabs.map(tab => (
                            <button key={tab.id} className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab(tab.id)} role="tab" aria-selected={activeTab === tab.id}>
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div className="card ai-output" key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                            {activeTab === 'captions' && (
                                <div className="output-captions">
                                    <h3>WebVTT Captions</h3>
                                    <pre className="code-block">WEBVTT{'\n\n'}{sampleCaptions.map((c, i) => `${i + 1}\n${c.time}.000 --> ${c.time}.999\n${c.text}\n`).join('\n')}</pre>
                                </div>
                            )}
                            {activeTab === 'transcript' && (
                                <div className="output-transcript">
                                    <h3>Full Transcript</h3>
                                    <p>{sampleCaptions.map(c => c.text).join(' ')}</p>
                                </div>
                            )}
                            {activeTab === 'quiz' && (
                                <div className="output-quiz">
                                    <h3>Generated Quiz Questions</h3>
                                    {quizQuestions.map((q, i) => (
                                        <div key={q.id} className="gen-quiz-item">
                                            <p><strong>Q{i + 1}:</strong> {q.question}</p>
                                            <ul>{q.options.map((o, j) => <li key={j} className={j === q.correctAnswer ? 'correct-answer' : ''}>{o}</li>)}</ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'summary' && (
                                <div className="output-summary">
                                    <h3>TL;DR Summary</h3>
                                    <p>This lesson introduces web accessibility (a11y) — the practice of making websites usable by everyone, including people with disabilities. Key topics include the WCAG 2.2 guidelines, the POUR principles (Perceivable, Operable, Understandable, Robust), and the global impact of accessibility affecting 1.3B+ people worldwide. The lesson emphasizes that accessibility is not optional but essential for inclusive web development.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            )}
        </main>
    );
}
