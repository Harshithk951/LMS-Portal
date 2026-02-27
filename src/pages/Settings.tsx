import { motion } from 'framer-motion';
import { Type, AlignJustify, Zap, Monitor, Mic, Eye, Accessibility } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import './Settings.css';

export default function Settings() {
    const { config, setFontSize, setLineSpacing, setReduceMotion, setScreenReaderMode } = useTheme();

    return (
        <main className="settings-page container" role="main" aria-labelledby="settings-heading">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 id="settings-heading"><Accessibility size={24} /> Accessibility <span className="text-gradient">Settings</span></h1>
                <p className="settings-subtitle">Customize your learning experience. All changes apply instantly.</p>
            </motion.div>

            <section className="settings-section" aria-labelledby="typography-heading">
                <h2 id="typography-heading"><Type size={20} /> Typography</h2>
                <div className="settings-controls">
                    <div className="setting-item">
                        <label htmlFor="font-size"><Eye size={16} /> Font Size: {config.fontSize}px</label>
                        <input id="font-size" type="range" min="12" max="32" value={config.fontSize} onChange={e => setFontSize(Number(e.target.value))} className="range-input" aria-valuemin={12} aria-valuemax={32} aria-valuenow={config.fontSize} />
                        <div className="range-labels"><span>12px</span><span>32px</span></div>
                    </div>
                    <div className="setting-item">
                        <label htmlFor="line-spacing"><AlignJustify size={16} /> Line Spacing: {config.lineSpacing}</label>
                        <input id="line-spacing" type="range" min="1.2" max="2.5" step="0.1" value={config.lineSpacing} onChange={e => setLineSpacing(Number(e.target.value))} className="range-input" aria-valuemin={1.2} aria-valuemax={2.5} aria-valuenow={config.lineSpacing} />
                        <div className="range-labels"><span>Tight</span><span>Relaxed</span></div>
                    </div>
                </div>
            </section>

            <section className="settings-section" aria-labelledby="motion-heading">
                <h2 id="motion-heading"><Zap size={20} /> Motion & Interaction</h2>
                <div className="settings-toggles">
                    <label className="toggle-item">
                        <span><Zap size={16} /> Reduce Animations</span>
                        <input type="checkbox" checked={config.reduceMotion} onChange={e => setReduceMotion(e.target.checked)} aria-label="Reduce animations" />
                        <span className="toggle-switch" />
                    </label>
                    <label className="toggle-item">
                        <span><Monitor size={16} /> Screen Reader Mode</span>
                        <input type="checkbox" checked={config.screenReaderMode} onChange={e => setScreenReaderMode(e.target.checked)} aria-label="Screen reader mode" />
                        <span className="toggle-switch" />
                    </label>
                </div>
            </section>

            <section className="settings-section" aria-labelledby="voice-heading">
                <h2 id="voice-heading"><Mic size={20} /> Voice Commands</h2>
                <div className="card voice-commands-list">
                    <p className="voice-hint">Click the microphone button in the navbar or press the mic icon to start voice navigation.</p>
                    <table className="voice-table" aria-label="Available voice commands">
                        <thead><tr><th>Say</th><th>Action</th></tr></thead>
                        <tbody>
                            <tr><td>"Courses" / "Browse courses"</td><td>Navigate to Courses page</td></tr>
                            <tr><td>"Slow" / "Slowly"</td><td>Open Courses page</td></tr>
                            <tr><td>"Dashboard" / "My progress"</td><td>Navigate to Dashboard</td></tr>
                            <tr><td>"Home" / "Go home"</td><td>Navigate to Home page</td></tr>
                            <tr><td>"Settings" / "Accessibility"</td><td>Open Settings</td></tr>
                            <tr><td>"Leaderboard" / "Rankings"</td><td>Open Leaderboard</td></tr>
                            <tr><td>"AI Generator"</td><td>Open AI Content Generator</td></tr>
                            <tr><td>"Play web accessibility"</td><td>Open &amp; play that course</td></tr>
                            <tr><td>"Play" / "Pause" / "Next" / "Previous"</td><td>Player controls</td></tr>
                            <tr><td>"Slow down" / "Faster"</td><td>Change playback speed</td></tr>
                            <tr><td>"Mute" / "Unmute"</td><td>Toggle narration</td></tr>
                            <tr><td>"Help"</td><td>List available commands</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}
