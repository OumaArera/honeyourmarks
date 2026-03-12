import React, { useState, useRef } from "react";
import { Camera, X, Send, CheckCircle, AlertCircle, Image } from "lucide-react";
import { createFormData } from "../../../api/api.service";

const MAX_IMAGES = 10;

function ImageThumb({ src, index, onRemove }) {
  return (
    <div className="relative group rounded-xl overflow-hidden shrink-0" style={{ width: 72, height: 72 }}>
      <img src={src} alt={`capture ${index + 1}`} className="w-full h-full object-cover" />
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "rgba(0,0,0,0.7)" }}
      >
        <X size={10} color="#fff" />
      </button>
      <div className="absolute bottom-1 left-1 text-[9px] font-black px-1 rounded"
        style={{ background: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.8)" }}>
        {index + 1}
      </div>
    </div>
  );
}

function AddImageButton({ onFiles, disabled }) {
  const fileRef   = useRef(null);
  const cameraRef = useRef(null);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) onFiles(files);
    e.target.value = "";
  };

  return (
    <div
      className="flex gap-2 rounded-xl items-center justify-center shrink-0 flex-col"
      style={{ width: 72, height: 72, background: "rgba(255,255,255,0.04)", border: "1.5px dashed rgba(255,255,255,0.15)" }}
    >
      <button type="button" onClick={() => cameraRef.current?.click()} disabled={disabled}
        className="flex flex-col items-center gap-0.5 transition-opacity hover:opacity-70 disabled:opacity-30">
        <Camera size={16} color="rgba(255,255,255,0.4)" />
        <span className="text-[8px] font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>Capture</span>
      </button>
      <button type="button" onClick={() => fileRef.current?.click()} disabled={disabled}
        className="flex flex-col items-center gap-0.5 transition-opacity hover:opacity-70 disabled:opacity-30">
        <Image size={14} color="rgba(255,255,255,0.3)" />
        <span className="text-[8px] font-bold" style={{ color: "rgba(255,255,255,0.25)" }}>Gallery</span>
      </button>
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" multiple className="hidden" onChange={handleFiles} />
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
    </div>
  );
}

export default function ExamSubmissionForm({ exam, student, onSuccess }) {
  const [images, setImages]           = useState([]);
  const [textContent, setTextContent] = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [result, setResult]           = useState(null);
  const [errorMsg, setErrorMsg]       = useState("");

  const canAddMore = images.length < MAX_IMAGES;

  const handleFiles = (files) => {
    const remaining = MAX_IMAGES - images.length;
    const accepted  = files.slice(0, remaining);
    setImages(prev => [...prev, ...accepted.map(file => ({ file, preview: URL.createObjectURL(file) }))]);
  };

  const removeImage = (index) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async () => {
    if (!images.length) return;
    setSubmitting(true);
    setResult(null);
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("student", student.id);
      formData.append("exam", exam.id);
      images.forEach(img => formData.append("images", img.file));
      if (textContent.trim()) formData.append("text_content", textContent.trim());
      const res = await createFormData("exam-submissions/", formData);
      onSuccess?.(res);
      setResult("success");
    } catch (err) {
      console.error("Exam submission failed:", err);
      setResult("error");
      setErrorMsg(err?.response?.data?.detail ?? "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (result === "success") {
    return (
      <div className="py-8 flex flex-col items-center gap-3 text-center">
        <CheckCircle size={40} color="#4ade80" />
        <p className="font-black text-white text-base">Submitted!</p>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          Your exam response has been sent to your teacher for marking.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
          Photos ({images.length}/{MAX_IMAGES})
        </p>
        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => (
            <ImageThumb key={img.preview} src={img.preview} index={i} onRemove={removeImage} />
          ))}
          {canAddMore && <AddImageButton onFiles={handleFiles} disabled={submitting} />}
        </div>
        {!images.length && (
          <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>
            Photograph your answer sheets (max {MAX_IMAGES} images)
          </p>
        )}
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
          Notes <span style={{ color: "rgba(255,255,255,0.2)" }}>(optional)</span>
        </p>
        <textarea
          value={textContent}
          onChange={e => setTextContent(e.target.value)}
          disabled={submitting}
          rows={3}
          placeholder="Any additional context for your teacher…"
          className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.8)" }}
        />
      </div>

      {result === "error" && (
        <div className="flex items-center gap-2 rounded-xl p-3"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
          <AlertCircle size={14} color="#ef4444" className="shrink-0" />
          <p className="text-xs font-semibold" style={{ color: "#ef4444" }}>{errorMsg}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting || !images.length}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all active:scale-[0.98] disabled:opacity-40"
        style={{ background: "#E84A0C", color: "#fff" }}
      >
        {submitting
          ? <><span className="animate-spin">⏳</span> Submitting…</>
          : <><Send size={14} /> Submit Exam Response</>
        }
      </button>
    </div>
  );
}