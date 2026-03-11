import { useEffect, useRef, useState } from "react";
import { getData, createData, patchFormData } from "../../api/api.service";


const TOOL_PEN   = "pen";
const TOOL_TEXT  = "text";
const TOOL_ERASE = "erase";

const COLORS = ["#EF4444","#F97316","#EAB308","#22C55E","#3B82F6","#A855F7","#EC4899","#fff","#000"];

function shortId(id = "") { return id.slice(0, 8); }

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function SubmissionCard({ sub, onMark }) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3 transition-all hover:border-blue-500/30"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-black text-white">Submission #{shortId(sub.id)}</p>
          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            {fmt(sub.created_at)} · {sub.images.length} image{sub.images.length !== 1 ? "s" : ""}
          </p>
        </div>
        <span
          className="text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full"
          style={{ background: "rgba(251,191,36,0.1)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.2)" }}
        >
          Unmarked
        </span>
      </div>

      {/* Image thumbnails */}
      <div className="flex gap-1.5 flex-wrap">
        {sub.images.slice(0, 4).map((img) => (
          <img
            key={img.id}
            src={img.image}
            alt=""
            className="w-14 h-14 object-cover rounded-lg"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          />
        ))}
        {sub.images.length > 4 && (
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center text-xs font-black"
            style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            +{sub.images.length - 4}
          </div>
        )}
      </div>

      <button
        onClick={() => onMark(sub)}
        className="w-full py-2 rounded-xl text-sm font-black transition-all hover:opacity-90"
        style={{
          background: "linear-gradient(135deg,#1D4ED8,#3B82F6)",
          color: "#fff",
          boxShadow: "0 4px 16px rgba(29,78,216,0.3)",
        }}
      >
        ✏️ Mark Submission
      </button>
    </div>
  );
}


