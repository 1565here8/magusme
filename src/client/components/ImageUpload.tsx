import { useState, useRef, useCallback } from "react";
import { Upload, Camera, X, ArrowRight, Sparkles } from "lucide-react";

type Mode = "face" | "palm";

interface ImageUploadProps {
  mode: Mode;
  onCancel: () => void;
  onAnalyze: (files: File[]) => void;
  analyzing?: boolean;
}

const slotLabels: Record<Mode, string[]> = {
  face: ["Front Face (required)", "Left Profile (optional)", "Right Profile (optional)"],
  palm: ["Right Palm (required)", "Left Palm (optional)"],
};

export function ImageUpload({ mode, onCancel, onAnalyze, analyzing }: ImageUploadProps) {
  const slots = slotLabels[mode];
  const [images, setImages] = useState<(File | null)[]>(slots.map(() => null));
  const [previews, setPreviews] = useState<(string | null)[]>(slots.map(() => null));
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [activeSlot, setActiveSlot] = useState(0);
  const cameraRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const cameraIndexRef = useRef(0);

  const setFile = useCallback((index: number, file: File) => {
    const url = URL.createObjectURL(file);
    setImages(prev => {
      const next = [...prev];
      // Revoke old preview
      if (next[index]) URL.revokeObjectURL(previews[index] ?? "");
      next[index] = file;
      return next;
    });
    setPreviews(prev => {
      const next = [...prev];
      if (next[index]) URL.revokeObjectURL(next[index]!);
      next[index] = url;
      return next;
    });
    // Bump slot
    if (index < slots.length - 1 && images[index + 1] === null) {
      setActiveSlot(index + 1);
    }
  }, [slots.length, images, previews]);

  const removeFile = useCallback((index: number) => {
    setImages(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
    setPreviews(prev => {
      const next = [...prev];
      if (next[index]) URL.revokeObjectURL(next[index]!);
      next[index] = null;
      return next;
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragIndex(null);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) setFile(index, file);
  }, [setFile]);

  const handleFilePick = useCallback((index: number) => {
    setActiveSlot(index);
    fileRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFile(activeSlot, file);
    e.target.value = "";
  }, [activeSlot, setFile]);

  const openCamera = useCallback((index: number) => {
    cameraIndexRef.current = index;
    setShowCamera(true);
  }, []);

  const captureFrame = useCallback(() => {
    const video = cameraRef.current;
    if (!video) return;
    const c = document.createElement("canvas");
    c.width = video.videoWidth;
    c.height = video.videoHeight;
    c.getContext("2d")?.drawImage(video, 0, 0);
    c.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `capture-${cameraIndexRef.current}.png`, { type: "image/png" });
      setFile(cameraIndexRef.current, file);
      setShowCamera(false);
    }, "image/png");
  }, [setFile]);

  const allRequired = images[0] !== null;
  const anyImages = images.some(Boolean);

  if (showCamera) {
    return (
      <CameraView
        onCapture={captureFrame}
        onClose={() => setShowCamera(false)}
        videoRef={cameraRef}
      />
    );
  }

  return (
    <div className="text-white">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold">
          {mode === "face" ? "Upload Face Photos" : "Upload Palm Photos"}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {mode === "face"
            ? "Front-facing photo required. Left/right profiles improve accuracy."
            : "Right palm required. Left palm improves accuracy."}
        </p>
      </div>

      <div className="grid gap-4 max-w-md mx-auto mb-6">
        {slots.map((label, i) => (
          <div
            key={i}
            onDragOver={(e) => { e.preventDefault(); setDragIndex(i); }}
            onDragLeave={() => setDragIndex(null)}
            onDrop={(e) => handleDrop(e, i)}
            onClick={() => !images[i] && handleFilePick(i)}
            className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 ${
              images[i]
                ? "border-purple-500/40 bg-purple-500/5"
                : dragIndex === i
                  ? "border-purple-400 bg-purple-500/10"
                  : "border-white/[0.08] hover:border-purple-500/30 bg-white/[0.02]"
            }`}
          >
            {images[i] && previews[i] ? (
              <div className="relative">
                <img
                  src={previews[i]!}
                  alt={label}
                  className="w-full h-28 object-cover rounded-lg"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  className="absolute top-1 right-1 p-1 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-4">
                <Upload className="w-6 h-6 text-gray-600" />
                <span className="text-xs text-gray-600">{label}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Action buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={onCancel}
          disabled={analyzing}
          className="px-5 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-gray-400 hover:text-white transition-all disabled:opacity-50"
        >
          Cancel
        </button>

        {anyImages && !allRequired && (
          <button
            onClick={() => openCamera(images.findIndex(x => x === null))}
            disabled={analyzing}
            className="px-5 py-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-sm text-purple-300 hover:bg-purple-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Use Camera
          </button>
        )}

        <button
          onClick={() => onAnalyze(images.filter(Boolean) as File[])}
          disabled={!allRequired || analyzing}
          className="px-6 py-2.5 bg-purple-500/20 border border-purple-500/30 rounded-xl text-sm font-semibold text-purple-300 hover:bg-purple-500/30 transition-all disabled:opacity-40 flex items-center gap-2"
        >
          {analyzing ? (
            <>Analyzing...</>
          ) : (
            <>
              Cast Reading <Sparkles className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── Inline Camera ─── */
function CameraView({
  onCapture,
  onClose,
  videoRef,
}: {
  onCapture: () => void;
  onClose: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  const start = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch {
      setError("Camera access denied. Use file upload instead.");
    }
  }, [videoRef]);

  const stop = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
  }, [stream]);

  return (
    <div
      className="text-white"
      onMouseEnter={() => { if (!stream) start(); }}
    >
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold">Capture Photo</h3>
      </div>

      {error ? (
        <div className="text-center py-8">
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-gray-400"
          >
            Back to Upload
          </button>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden bg-black max-w-sm mx-auto mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            onCanPlay={() => setReady(true)}
            className="w-full aspect-[3/4] object-cover"
          />
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <p className="text-sm text-gray-400">Starting camera...</p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <button
          onClick={() => { stop(); onClose(); }}
          className="px-5 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-gray-400"
        >
          Cancel
        </button>
        {ready && (
          <button
            onClick={() => { onCapture(); stop(); }}
            className="px-6 py-2.5 bg-purple-500/20 border border-purple-500/30 rounded-xl text-sm font-semibold text-purple-300 hover:bg-purple-500/30 transition-all flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Capture
          </button>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
