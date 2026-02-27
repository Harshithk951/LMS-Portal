import { useEffect, useMemo, useRef, useState } from "react";
import { HAND_CONNECTIONS, Hands, type Results } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

type Props = {
  enabled: boolean;
  onRecognized?: (text: string) => void;
};

type Landmark = { x: number; y: number; z?: number };

type Gesture =
  | "Open Palm"
  | "Fist"
  | "Point"
  | "Peace"
  | "Thumbs Up"
  | "Unknown";

function dist2D(a: Landmark, b: Landmark) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function fingerExtended(lm: Landmark[], tip: number, pip: number) {
  // More stable than comparing y-coordinates; works better across rotations.
  const wrist = lm[0];
  const tipD = dist2D(lm[tip], wrist);
  const pipD = dist2D(lm[pip], wrist);
  return tipD > pipD + 0.02;
}

function classifyGesture(lm: Landmark[]): Gesture {
  const index = fingerExtended(lm, 8, 6);
  const middle = fingerExtended(lm, 12, 10);
  const ring = fingerExtended(lm, 16, 14);
  const pinky = fingerExtended(lm, 20, 18);

  // Thumb: combine distance-to-wrist and lateral separation heuristics.
  const thumbDist = dist2D(lm[4], lm[0]);
  const thumbIpDist = dist2D(lm[3], lm[0]);
  const thumbToIndex = dist2D(lm[4], lm[5]);
  const thumbExtended = thumbDist > thumbIpDist + 0.015 && thumbToIndex > 0.07;

  const extendedCount = [index, middle, ring, pinky].filter(Boolean).length;

  if (extendedCount === 4 && thumbExtended) return "Open Palm";
  if (extendedCount === 0 && !thumbExtended) return "Fist";
  if (index && !middle && !ring && !pinky) return "Point";
  if (index && middle && !ring && !pinky) return "Peace";
  if (thumbExtended && !index && !middle && !ring && !pinky) return "Thumbs Up";

  return "Unknown";
}

function classifyDigit(lm: Landmark[]): number | null {
  const index = fingerExtended(lm, 8, 6);
  const middle = fingerExtended(lm, 12, 10);
  const ring = fingerExtended(lm, 16, 14);
  const pinky = fingerExtended(lm, 20, 18);

  const thumbDist = dist2D(lm[4], lm[0]);
  const thumbIpDist = dist2D(lm[3], lm[0]);
  const thumbToIndex = dist2D(lm[4], lm[5]);
  // Slightly relaxed thresholds: open palm should reliably count as 5.
  const thumbExtended = thumbDist > thumbIpDist + 0.01 && thumbToIndex > 0.06;

  // Digits 1–4 are far more stable when derived from the 4 non-thumb fingers.
  // Thumb detection is the noisiest across camera angles, so only require it for 5.
  const nonThumbCount = [index, middle, ring, pinky].filter(Boolean).length;

  // 0: fist (no non-thumb fingers extended, thumb folded)
  if (nonThumbCount === 0 && !thumbExtended) return 0;

  // 5: all fingers including thumb
  if (nonThumbCount === 4 && thumbExtended) return 5;

  // 1–4: number of extended non-thumb fingers (ignore thumb)
  if (nonThumbCount >= 1 && nonThumbCount <= 4) return nonThumbCount;

  return null;
}

