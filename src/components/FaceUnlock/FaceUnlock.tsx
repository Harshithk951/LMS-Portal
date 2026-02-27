import { useEffect, useMemo, useRef, useState } from "react";
import { FaceDetection, type Results } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";

type Props = {
  enabled: boolean;
  onUnlocked: () => void;
};

function getErrorName(error: unknown): string {
  if (error instanceof Error) return error.name;
  if (typeof error === "object" && error !== null && "name" in error) {
    const name = (error as { name?: unknown }).name;
    if (typeof name === "string") return name;
  }
  return "Error";
}

export default function FaceUnlock({ enabled, onUnlocked }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const cameraRef = useRef<Camera | null>(null);
  const faceRef = useRef<FaceDetection | null>(null);

  const [status, setStatus] = useState<string>("Idle");
  const [error, setError] = useState<string>("");
  const [facePresent, setFacePresent] = useState(false);

  const onUnlockedRef = useRef(onUnlocked);
  const stableCountRef = useRef<number>(0);
  const unlockedRef = useRef<boolean>(false);
  const facePresentRef = useRef<boolean>(false);
  const fatalErrorRef = useRef<boolean>(false);

  const locateFile = useMemo(
    () => (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    []
  );

  useEffect(() => {
    onUnlockedRef.current = onUnlocked;
  }, [onUnlocked]);

  useEffect(() => {
    let disposed = false;

    if (!enabled) {
      // Ensure any lingering tracks are stopped when toggled off.
      try {
        cameraRef.current?.stop();
      } catch {
        /* ignore */
      }
      cameraRef.current = null;
      try {
        faceRef.current?.close();
      } catch {
        /* ignore */
      }
      faceRef.current = null;
      const videoEl = videoRef.current;
      const stream = videoEl?.srcObject as MediaStream | null;
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (videoEl) videoEl.srcObject = null;
      return;
    }

    const stopAll = () => {
      try {
        cameraRef.current?.stop();
      } catch {
        /* ignore */
      }
      cameraRef.current = null;

      try {
        faceRef.current?.close();
      } catch {
        /* ignore */
      }
      faceRef.current = null;

      const videoEl = videoRef.current;
      const stream = videoEl?.srcObject as MediaStream | null;
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (videoEl) videoEl.srcObject = null;
    };

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const setup = async () => {
      try {
        setError("");
        setStatus("Requesting camera permission…");

        const face = new FaceDetection({ locateFile });
        face.setOptions({
          model: "short",
          minDetectionConfidence: 0.6,
        });

        face.onResults((results: Results) => {
          if (disposed) return;

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          const w = video.videoWidth || 640;
          const h = video.videoHeight || 480;
          if (canvas.width !== w) canvas.width = w;
          if (canvas.height !== h) canvas.height = h;

          ctx.save();
          ctx.clearRect(0, 0, w, h);
          ctx.drawImage(results.image as unknown as CanvasImageSource, 0, 0, w, h);

          const hasFace = Boolean(results.detections && results.detections.length > 0);
          if (hasFace !== facePresentRef.current) {
            facePresentRef.current = hasFace;
            setFacePresent(hasFace);
          }

          // Draw a simple bounding box for the first detected face
          const det = results.detections?.[0];
          const box = det?.boundingBox;
          if (box) {
            const rootStyles = getComputedStyle(document.documentElement);
            const accent = rootStyles.getPropertyValue("--accent").trim();
            const textPrimary = rootStyles.getPropertyValue("--text-primary").trim();
            const stroke = accent || textPrimary || "currentColor";

            const xMin = (box.xCenter - box.width / 2) * w;
            const yMin = (box.yCenter - box.height / 2) * h;
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 2;
            ctx.strokeRect(xMin, yMin, box.width * w, box.height * h);
          }

          // Require a short burst of consecutive detections to unlock
          if (hasFace) {
            stableCountRef.current += 1;
          } else {
            stableCountRef.current = 0;
          }

          const stable = stableCountRef.current >= 2; // ~2 frames of presence

          if (stable && !unlockedRef.current) {
            unlockedRef.current = true;
            setStatus("Unlocked");
            disposed = true; // stop further processing
            stopAll();
            onUnlockedRef.current();
          }

          ctx.restore();
        });

        faceRef.current = face;

        const camera = new Camera(video, {
          onFrame: async () => {
            if (disposed || !faceRef.current) return;
            try {
              await faceRef.current.send({ image: video });
            } catch {
              if (!fatalErrorRef.current) {
                fatalErrorRef.current = true;
                setError(
                  "Face detection failed to start. Check your internet connection (MediaPipe model files load from a CDN) and refresh the page."
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
        if (!disposed) setStatus("Scanning…");
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

      stopAll();

      stableCountRef.current = 0;
      unlockedRef.current = false;
      facePresentRef.current = false;
      fatalErrorRef.current = false;

      setFacePresent(false);
      setStatus("Idle");
      setError("");
    };
  }, [enabled, locateFile]);

  return (
    <section className="face-unlock" aria-label="Face unlock" role="region">
      <header className="face-unlock__header">
        <div className="face-unlock__title">Face Unlock</div>
        <div className="face-unlock__meta" aria-live="polite">
          {status}
        </div>
      </header>

      {error ? (
        <div className="face-unlock__error" role="alert">
          {error}
        </div>
      ) : null}

      <div className="face-unlock__stage" aria-label="Camera view">
        <video ref={videoRef} className="face-unlock__video" playsInline muted />
        <canvas ref={canvasRef} className="face-unlock__canvas" />
      </div>

      <div className="face-unlock__result" aria-live="polite">
        {facePresent ? "Face detected" : "No face detected"}
      </div>

      <p className="face-unlock__hint">
        This is face presence detection only (no identity matching). It runs in your browser and does not store images.
      </p>
    </section>
  );
}
