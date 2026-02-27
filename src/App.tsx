import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import { VoiceProvider } from './contexts/VoiceContext';
import Navbar from './components/Layout/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CoursePlayer from './pages/CoursePlayer';
import AIGenerator from './pages/AIGenerator';
import Settings from './pages/Settings';
import Leaderboard from './pages/Leaderboard';

function AppContent() {
  return (
    <>
      <a href="#main-content" className="sr-only" style={{ position: 'absolute', top: 0, left: 0, zIndex: 999, padding: '12px', background: 'var(--accent)', color: '#fff' }} onFocus={(e) => e.currentTarget.classList.remove('sr-only')} onBlur={(e) => e.currentTarget.classList.add('sr-only')}>
        Skip to main content
      </a>
      <VoiceProvider>
        <Navbar />
        <div id="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:id" element={<CoursePlayer />} />
            <Route path="/ai-generator" element={<AIGenerator />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </VoiceProvider>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
}