function modeOf(values: Array<number | null>): number | null {
  const counts = new Map<number, number>();
  for (const v of values) {
    if (v === null) continue;
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  let best: number | null = null;
  let bestCount = 0;
  for (const [v, c] of counts) {
    if (c > bestCount) {
      best = v;
      bestCount = c;
    }
  }
  return best;
}

function getErrorName(error: unknown): string {
  if (error instanceof Error) return error.name;
  if (typeof error === "object" && error !== null && "name" in error) {
    const name = (error as { name?: unknown }).name;
    if (typeof name === "string") return name;
  }
  return "Error";
}

export default function SignInterpreter({ enabled, onRecognized }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const cameraRef = useRef<Camera | null>(null);
  const handsRef = useRef<Hands | null>(null);
  const lastGestureRef = useRef<Gesture>("Unknown");
  const lastDigitRef = useRef<number | null>(null);
  const digitWindowRef = useRef<Array<number | null>>([]);
  const stableDigitRef = useRef<number | null>(null);
  const handPresentRef = useRef(false);
  const fatalErrorRef = useRef(false);
  const onRecognizedRef = useRef<Props["onRecognized"]>(onRecognized);

  const [status, setStatus] = useState<string>("Idle");
  const [lastGesture, setLastGesture] = useState<Gesture>("Unknown");
  const [stableDigit, setStableDigit] = useState<number | null>(null);
  const [handPresent, setHandPresent] = useState(false);
  const [error, setError] = useState<string>("");

  const locateFile = useMemo(
    () => (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    []
  );

  useEffect(() => {
    onRecognizedRef.current = onRecognized;
  }, [onRecognized]);

  useEffect(() => {
    if (!enabled) return;

    let disposed = false;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const setup = async () => {
      try {
        setError("");
        setStatus("Requesting camera permission…");

        const hands = new Hands({ locateFile });
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });

        hands.onResults((results: Results) => {
          if (disposed) return;

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          const w = video.videoWidth || 640;
          const h = video.videoHeight || 480;
          if (canvas.width !== w) canvas.width = w;
          if (canvas.height !== h) canvas.height = h;

          ctx.save();
          ctx.clearRect(0, 0, w, h);

          // Draw video frame
          // results.image is the input frame
          ctx.drawImage(results.image as unknown as CanvasImageSource, 0, 0, w, h);

          const lm = results.multiHandLandmarks?.[0];

          const hasHand = Boolean(lm && lm.length);
          if (hasHand !== handPresentRef.current) {
            handPresentRef.current = hasHand;
            setHandPresent(hasHand);
          }

          if (hasHand && lm) {
            // Draw overlay using theme tokens (no hard-coded colors)
            const rootStyles = getComputedStyle(document.documentElement);
            const accent = rootStyles.getPropertyValue("--accent").trim();
            const textPrimary = rootStyles.getPropertyValue("--text-primary").trim();
            const stroke = accent || textPrimary || "currentColor";
            drawConnectors(ctx, lm, HAND_CONNECTIONS, {
              color: stroke,
              lineWidth: 2,
            });
            drawLandmarks(ctx, lm, {
              color: stroke,
              lineWidth: 1,
            });

            const gesture = classifyGesture(lm as unknown as Landmark[]);
            const digit = classifyDigit(lm as unknown as Landmark[]);
            if (gesture !== lastGestureRef.current) {
              lastGestureRef.current = gesture;
              setLastGesture(gesture);
            }

            if (digit !== lastDigitRef.current) {
              lastDigitRef.current = digit;
            }

            // Smooth digits to reduce flicker: mode over the last ~8 frames.
            const window = digitWindowRef.current;
            window.push(digit);
            if (window.length > 8) window.shift();
            const m = modeOf(window);

            // Require some confidence before committing a stable digit.
            const matches = window.filter((v) => v === m).length;
            const confident = m !== null && matches >= 4;

            if (confident && m !== stableDigitRef.current) {
              stableDigitRef.current = m;
              setStableDigit(m);
              onRecognizedRef.current?.(String(m));
            }
          }

          ctx.restore();
        });

        handsRef.current = hands;

        const camera = new Camera(video, {
          onFrame: async () => {
            if (disposed || !handsRef.current) return;
            try {
              await handsRef.current.send({ image: video });
            } catch {
              // Most common cause: model assets (wasm/solutions) failed to load.
              if (!fatalErrorRef.current) {
                fatalErrorRef.current = true;
                setError(
                  "Hand tracking failed to start. Check your internet connection (MediaPipe model files load from a CDN) and refresh the page."
                );
                setStatus("Stopped");
              }
            }
          },
          width: 640,
          height: 480,
        });

        cameraRef.current = camera;
        await camera.start();
        if (!disposed) setStatus("Running");
      } catch (e: unknown) {
        const name = getErrorName(e);
        if (name === "NotAllowedError") {
          setError(
            "Camera permission is blocked. On macOS: System Settings → Privacy & Security → Camera → allow access for your browser (or VS Code if using its browser)."
          );
        } else {
          setError("Unable to start camera. Make sure no other app is using it.");
        }
        setStatus("Stopped");
      }
    };

    setup();

    return () => {
      disposed = true;

      try {
        cameraRef.current?.stop();
      } catch {
        // ignore
      }
      cameraRef.current = null;

      try {
        handsRef.current?.close();
      } catch {
        // ignore
      }
      handsRef.current = null;

      const stream = video.srcObject as MediaStream | null;
      if (stream) stream.getTracks().forEach((t) => t.stop());
      video.srcObject = null;

      setStatus("Idle");
      setLastGesture("Unknown");
      lastGestureRef.current = "Unknown";
      lastDigitRef.current = null;
      digitWindowRef.current = [];
      stableDigitRef.current = null;
      setStableDigit(null);
      handPresentRef.current = false;
      fatalErrorRef.current = false;
      setHandPresent(false);
      setError("");
    };
  }, [enabled, locateFile]);

  return (
    <section className="signi" aria-label="Sign interpreter" role="region">
      <header className="signi__header">
        <div className="signi__title">Sign Interpreter</div>
        <div className="signi__meta">
          <span className="signi__status" aria-live="polite">
            {status}
          </span>
        </div>
      </header>

      {error ? (
        <div className="signi__error" role="alert">
          {error}
        </div>
      ) : null}

      <div className="signi__stage" aria-label="Camera view">
        <video ref={videoRef} className="signi__video" playsInline muted />
        <canvas ref={canvasRef} className="signi__canvas" />
      </div>

      <div className="signi__result" aria-live="polite">
        {handPresent ? (
          <>
            Number: <strong>{stableDigit ?? "—"}</strong> · Gesture: <strong>{lastGesture}</strong>
          </>
        ) : (
          <>No hand detected (show your hand to the camera)</>
        )}
      </div>

      <p className="signi__hint">
        Tip: keep your hand centered, palm facing the camera, with good lighting. This demo recognizes basic gestures
        (open palm / fist / point / peace / thumbs up), not full ASL letters/words yet.
      </p>
    </section>
  );
}
