import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { TextAlign } from "@tiptap/extension-text-align";
import { FontFamily } from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import { Underline } from "@tiptap/extension-underline";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import js from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";

// ─────────────────────────────────────────────────────────────────────────────
// ── Lowlight (syntax highlighting)
// ─────────────────────────────────────────────────────────────────────────────
const lowlight = createLowlight();
lowlight.register("javascript", js);
lowlight.register("python", python);

// ─────────────────────────────────────────────────────────────────────────────
// ── External CDN scripts
// ─────────────────────────────────────────────────────────────────────────────
function injectOnce(id, tag, attrs) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const el = document.createElement(tag);
  el.id = id;
  Object.entries(attrs).forEach(([k, v]) => (el[k] = v));
  document.head.appendChild(el);
}
injectOnce("katex-css", "link",   { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" });
injectOnce("katex-js",  "script", { src: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js", defer: true });
injectOnce("chartjs",   "script", { src: "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js", defer: true });
injectOnce("hljs-css",  "link",   { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css" });

// ─────────────────────────────────────────────────────────────────────────────
// ── Fonts
// ─────────────────────────────────────────────────────────────────────────────
const FONTS = [
  { key: "Georgia, serif",               label: "Georgia"          },
  { key: "'Inter', sans-serif",           label: "Inter"            },
  { key: "'Roboto', sans-serif",          label: "Roboto"           },
  { key: "'Open Sans', sans-serif",       label: "Open Sans"        },
  { key: "'Lato', sans-serif",            label: "Lato"             },
  { key: "'Montserrat', sans-serif",      label: "Montserrat"       },
  { key: "'Poppins', sans-serif",         label: "Poppins"          },
  { key: "'Playfair Display', serif",     label: "Playfair Display" },
  { key: "'Merriweather', serif",         label: "Merriweather"     },
  { key: "'Source Code Pro', monospace",  label: "Source Code Pro"  },
  { key: "'JetBrains Mono', monospace",   label: "JetBrains Mono"   },
];

if (typeof document !== "undefined" && !document.getElementById("tt-google-fonts")) {
  const families = ["Inter","Roboto","Open+Sans","Lato","Montserrat","Poppins",
    "Playfair+Display","Merriweather","Source+Code+Pro","JetBrains+Mono"]
    .map((f) => `family=${f}:wght@400;600;700`).join("&");
  const link = document.createElement("link");
  link.id = "tt-google-fonts"; link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
  document.head.appendChild(link);
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Shared UI primitives
// ─────────────────────────────────────────────────────────────────────────────
function Divider() {
  return <div style={{ width:1, height:32, background:"rgba(255,255,255,0.1)", margin:"0 5px", flexShrink:0 }} />;
}

function Btn({ active, onClick, title, children, danger, disabled }) {
  return (
    <button type="button"
      onMouseDown={(e) => { e.preventDefault(); if (!disabled) onClick?.(); }}
      title={title} disabled={disabled}
      style={{
        minWidth:56, height:44, padding:"0 12px", fontSize:15, fontWeight:700,
        borderRadius:8, cursor: disabled ? "default" : "pointer",
        background: active ? "rgba(180,83,9,0.25)" : danger ? "rgba(248,113,113,0.08)" : "transparent",
        color: active ? "#F59E0B" : danger ? "#F87171" : "rgba(255,255,255,0.55)",
        border: active ? "1px solid rgba(180,83,9,0.4)" : "1px solid transparent",
        opacity: disabled ? 0.35 : 1, transition:"all .1s", display:"flex",
        alignItems:"center", justifyContent:"center", userSelect:"none",
      }}>
      {children}
    </button>
  );
}

function Sel({ value, onChange, children, width = 120 }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      style={{
        width, height:44, padding:"0 32px 0 12px", fontSize:14, fontWeight:700,
        borderRadius:8, outline:"none", cursor:"pointer", appearance:"none",
        background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
        color:"#e2e8f0",
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(255,255,255,0.3)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat:"no-repeat", backgroundPosition:"right 5px center",
      }}>
      {children}
    </select>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Modal shell
// ─────────────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, width = 480, children }) {
  return (
    <div style={{ position:"fixed", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
      padding:16, background:"rgba(0,0,0,0.85)", backdropFilter:"blur(8px)", zIndex:99999 }}
      onClick={onClose}>
      <div style={{ width:"100%", maxWidth:width, maxHeight:"90vh", overflowY:"auto",
        background:"#0D1B2A", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20,
        padding:24, boxShadow:"0 24px 80px rgba(0,0,0,0.7)", display:"flex", flexDirection:"column", gap:16 }}
        onClick={(e) => e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <h3 style={{ margin:0, fontWeight:900, color:"#fff", fontSize:15 }}>{title}</h3>
          <button type="button" onClick={onClose}
            style={{ width:32, height:32, borderRadius:"50%", border:"none", cursor:"pointer", fontSize:18,
              background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.5)", display:"flex",
              alignItems:"center", justifyContent:"center" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalFooter({ onClose, onConfirm, label, disabled }) {
  return (
    <div style={{ display:"flex", justifyContent:"flex-end", gap:10, paddingTop:4 }}>
      <button type="button" onClick={onClose}
        style={{ padding:"8px 20px", borderRadius:12, border:"1px solid rgba(255,255,255,0.08)",
          background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.5)", fontWeight:700,
          fontSize:13, cursor:"pointer" }}>Cancel</button>
      <button type="button" onClick={onConfirm} disabled={disabled}
        style={{ padding:"8px 22px", borderRadius:12, border:"none", fontWeight:700, fontSize:13,
          cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.4 : 1,
          background:"linear-gradient(135deg,#B45309,#D97706)", color:"#fff",
          boxShadow:"0 4px 16px rgba(180,83,9,0.4)" }}>{label}</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Table insertion modal
// ─────────────────────────────────────────────────────────────────────────────
function TableModal({ editor, onClose }) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  return (
    <Modal title="⊞ Insert Table" onClose={onClose} width={340}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {[["Rows", rows, setRows], ["Columns", cols, setCols]].map(([label, val, setter]) => (
          <div key={label} style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <label style={{ fontSize:10, fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>{label}</label>
            <input type="number" min={1} max={20} value={val}
              onChange={(e) => setter(Math.max(1, Math.min(20, +e.target.value)))}
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:10, color:"#fff", padding:8, fontSize:14, fontWeight:700, textAlign:"center", outline:"none" }} />
          </div>
        ))}
      </div>
      {/* Preview grid */}
      <div style={{ overflowX:"auto", borderRadius:10, padding:10,
        background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", maxHeight:140 }}>
        <table style={{ borderCollapse:"collapse", width:"100%" }}>
          <thead><tr>
            {Array.from({ length:Math.min(cols,6) }, (_,i) => (
              <th key={i} style={{ border:"1px solid rgba(245,158,11,0.3)", padding:"3px 8px",
                background:"rgba(180,83,9,0.15)", color:"#F59E0B", fontSize:10, fontWeight:700 }}>H{i+1}</th>
            ))}
            {cols > 6 && <th style={{ color:"rgba(255,255,255,0.3)", fontSize:10 }}>…</th>}
          </tr></thead>
          <tbody>{Array.from({ length:Math.min(rows,4) }, (_,r) => (
            <tr key={r}>{Array.from({ length:Math.min(cols,6) }, (_,c) => (
              <td key={c} style={{ border:"1px solid rgba(255,255,255,0.07)", padding:"3px 8px",
                color:"rgba(255,255,255,0.3)", fontSize:10 }}>·</td>
            ))}</tr>
          ))}</tbody>
        </table>
      </div>
      <ModalFooter onClose={onClose}
        onConfirm={() => { editor.chain().focus().insertTable({ rows, cols, withHeaderRow:true }).run(); onClose(); }}
        label={`Insert ${rows} × ${cols} Table`} />
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Math modal
// ─────────────────────────────────────────────────────────────────────────────
const MATH_SNIPPETS = [
  { label:"Fraction",    latex:"\\frac{a}{b}" },
  { label:"√ Root",      latex:"\\sqrt{x}" },
  { label:"Power",       latex:"x^{n}" },
  { label:"Subscript",   latex:"x_{n}" },
  { label:"Integral",    latex:"\\int_{a}^{b} f(x)\\,dx" },
  { label:"Sum",         latex:"\\sum_{i=1}^{n} x_i" },
  { label:"Limit",       latex:"\\lim_{x \\to \\infty} f(x)" },
  { label:"Matrix",      latex:"\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}" },
  { label:"Quadratic",   latex:"x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}" },
  { label:"Derivative",  latex:"\\frac{d}{dx}\\left[f(x)\\right]" },
  { label:"Binomial",    latex:"\\binom{n}{k}=\\frac{n!}{k!(n-k)!}" },
  { label:"Vector",      latex:"\\vec{v}=\\langle v_1,v_2,v_3\\rangle" },
];

function MathModal({ editor, onClose }) {
  const [latex,   setLatex]   = useState("\\frac{a}{b}");
  const [preview, setPreview] = useState("");
  const [error,   setError]   = useState(null);
  const [block,   setBlock]   = useState(false);

  useEffect(() => {
    if (!window.katex) { setPreview(""); return; }
    try {
      setPreview(window.katex.renderToString(latex, { throwOnError:true, displayMode:block }));
      setError(null);
    } catch (e) { setError(e.message); setPreview(""); }
  }, [latex, block]);

  const handleInsert = () => {
    if (error || !latex.trim() || !window.katex) return;
    const rendered = window.katex.renderToString(latex, { throwOnError:false, displayMode:block });
    const tag = block ? "div" : "span";
    const cls = block ? "math-block" : "math-inline";
    const encoded = encodeURIComponent(latex);
    editor.chain().focus().insertContent(
      `<${tag} class="${cls}" data-latex="${encoded}">${rendered}</${tag}>`
    ).run();
    onClose();
  };

  return (
    <Modal title="∑ Insert Math Formula" onClose={onClose} width={540}>
      {/* Snippets */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
        {MATH_SNIPPETS.map((s) => (
          <button key={s.label} type="button" onClick={() => setLatex(s.latex)}
            style={{ padding:"4px 10px", borderRadius:8, fontSize:11, fontWeight:700, cursor:"pointer",
              background:"rgba(255,255,255,0.04)", color:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.08)" }}>
            {s.label}
          </button>
        ))}
      </div>
      {/* Inline/Block */}
      <div style={{ display:"flex", gap:8 }}>
        {[["Inline", false], ["Block (display)", true]].map(([label, val]) => (
          <button key={label} type="button" onClick={() => setBlock(val)}
            style={{ padding:"4px 14px", borderRadius:8, fontSize:11, fontWeight:900, cursor:"pointer",
              background: block===val ? "rgba(180,83,9,0.2)" : "rgba(255,255,255,0.04)",
              color: block===val ? "#F59E0B" : "rgba(255,255,255,0.4)",
              border: block===val ? "1px solid rgba(180,83,9,0.35)" : "1px solid rgba(255,255,255,0.08)" }}>
            {label}
          </button>
        ))}
      </div>
      {/* LaTeX input */}
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        <label style={{ fontSize:10, fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>LaTeX</label>
        <input type="text" value={latex} onChange={(e) => setLatex(e.target.value)}
          style={{ background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10,
            color:"#34D399", padding:"10px 14px", fontSize:14, fontFamily:"monospace", outline:"none" }} />
      </div>
      {/* Preview */}
      <div style={{ borderRadius:10, padding:16, minHeight:56, display:"flex", alignItems:"center", justifyContent:"center",
        overflowX:"auto", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
        {error
          ? <span style={{ fontSize:11, color:"#F87171" }}>⚠ {error}</span>
          : preview
            ? <div style={{ color:"#fff" }} dangerouslySetInnerHTML={{ __html:preview }} />
            : <span style={{ fontSize:12, color:"rgba(255,255,255,0.2)" }}>KaTeX loading…</span>}
      </div>
      <ModalFooter onClose={onClose} onConfirm={handleInsert} label="Insert Formula" disabled={!!error || !latex.trim()} />
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Graph modal
// ─────────────────────────────────────────────────────────────────────────────
const CHART_TYPES = ["bar","line","pie","doughnut","radar","polarArea"];
const CHART_PRESETS = {
  bar:       { type:"bar",       data:{ labels:["Jan","Feb","Mar","Apr","May"], datasets:[{ label:"Series A", data:[30,50,40,70,60], backgroundColor:"rgba(96,165,250,0.6)", borderColor:"#60A5FA", borderWidth:2 }] }, options:{ responsive:true, plugins:{ legend:{ labels:{ color:"#fff" } } }, scales:{ x:{ ticks:{ color:"#aaa" }, grid:{ color:"rgba(255,255,255,0.06)" } }, y:{ ticks:{ color:"#aaa" }, grid:{ color:"rgba(255,255,255,0.06)" } } } } },
  line:      { type:"line",      data:{ labels:["Mon","Tue","Wed","Thu","Fri"], datasets:[{ label:"Trend", data:[10,25,18,40,35], borderColor:"#34D399", backgroundColor:"rgba(52,211,153,0.1)", fill:true, tension:0.4 }] }, options:{ responsive:true, plugins:{ legend:{ labels:{ color:"#fff" } } }, scales:{ x:{ ticks:{ color:"#aaa" }, grid:{ color:"rgba(255,255,255,0.06)" } }, y:{ ticks:{ color:"#aaa" }, grid:{ color:"rgba(255,255,255,0.06)" } } } } },
  pie:       { type:"pie",       data:{ labels:["Red","Blue","Green","Yellow"], datasets:[{ data:[30,25,20,25], backgroundColor:["#F87171","#60A5FA","#34D399","#FBBF24"], borderColor:"#07111F", borderWidth:2 }] }, options:{ responsive:true, plugins:{ legend:{ labels:{ color:"#fff" } } } } },
  doughnut:  { type:"doughnut",  data:{ labels:["Science","Math","English","History"], datasets:[{ data:[35,30,20,15], backgroundColor:["#818CF8","#F59E0B","#34D399","#F87171"], borderColor:"#07111F", borderWidth:2 }] }, options:{ responsive:true, plugins:{ legend:{ labels:{ color:"#fff" } } } } },
  radar:     { type:"radar",     data:{ labels:["Speed","Strength","Agility","Intelligence","Endurance"], datasets:[{ label:"Student A", data:[80,60,70,90,75], borderColor:"#A78BFA", backgroundColor:"rgba(167,139,250,0.15)" }] }, options:{ responsive:true, scales:{ r:{ ticks:{ color:"#aaa", backdropColor:"transparent" }, grid:{ color:"rgba(255,255,255,0.1)" }, pointLabels:{ color:"#ddd" }, angleLines:{ color:"rgba(255,255,255,0.08)" } } }, plugins:{ legend:{ labels:{ color:"#fff" } } } } },
  polarArea: { type:"polarArea", data:{ labels:["Q1","Q2","Q3","Q4"], datasets:[{ data:[40,60,50,70], backgroundColor:["rgba(96,165,250,0.5)","rgba(52,211,153,0.5)","rgba(251,191,36,0.5)","rgba(248,113,113,0.5)"] }] }, options:{ responsive:true, scales:{ r:{ ticks:{ backdropColor:"transparent", color:"#aaa" } } }, plugins:{ legend:{ labels:{ color:"#fff" } } } } },
};

function GraphModal({ editor, onClose }) {
  const [type,    setType]    = useState("bar");
  const [jsonVal, setJsonVal] = useState(JSON.stringify(CHART_PRESETS.bar, null, 2));
  const [error,   setError]   = useState(null);
  const previewRef = useRef(null);
  const chartRef   = useRef(null);

  useEffect(() => {
    setJsonVal(JSON.stringify(CHART_PRESETS[type] ?? CHART_PRESETS.bar, null, 2));
    setError(null);
  }, [type]);

  useEffect(() => {
    if (!previewRef.current) return;
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    try {
      const config = JSON.parse(jsonVal);
      if (window.Chart) { chartRef.current = new window.Chart(previewRef.current, config); setError(null); }
    } catch (e) { setError(e.message); }
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [jsonVal]);

  const handleInsert = () => {
    try {
      const config = JSON.parse(jsonVal);
      const id = `chart-${Date.now()}`;
      editor.chain().focus().insertContent(
        `<div class="chart-embed" id="${id}" data-config="${encodeURIComponent(JSON.stringify(config))}"><canvas></canvas></div>`
      ).run();
      setTimeout(() => {
        const el = document.getElementById(id);
        const canvas = el?.querySelector("canvas");
        if (canvas && window.Chart) new window.Chart(canvas, config);
      }, 120);
      onClose();
    } catch (e) { setError(e.message); }
  };

  return (
    <Modal title="📊 Insert Graph" onClose={onClose} width={820}>
      {/* Type tabs */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {CHART_TYPES.map((t) => (
          <button key={t} type="button" onClick={() => setType(t)}
            style={{ padding:"6px 14px", borderRadius:8, fontSize:11, fontWeight:900, cursor:"pointer", textTransform:"capitalize",
              background: type===t ? "rgba(180,83,9,0.25)" : "rgba(255,255,255,0.04)",
              color: type===t ? "#F59E0B" : "rgba(255,255,255,0.4)",
              border: type===t ? "1px solid rgba(180,83,9,0.4)" : "1px solid rgba(255,255,255,0.08)" }}>
            {t}
          </button>
        ))}
      </div>
      {/* Editor + preview */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <span style={{ fontSize:10, fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>Chart.js Config (JSON)</span>
          <textarea value={jsonVal} onChange={(e) => { setJsonVal(e.target.value); setError(null); }}
            rows={14} spellCheck={false}
            style={{ width:"100%", borderRadius:10, fontSize:11, fontFamily:"monospace", lineHeight:1.6,
              background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.1)", color:"#34D399",
              padding:"12px 14px", resize:"vertical", outline:"none" }} />
          {error && <span style={{ fontSize:11, color:"#F87171" }}>⚠ {error}</span>}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <span style={{ fontSize:10, fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>Preview</span>
          <div style={{ flex:1, borderRadius:10, padding:12, minHeight:220, display:"flex", alignItems:"center", justifyContent:"center",
            background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
            <canvas ref={previewRef} />
          </div>
        </div>
      </div>
      <ModalFooter onClose={onClose} onConfirm={handleInsert} label="Insert Graph" />
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Table controls bar (shown when cursor is inside a table)
// ─────────────────────────────────────────────────────────────────────────────
function TableControls({ editor }) {
  if (!editor?.isActive("table")) return null;
  const e = editor;
  return (
    <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:4, padding:"8px 12px",
      background:"rgba(0,0,0,0.55)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12,
      backdropFilter:"blur(8px)", marginBottom:8 }}>
      <span style={{ fontSize:9, fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase",
        color:"rgba(255,255,255,0.3)", marginRight:4 }}>Table</span>
      <Btn onClick={() => e.chain().focus().addColumnBefore().run()} title="Add column before">←col</Btn>
      <Btn onClick={() => e.chain().focus().addColumnAfter().run()}  title="Add column after">col→</Btn>
      <Btn onClick={() => e.chain().focus().deleteColumn().run()}    title="Delete column" danger>✕col</Btn>
      <Divider />
      <Btn onClick={() => e.chain().focus().addRowBefore().run()} title="Add row above">↑row</Btn>
      <Btn onClick={() => e.chain().focus().addRowAfter().run()}  title="Add row below">row↓</Btn>
      <Btn onClick={() => e.chain().focus().deleteRow().run()}    title="Delete row" danger>✕row</Btn>
      <Divider />
      <Btn onClick={() => e.chain().focus().mergeCells().run()}   title="Merge cells">merge</Btn>
      <Btn onClick={() => e.chain().focus().splitCell().run()}    title="Split cell">split</Btn>
      <Btn onClick={() => e.chain().focus().toggleHeaderRow().run()} title="Toggle header row">hdr</Btn>
      <Divider />
      <Btn onClick={() => e.chain().focus().deleteTable().run()} title="Delete table" danger>🗑 Delete</Btn>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── Main toolbar
// ─────────────────────────────────────────────────────────────────────────────
function Toolbar({ editor, onModal, headingLevel, currentFont }) {
  if (!editor) return null;

  const imageHandler = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*";
    input.onchange = () => {
      const file = input.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => editor.chain().focus().setImage({ src:reader.result }).run();
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const setLink = () => {
    if (editor.isActive("link")) { editor.chain().focus().unsetLink().run(); return; }
    const url = window.prompt("Enter URL:");
    if (url) editor.chain().focus().setLink({ href:url, target:"_blank" }).run();
  };

  return (
    <div style={{
      display:"flex", flexWrap:"wrap", gap:3, alignItems:"center", padding:"6px 10px",
      background:"rgba(10,18,30,0.97)", backdropFilter:"blur(12px)",
      borderBottom:"1px solid rgba(255,255,255,0.07)",
      borderRadius:"15px 15px 0 0", position:"sticky", top:0, zIndex:10,
    }}>
      <Sel value={currentFont} width={150}
        onChange={(v) => v ? editor.chain().focus().setFontFamily(v).run() : editor.chain().focus().unsetFontFamily().run()}>
        <option value="">Default</option>
        {FONTS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
      </Sel>

      <Sel value={headingLevel} width={125}
        onChange={(v) => v==="p" ? editor.chain().focus().setParagraph().run() : editor.chain().focus().setHeading({ level:+v }).run()}>
        <option value="p">Paragraph</option>
        {[1,2,3,4,5,6].map((l) => <option key={l} value={String(l)}>Heading {l}</option>)}
      </Sel>

      <Divider />
      <Btn active={editor.isActive("bold")}        onClick={() => editor.chain().focus().toggleBold().run()}        title="Bold"><b>B</b></Btn>
      <Btn active={editor.isActive("italic")}      onClick={() => editor.chain().focus().toggleItalic().run()}      title="Italic"><i>I</i></Btn>
      <Btn active={editor.isActive("underline")}   onClick={() => editor.chain().focus().toggleUnderline().run()}   title="Underline"><u>U</u></Btn>
      <Btn active={editor.isActive("strike")}      onClick={() => editor.chain().focus().toggleStrike().run()}      title="Strikethrough"><s>S</s></Btn>
      <Btn active={editor.isActive("highlight")}   onClick={() => editor.chain().focus().toggleHighlight().run()}   title="Highlight">▓</Btn>
      <Btn active={editor.isActive("code")}        onClick={() => editor.chain().focus().toggleCode().run()}        title="Inline code">`</Btn>
      <Btn active={editor.isActive("subscript")}   onClick={() => editor.chain().focus().toggleSubscript().run()}   title="Subscript">x₂</Btn>
      <Btn active={editor.isActive("superscript")} onClick={() => editor.chain().focus().toggleSuperscript().run()} title="Superscript">x²</Btn>
      <label title="Text color" style={{ display:"flex", alignItems:"center", gap:2, cursor:"pointer", paddingLeft:2 }}>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.5)", fontWeight:700 }}>A</span>
        <input type="color" defaultValue="#ffffff"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          style={{ width:16, height:16, border:"none", background:"none", cursor:"pointer", padding:0 }} />
      </label>
      <Divider />
      <Btn active={editor.isActive("bulletList")}  onClick={() => editor.chain().focus().toggleBulletList().run()}  title="Bullet list">• ≡</Btn>
      <Btn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">1. ≡</Btn>
      <Btn onClick={() => editor.chain().focus().sinkListItem("listItem").run()} title="Indent">⇥</Btn>
      <Btn onClick={() => editor.chain().focus().liftListItem("listItem").run()} title="Outdent">⇤</Btn>
      <Divider />
      <Btn active={editor.isActive({ textAlign:"left" })}    onClick={() => editor.chain().focus().setTextAlign("left").run()}    title="Left">⬛︎</Btn>
      <Btn active={editor.isActive({ textAlign:"center" })}  onClick={() => editor.chain().focus().setTextAlign("center").run()}  title="Center">≡</Btn>
      <Btn active={editor.isActive({ textAlign:"right" })}   onClick={() => editor.chain().focus().setTextAlign("right").run()}   title="Right">⬜</Btn>
      <Btn active={editor.isActive({ textAlign:"justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()} title="Justify">⊟</Btn>
      <Divider />
      <Btn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}  title="Blockquote">"</Btn>
      <Btn active={editor.isActive("codeBlock")}  onClick={() => editor.chain().focus().toggleCodeBlock().run()}   title="Code block">{`</>`}</Btn>
      <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">—</Btn>
      <Divider />
      <Btn active={editor.isActive("link")} onClick={setLink} title="Link">🔗</Btn>
      <Btn onClick={imageHandler}                              title="Image">🖼</Btn>
      <Divider />
      <Btn onClick={() => onModal("math")}  title="Insert math formula">∑</Btn>
      <Btn onClick={() => onModal("table")} title="Insert table">⊞</Btn>
      <Btn onClick={() => onModal("graph")} title="Insert graph">📊</Btn>
      <Divider />
      <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">↩</Btn>
      <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">↪</Btn>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// ── RichEditor — default export
// ─────────────────────────────────────────────────────────────────────────────
export default function RichEditor({ value, onChange, placeholder }) {
  const [modal, setModal] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline, Subscript, Superscript,
      TextStyle, Color, FontFamily,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target:"_blank", rel:"noopener noreferrer" } }),
      Image.configure({ inline: false, allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow, TableHeader, TableCell,
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({
        placeholder: placeholder ?? "Start writing… toolbar above for formatting, ∑ for formulas, ⊞ for tables, 📊 for graphs.",
      }),
    ],
    content: value || "",
    onUpdate({ editor }) { onChange?.(editor.getHTML()); },
    editorProps: { attributes: { class: "tt-editor-body" } },
  });

  // Sync external value resets
  useEffect(() => {
    if (!editor || value === editor.getHTML()) return;
    editor.commands.setContent(value || "", false);
  }, [value]); // eslint-disable-line

  const tableActive = editor?.isActive("table");

  return (
    <>
      {modal === "math"  && <MathModal  editor={editor} onClose={() => setModal(null)} />}
      {modal === "table" && <TableModal editor={editor} onClose={() => setModal(null)} />}
      {modal === "graph" && <GraphModal editor={editor} onClose={() => setModal(null)} />}

      <style>{`
        .tt-shell {
          border-radius: 16px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 8px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
          transition: border-color .2s;
        }
        .tt-shell:focus-within { border-color: rgba(180,83,9,0.55); }
        .tt-shell select option {
          background: #0d1520;
          color: #e2e8f0;
        }
        .tt-editor-body {
          min-height: 480px; padding: 28px 36px; outline: none;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 16px; line-height: 1.85;
          color: #e2e8f0;
          background: #0d1520;
        }
        @media (max-width:768px) { .tt-editor-body { min-height:300px; padding:18px 20px; } }

        /* Placeholder */
        .tt-editor-body p.is-editor-empty:first-child::before {
          content: attr(data-placeholder); color:rgba(255,255,255,0.2);
          font-style:italic; pointer-events:none; float:left; height:0;
        }

        /* Typography */
        .tt-editor-body h1 { font-size:2em;   color:#fff;    font-weight:800; margin:.6em 0 .3em; }
        .tt-editor-body h2 { font-size:1.6em; color:#fff;    font-weight:700; margin:.6em 0 .3em; }
        .tt-editor-body h3 { font-size:1.3em; color:#f1f5f9; font-weight:600; margin:.5em 0 .25em; }
        .tt-editor-body h4,.tt-editor-body h5,.tt-editor-body h6 { color:#e2e8f0; font-weight:600; margin:.4em 0 .2em; }
        .tt-editor-body p  { margin:.5em 0; }
        .tt-editor-body a  { color:#F59E0B; text-decoration:underline; }
        .tt-editor-body hr { border:none; border-top:1px solid rgba(255,255,255,0.1); margin:1.5em 0; }

        /* Lists */
        .tt-editor-body ul { list-style:disc;    padding-left:1.5em; margin:.5em 0; }
        .tt-editor-body ol { list-style:decimal; padding-left:1.5em; margin:.5em 0; }
        .tt-editor-body li { margin:.3em 0; }
        .tt-editor-body ol ol     { list-style-type:lower-alpha; }
        .tt-editor-body ol ol ol  { list-style-type:lower-roman; }

        /* Blockquote */
        .tt-editor-body blockquote { border-left:4px solid #B45309; margin:1em 0; padding:.6em 1em; background:rgba(180,83,9,0.06); border-radius:0 8px 8px 0; color:rgba(255,255,255,0.6); font-style:italic; }

        /* Code */
        .tt-editor-body code { background:rgba(255,255,255,0.08); border-radius:4px; padding:1px 6px; font-size:.9em; color:#7dd3fc; }
        .tt-editor-body pre  { margin:1em 0; border-radius:10px; overflow:hidden; border:1px solid rgba(255,255,255,0.08); }
        .tt-editor-body pre code { background:transparent; padding:0; color:inherit; font-size:.875rem; }

        /* Tables — TipTap renders proper <table> elements */
        .tt-editor-body table { border-collapse:collapse; width:100%; margin:1em 0; table-layout:fixed; }
        .tt-editor-body th,.tt-editor-body td { border:1px solid rgba(255,255,255,0.15); padding:8px 12px; vertical-align:top; position:relative; min-width:40px; }
        .tt-editor-body th { background:rgba(180,83,9,0.15); color:#F59E0B; font-weight:700; text-align:left; }
        .tt-editor-body td { color:rgba(255,255,255,0.8); }
        .tt-editor-body tr:hover td { background:rgba(255,255,255,0.02); }
        .tt-editor-body .selectedCell::after { content:""; position:absolute; inset:0; background:rgba(180,83,9,0.12); pointer-events:none; z-index:1; }
        .tt-editor-body .column-resize-handle { position:absolute; right:-2px; top:0; bottom:0; width:4px; background:rgba(180,83,9,0.5); cursor:col-resize; z-index:2; }
        .tt-editor-body .tableWrapper { overflow-x:auto; }

        /* Images */
        .tt-editor-body img { max-width:100%; border-radius:10px; margin:.5em auto; display:block; box-shadow:0 4px 20px rgba(0,0,0,0.4); }
        .tt-editor-body img.ProseMirror-selectednode { outline:2px solid #F59E0B; }

        /* Math */
        .tt-editor-body .math-inline { display:inline-block; padding:2px 6px; border-radius:6px; background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.2); }
        .tt-editor-body .math-block  { display:block; padding:12px 16px; border-radius:10px; background:rgba(99,102,241,0.07); border:1px solid rgba(99,102,241,0.15); margin:1em 0; text-align:center; overflow-x:auto; }
        .tt-editor-body .katex { color:#fff; }
        .tt-editor-body .katex-display { margin:0; }

        /* Chart embeds */
        .tt-editor-body .chart-embed { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:16px; margin:1em 0; }
        .tt-editor-body .chart-embed canvas { max-height:320px; }

        /* Selection */
        .tt-editor-body ::selection { background:rgba(180,83,9,0.3); }

        /* Scrollbar */
        .tt-editor-body::-webkit-scrollbar       { width:6px; }
        .tt-editor-body::-webkit-scrollbar-track  { background:transparent; }
        .tt-editor-body::-webkit-scrollbar-thumb  { background:rgba(255,255,255,0.1); border-radius:4px; }
        .tt-editor-body::-webkit-scrollbar-thumb:hover { background:rgba(255,255,255,0.2); }

        /* Bubble menu */
        .tt-bubble { display:flex; gap:2px; align-items:center; background:rgba(10,18,30,0.97); border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:4px 6px; box-shadow:0 8px 32px rgba(0,0,0,0.6); backdrop-filter:blur(12px); }
      `}</style>

      <div style={{ width:"100%" }}>
        {tableActive && <TableControls editor={editor} />}

        <div className="tt-shell">
          <Toolbar editor={editor} onModal={setModal} />

          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  );
}