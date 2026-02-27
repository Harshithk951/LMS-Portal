import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { courses } from "../data/courses";

/* ───────────────────────────────────────────── */
/* HARD NAVIGATION */
/* ───────────────────────────────────────────── */
function hardNavigate(
  navigateRef: React.MutableRefObject<((p: string) => void) | null>,
  path: string
) {
  if (navigateRef.current) navigateRef.current(path);
  else window.location.href = path;
}

interface VoiceCommand {
  command: string;
  timestamp: Date;
  recognized: boolean;
}

interface VoiceContextType {
  isListening: boolean;
  isSupported: boolean;
  lastCommand: string;
  commandHistory: VoiceCommand[];
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  feedback: string;
  autoPlayCourseId: string | null;
  clearAutoPlay: () => void;
  micLevel: number;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

/* ───────────────────────────────────────────── */
/* FUZZY MATCHING */
/* ───────────────────────────────────────────── */
function fuzzyScore(spoken: string, target: string): number {
  const sw = spoken
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/);
  const tw = target
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/);

  let matched = 0;
  for (const s of sw) {
    if (s.length < 2) continue;
    for (const t of tw) {
      if (t.includes(s) || s.includes(t)) {
        matched++;
        break;
      }
    }
  }

  return Math.min(1, matched / Math.max(tw.length, 1));
}

function extractPayload(cmd: string): string {
  return cmd
    .replace(
      /^(open|play|start|go to|navigate to|take me to|show me|show|launch|run|begin|watch)\s+/i,
      ""
    )
    .replace(/\s+(course|class|lesson|video|tutorial)$/i, "")
    .trim();
}

/* ───────────────────────────────────────────── */
/* PROVIDER */
/* ───────────────────────────────────────────── */
export function VoiceProvider({ children }: { children: ReactNode }) {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<VoiceCommand[]>([]);
  const [feedback, setFeedback] = useState("");
  const [autoPlayCourseId, setAutoPlayCourseId] = useState<string | null>(null);
  const micLevel = 0;

  const navigateRef = useRef<((p: string) => void) | null>(null);
  const recognitionRef = useRef<any>(null);
  const isActiveRef = useRef(false);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window ||
      "webkitSpeechRecognition" in window);

  const clearAutoPlay = useCallback(() => setAutoPlayCourseId(null), []);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 4000);
  };

  /* ───────────────────────────────────────────── */
  /* COMMAND PROCESSOR */
  /* ───────────────────────────────────────────── */
  const processCommand = (transcript: string) => {
    const raw = transcript.toLowerCase().trim();
    if (!raw) return;

    setLastCommand(raw);
    let recognized = true;

    if (raw.includes("dashboard")) {
      hardNavigate(navigateRef, "/dashboard");
      showFeedback("✓ Dashboard");
    } else if (raw.includes("home")) {
      hardNavigate(navigateRef, "/");
      showFeedback("✓ Home");
    } else if (raw.includes("settings")) {
      hardNavigate(navigateRef, "/settings");
      showFeedback("✓ Settings");
    } else if (raw.includes("leaderboard")) {
      hardNavigate(navigateRef, "/leaderboard");
      showFeedback("✓ Leaderboard");
    } else if (raw.includes("courses")) {
      hardNavigate(navigateRef, "/courses");
      showFeedback("✓ Courses");
    } else {
      // fuzzy course open
      const payload = extractPayload(raw);
      let best = 0;
      let bestCourse: typeof courses[0] | null = null;

      for (const c of courses) {
        const s = fuzzyScore(payload, c.title);
        if (s > best) {
          best = s;
          bestCourse = c;
        }
      }

      if (bestCourse && best > 0.3) {
        setAutoPlayCourseId(bestCourse.id);
        hardNavigate(navigateRef, `/course/${bestCourse.id}`);
        showFeedback(`✓ Opening ${bestCourse.title}`);
      } else {
        recognized = false;
        showFeedback(`"${raw}" not recognized`);
      }
    }

    setCommandHistory((prev) => [
      ...prev,
      { command: raw, timestamp: new Date(), recognized },
    ]);
  };

  /* ───────────────────────────────────────────── */
  /* START LISTENING */
  /* ───────────────────────────────────────────── */
  const startListening = useCallback(() => {
    if (!isSupported) {
      alert("Speech Recognition not supported. Use Chrome.");
      return;
    }

    if (isActiveRef.current) return;

    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SR();

    recognition.continuous = true;       // 🔥 critical
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      console.log("🎤 Mic started");
      setIsListening(true);
      isActiveRef.current = true;
    };

    recognition.onresult = (event: any) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      console.log("📝 Heard:", transcript);
      processCommand(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("❌ Error:", event.error);
      showFeedback(`Error: ${event.error}`);
    };

    recognition.onend = () => {
      console.log("🔁 Restarting...");
      if (isActiveRef.current) {
        recognition.start();
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported]);

  /* ───────────────────────────────────────────── */
  /* STOP LISTENING */
  /* ───────────────────────────────────────────── */
  const stopListening = useCallback(() => {
    isActiveRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    showFeedback("Mic Off");
  }, []);

  const toggleListening = useCallback(() => {
    isListening ? stopListening() : startListening();
  }, [isListening, startListening, stopListening]);

  /* CLEANUP */
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        isSupported,
        lastCommand,
        commandHistory,
        startListening,
        stopListening,
        toggleListening,
        feedback,
        autoPlayCourseId,
        clearAutoPlay,
        micLevel,
      }}
    >
      <VoiceNavigateHelper
        onMount={(fn) => {
          navigateRef.current = fn;
        }}
      />
      {feedback && (
        <div className="voice-feedback-toast" role="status">
          {feedback}
        </div>
      )}
      {children}
    </VoiceContext.Provider>
  );
}

/* ───────────────────────────────────────────── */
function VoiceNavigateHelper({
  onMount,
}: {
  onMount: (fn: (p: string) => void) => void;
}) {
  const navigate = useNavigate();
  useEffect(() => {
    onMount(navigate);
  }, [navigate]);
  return null;
}

/* ───────────────────────────────────────────── */
export function useVoice() {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error("useVoice must be used within VoiceProvider");
  return ctx;
}