function AnnotationCanvas({ src, tool, color, brushSize, onAnnotated }) {
  const canvasRef   = useRef(null);
  const origImgRef  = useRef(null);
  const drawing     = useRef(false);
  const lastPos     = useRef(null);
  const [loaded,    setLoaded]    = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [textInput, setTextInput] = useState(null); // { x, y }

  // Fetch the image as a blob to avoid cross-origin canvas taint
  useEffect(() => {
    let objectUrl = null;
    setLoaded(false);
    setLoadError(false);

    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.blob();
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          origImgRef.current = img;
          const canvas = canvasRef.current;
          if (!canvas) return;
          canvas.width  = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          setLoaded(true);
        };
        img.onerror = () => setLoadError(true);
        img.src = objectUrl;
      })
      .catch(() => setLoadError(true));

    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [src]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top)  * scaleY,
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    if (tool === TOOL_TEXT) {
      const pos = getPos(e);
      setTextInput(pos);
      return;
    }
    drawing.current = true;
    lastPos.current = getPos(e);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing.current || tool === TOOL_TEXT) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    const pos    = getPos(e);

    ctx.lineCap   = "round";
    ctx.lineJoin  = "round";
    ctx.lineWidth = tool === TOOL_ERASE ? brushSize * 4 : brushSize;

    if (tool === TOOL_ERASE) {
      // Redraw area from original image
      const img = origImgRef.current;
      const r   = brushSize * 4;
      ctx.save();
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    } else {
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.92;
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    lastPos.current = pos;
    onAnnotated?.();
  };

  const stopDraw = (e) => {
    e.preventDefault();
    drawing.current = false;
    lastPos.current = null;
  };

  const placeText = (value) => {
    if (!value.trim() || !textInput) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    ctx.font         = `${brushSize * 8}px sans-serif`;
    ctx.fillStyle    = color;
    ctx.globalAlpha  = 1;
    ctx.fillText(value, textInput.x, textInput.y);
    setTextInput(null);
    onAnnotated?.();
  };

  return (
    <div className="relative select-none" style={{ touchAction: "none" }}>
      {!loaded && !loadError && (
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ height: 240, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span className="w-5 h-5 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}

      {loadError && (
        <div
          className="flex items-center justify-center rounded-xl text-sm"
          style={{ height: 240, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", color: "#F87171" }}
        >
          ⚠️ Failed to load image
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="w-full rounded-xl"
        style={{
          display: loaded ? "block" : "none",
          cursor: tool === TOOL_ERASE ? "cell" : tool === TOOL_TEXT ? "text" : "crosshair",
          border: "1px solid rgba(255,255,255,0.1)",
          touchAction: "none",
        }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />

      {/* Floating text input */}
      {textInput && (
        <div
          className="absolute z-20"
          style={{ left: `${(textInput.x / (canvasRef.current?.width || 1)) * 100}%`, top: `${(textInput.y / (canvasRef.current?.height || 1)) * 100}%` }}
        >
          <input
            autoFocus
            type="text"
            placeholder="Type here…"
            className="px-2 py-1 rounded text-sm font-bold outline-none"
            style={{ background: "rgba(0,0,0,0.8)", color, border: `1px solid ${color}`, minWidth: 120 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") placeText(e.target.value);
              if (e.key === "Escape") setTextInput(null);
            }}
            onBlur={(e) => placeText(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}


function MarkingModal({ submission, onClose, onDone }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [tool,       setTool]       = useState(TOOL_PEN);
  const [color,      setColor]      = useState("#EF4444");
  const [brushSize,  setBrushSize]  = useState(3);
  const [score,      setScore]      = useState("");
  const [outOf,      setOutOf]      = useState("");
  const [comments,   setComments]   = useState("");
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState(null);
  const [annotated,  setAnnotated]  = useState(false);

  const canvasRefs = useRef({}); // keyed by image index

  const images = submission.images;

  const getCanvasBlob = (idx) =>
    new Promise((resolve) => {
      const canvas = canvasRefs.current[idx];
      if (!canvas) return resolve(null);
      canvas.toBlob(resolve, "image/jpeg", 0.88);
    });

  const handleSave = async () => {
    if (!score || !outOf) { setError("Please enter score and out-of value."); return; }
    setSaving(true);
    setError(null);

    try {
      // 1. PATCH each annotated image back
      const patchForm = new FormData();
      for (let i = 0; i < images.length; i++) {
        const blob = await getCanvasBlob(i);
        if (blob) {
          patchForm.append(`image_${images[i].id}`, blob, `marked_${images[i].id}.jpg`);
        }
      }

      // Only patch if there are annotated images
      if (annotated) {
        await patchFormData(`exam-submissions/${submission.id}/`, patchForm);
      }

      // 2. POST to exam-results/
      await createData("exam-results/", {
        exam_submission: submission.id,
        score:    parseFloat(score),
        out_of:   parseFloat(outOf),
        comments: comments.trim() || undefined,
      });

      onDone(submission.id);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        .mm-scroll::-webkit-scrollbar { width:4px; }
        .mm-scroll::-webkit-scrollbar-track { background:transparent; }
        .mm-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,.1); border-radius:99px; }
      `}</style>

      <div
        className="fixed inset-0 flex items-center justify-center p-3 sm:p-5"
        style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(10px)", zIndex: 9998 }}
        onClick={onClose}
      >
        <div
          className="w-full flex flex-col"
          style={{
            maxWidth: 960,
            height: "min(95vh, 900px)",
            background: "#060E1A",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            boxShadow: "0 40px 120px rgba(0,0,0,0.9)",
            overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div
            className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div>
              <h2 className="text-base font-black text-white">✏️ Mark Submission</h2>
              <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                #{shortId(submission.id)} · {images.length} image{images.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-lg"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
            >
              ×
            </button>
          </div>

          <div className="flex flex-1 min-h-0">
            {/* ── Left: Canvas area ── */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Toolbar */}
              <div
                className="flex items-center gap-3 px-4 py-3 flex-wrap shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Tools */}
                <div className="flex gap-1">
                  {[
                    { t: TOOL_PEN,   icon: "🖊️",  label: "Pen" },
                    { t: TOOL_TEXT,  icon: "T",   label: "Text" },
                    { t: TOOL_ERASE, icon: "◻",  label: "Erase" },
                  ].map(({ t, icon, label }) => (
                    <button
                      key={t}
                      title={label}
                      onClick={() => setTool(t)}
                      className="px-3 py-1.5 rounded-lg text-xs font-black transition-all"
                      style={
                        tool === t
                          ? { background: "rgba(59,130,246,0.25)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.4)" }
                          : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.07)" }
                      }
                    >
                      {icon}
                    </button>
                  ))}
                </div>

                {/* Colors */}
                <div className="flex gap-1 flex-wrap">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className="w-5 h-5 rounded-full transition-transform hover:scale-110"
                      style={{
                        background: c,
                        border: color === c ? "2px solid #fff" : "2px solid transparent",
                        boxShadow: color === c ? `0 0 8px ${c}` : "none",
                      }}
                    />
                  ))}
                </div>

                {/* Brush size */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black" style={{ color: "rgba(255,255,255,0.3)" }}>SIZE</span>
                  <input
                    type="range" min={1} max={12} value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-20 accent-blue-500"
                  />
                  <span className="text-[10px] font-black" style={{ color: "rgba(255,255,255,0.4)" }}>{brushSize}</span>
                </div>
              </div>

              {/* Image selector tabs */}
              {images.length > 1 && (
                <div
                  className="flex gap-1.5 px-4 py-2 flex-wrap shrink-0"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setCurrentIdx(i)}
                      className="text-[10px] font-black px-2.5 py-1 rounded-lg transition-all"
                      style={
                        currentIdx === i
                          ? { background: "rgba(59,130,246,0.2)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.35)" }
                          : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.06)" }
                      }
                    >
                      Pg {i + 1}
                    </button>
                  ))}
                </div>
              )}

              {/* Canvas */}
              <div className="flex-1 overflow-auto mm-scroll p-4">
                {images.map((img, i) => (
                  <div key={img.id} style={{ display: currentIdx === i ? "block" : "none" }}>
                    <AnnotationCanvas
                      src={img.image}
                      tool={tool}
                      color={color}
                      brushSize={brushSize}
                      onAnnotated={() => setAnnotated(true)}
                      ref={(canvas) => {
                        if (canvas) canvasRefs.current[i] = canvas.querySelector("canvas");
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Grading panel ── */}
            <div
              className="w-64 shrink-0 flex flex-col gap-4 p-5 overflow-y-auto mm-scroll"
              style={{ borderLeft: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-xs font-black text-white">📊 Grade & Result</p>

              {/* Score */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Score
                </label>
                <input
                  type="number" min={0} value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="e.g. 78"
                  className="w-full rounded-xl px-3 py-2 text-sm font-bold text-white outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>

              {/* Out of */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Out of
                </label>
                <input
                  type="number" min={1} value={outOf}
                  onChange={(e) => setOutOf(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full rounded-xl px-3 py-2 text-sm font-bold text-white outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>

              {/* Percentage preview */}
              {score && outOf && (
                <div
                  className="rounded-xl p-3 text-center"
                  style={{ background: "rgba(29,78,216,0.1)", border: "1px solid rgba(29,78,216,0.2)" }}
                >
                  <p className="text-2xl font-black text-white">
                    {Math.round((parseFloat(score) / parseFloat(outOf)) * 100)}%
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Percentage</p>
                </div>
              )}

              {/* Comments */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Comments
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={5}
                  placeholder="Feedback for student…"
                  className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none resize-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>

              {error && (
                <p className="text-xs rounded-xl px-3 py-2" style={{ background: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                  {error}
                </p>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-2.5 rounded-xl text-sm font-black transition-all disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg,#1D4ED8,#3B82F6)",
                  color: "#fff",
                  boxShadow: "0 4px 20px rgba(29,78,216,0.35)",
                }}
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving…
                  </span>
                ) : "✅ Submit Marks"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── ExamSubmissionsView  (main export)
// ─────────────────────────────────────────────────────────────────────────────

export default function ExamSubmissionsView() {
  const [submissions, setSubmissions] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [marking,     setMarking]     = useState(null); // submission being marked

  const fetchSubmissions = async () => {
    setLoading(true);
    const res = await getData("exam-submissions/?is_marked=false");
    if (!res?.error) setSubmissions(res?.results ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const handleDone = (id) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <>
      {marking && (
        <MarkingModal
          submission={marking}
          onClose={() => setMarking(null)}
          onDone={handleDone}
        />
      )}

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black" style={{ color: "rgba(255,255,255,0.3)" }}>
            {loading ? "Loading…" : `${submissions.length} unmark${submissions.length !== 1 ? "ed" : "ed"} submission${submissions.length !== 1 ? "s" : ""}`}
          </p>
          <button
            onClick={fetchSubmissions}
            className="text-[10px] font-black hover:opacity-70 transition-opacity"
            style={{ color: "#60A5FA" }}
          >
            ↺ Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 py-12 justify-center text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
            <span className="w-4 h-4 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
            Fetching submissions…
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <p className="text-3xl">🎉</p>
            <p className="text-sm font-bold text-white">All caught up!</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>No unmarked submissions at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {submissions.map((sub) => (
              <SubmissionCard key={sub.id} sub={sub} onMark={setMarking} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}