import { useCallback, useMemo, useRef } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const FONTS = [
  { key: "inter",         label: "Inter"            },
  { key: "roboto",        label: "Roboto"           },
  { key: "opensans",      label: "Open Sans"        },
  { key: "lato",          label: "Lato"             },
  { key: "montserrat",    label: "Montserrat"       },
  { key: "poppins",       label: "Poppins"          },
  { key: "raleway",       label: "Raleway"          },
  { key: "nunito",        label: "Nunito"           },
  { key: "playfair",      label: "Playfair Display" },
  { key: "merriweather",  label: "Merriweather"     },
  { key: "lora",          label: "Lora"             },
  { key: "georgia",       label: "Georgia"          },
  { key: "sourcecodepro", label: "Source Code Pro"  },
  { key: "inconsolata",   label: "Inconsolata"      },
  { key: "jetbrainsmono", label: "JetBrains Mono"   },
];

// Register font whitelist with Quill's Parchment (must happen before any
// ReactQuill renders — module level guarantees that)
const Font = Quill.import("formats/font");
Font.whitelist = FONTS.map((f) => f.key);
Quill.register(Font, true);

// Inject Google Fonts <link> into <head> once
if (typeof document !== "undefined" && !document.getElementById("quill-google-fonts")) {
  const families = [
    "Inter", "Roboto", "Open+Sans", "Lato", "Montserrat", "Poppins",
    "Raleway", "Nunito", "Playfair+Display", "Merriweather", "Lora",
    "Source+Code+Pro", "Inconsolata", "JetBrains+Mono",
  ].map((f) => `family=${f}:wght@400;600;700`).join("&");
  const link  = document.createElement("link");
  link.id     = "quill-google-fonts";
  link.rel    = "stylesheet";
  link.href   = `https://fonts.googleapis.com/css2?${families}&display=swap`;
  document.head.appendChild(link);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BLOCK B — replace your existing RichEditor function with this
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function RichEditor({ value, onChange }) {
  const quillRef = useRef(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;
      // TODO: const { url } = await uploadImage(file);  ← replace base64 with URL
      const reader = new FileReader();
      reader.onload = () => {
        const editor = quillRef.current?.getEditor();
        const range  = editor?.getSelection(true);
        if (range) editor.insertEmbed(range.index, "image", reader.result);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ font: FONTS.map((f) => f.key) }, { header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike", "blockquote", "code"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" },
         { indent: "-1" }, { indent: "+1" }],
        [{ align: [] }, { direction: "rtl" }],
        [{ script: "sub" }, { script: "super" }],
        ["link", "image", "video", "formula"],
        ["code-block"],
        ["clean"],
      ],
      handlers: { image: imageHandler },
    },
    clipboard: { matchVisual: false },
    history: { delay: 1000, maxStack: 100 },
  }), [imageHandler]);

  const formats = [
    "font", "header",
    "bold", "italic", "underline", "strike", "blockquote", "code",
    "color", "background",
    "list", "bullet", "check", "indent",
    "align", "direction",
    "script",
    "link", "image", "video", "formula",
    "code-block",
  ];

  return (
    <>
      <style>{`
        /* ── Toolbar ─────────────────────────────────────────────────────── */
        .ql-full .ql-toolbar {
          background: rgba(15,23,42,0.95);
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-bottom: 1px solid rgba(255,255,255,0.06) !important;
          border-radius: 16px 16px 0 0;
          padding: 8px 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          position: sticky;
          top: 0;
          z-index: 10;
          backdrop-filter: blur(12px);
        }
        .ql-full .ql-toolbar .ql-formats {
          margin-right: 8px;
          padding-right: 8px;
          border-right: 1px solid rgba(255,255,255,0.08);
        }
        .ql-full .ql-toolbar .ql-formats:last-child { border-right: none; }

        /* ── Container ───────────────────────────────────────────────────── */
        .ql-full .ql-container {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-top: none !important;
          border-radius: 0 0 16px 16px;
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 16px;
          line-height: 1.8;
          color: rgba(255,255,255,0.88);
        }
        .ql-full .ql-editor {
          min-height: 480px;
          padding: 28px 36px;
        }
        @media (max-width: 768px) {
          .ql-full .ql-editor { min-height: 300px; padding: 18px 20px; }
        }
        .ql-full .ql-editor.ql-blank::before {
          color: rgba(255,255,255,0.2);
          font-style: italic;
          font-family: 'Georgia', serif;
        }

        /* ── Toolbar icons ───────────────────────────────────────────────── */
        .ql-full .ql-toolbar .ql-stroke { stroke: rgba(255,255,255,0.5); transition: stroke .15s; }
        .ql-full .ql-toolbar .ql-fill   { fill:   rgba(255,255,255,0.5); transition: fill .15s; }
        .ql-full .ql-toolbar .ql-picker-label { color: rgba(255,255,255,0.5); }
        .ql-full .ql-toolbar button { border-radius: 6px; padding: 3px 5px; transition: background .15s; }
        .ql-full .ql-toolbar button:hover { background: rgba(180,83,9,0.15); }
        .ql-full .ql-toolbar button:hover .ql-stroke,
        .ql-full .ql-toolbar button.ql-active .ql-stroke { stroke: #F59E0B; }
        .ql-full .ql-toolbar button:hover .ql-fill,
        .ql-full .ql-toolbar button.ql-active .ql-fill   { fill: #F59E0B; }
        .ql-full .ql-toolbar button.ql-active { background: rgba(180,83,9,0.2); }

        /* ── Picker dropdowns ────────────────────────────────────────────── */
        .ql-full .ql-toolbar .ql-picker-options {
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6);
          color: rgba(255,255,255,0.7);
        }
        .ql-full .ql-toolbar .ql-picker-item:hover { color: #F59E0B; background: rgba(180,83,9,0.1); }
        .ql-full .ql-toolbar .ql-picker-label:hover,
        .ql-full .ql-toolbar .ql-picker.ql-expanded .ql-picker-label { color: #F59E0B; }

        /* ── Focus ring ──────────────────────────────────────────────────── */
        .ql-full:focus-within .ql-toolbar,
        .ql-full:focus-within .ql-container { border-color: rgba(180,83,9,0.55) !important; }

        /* ── Font picker — each option renders in its own typeface ───────── */
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="inter"]::before        { font-family: 'Inter', sans-serif;          content: "Inter"; }
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="roboto"]::before       { font-family: 'Roboto', sans-serif;         content: "Roboto"; }
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="opensans"]::before     { font-family: 'Open Sans', sans-serif;      content: "Open Sans"; }
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="lato"]::before         { font-family: 'Lato', sans-serif;           content: "Lato"; }
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="montserrat"]::before   { font-family: 'Montserrat', sans-serif;     content: "Montserrat"; }
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="poppins"]::before      { font-family: 'Poppins', sans-serif;        content: "Poppins"; }
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="raleway"]::before      { font-family: 'Raleway', sans-serif;        content: "Raleway"; }
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="nunito"]::before       { font-family: 'Nunito', sans-serif;         content: "Nunito"; }
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="playfair"]::before     { font-family: 'Playfair Display', serif;    content: "Playfair Display"; }
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="merriweather"]::before { font-family: 'Merriweather', serif;        content: "Merriweather"; }
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="lora"]::before         { font-family: 'Lora', serif;               content: "Lora"; }
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="georgia"]::before      { font-family: Georgia, serif;              content: "Georgia"; }
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="sourcecodepro"]::before  { font-family: 'Source Code Pro', monospace; content: "Source Code Pro"; }
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="inconsolata"]::before    { font-family: 'Inconsolata', monospace;     content: "Inconsolata"; }
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="jetbrainsmono"]::before  { font-family: 'JetBrains Mono', monospace;  content: "JetBrains Mono"; }

        /* ── .ql-font-* applied to content spans inside the editor ──────── */
        .ql-font-inter         { font-family: 'Inter', sans-serif; }
        .ql-font-roboto        { font-family: 'Roboto', sans-serif; }
        .ql-font-opensans      { font-family: 'Open Sans', sans-serif; }
        .ql-font-lato          { font-family: 'Lato', sans-serif; }
        .ql-font-montserrat    { font-family: 'Montserrat', sans-serif; }
        .ql-font-poppins       { font-family: 'Poppins', sans-serif; }
        .ql-font-raleway       { font-family: 'Raleway', sans-serif; }
        .ql-font-nunito        { font-family: 'Nunito', sans-serif; }
        .ql-font-playfair      { font-family: 'Playfair Display', serif; }
        .ql-font-merriweather  { font-family: 'Merriweather', serif; }
        .ql-font-lora          { font-family: 'Lora', serif; }
        .ql-font-georgia       { font-family: Georgia, serif; }
        .ql-font-sourcecodepro { font-family: 'Source Code Pro', monospace; }
        .ql-font-inconsolata   { font-family: 'Inconsolata', monospace; }
        .ql-font-jetbrainsmono { font-family: 'JetBrains Mono', monospace; }

        /* ── Content typography ──────────────────────────────────────────── */
        .ql-full .ql-editor h1 { font-size: 2em;   color: #fff;     font-weight: 800; margin: .6em 0 .3em; }
        .ql-full .ql-editor h2 { font-size: 1.6em; color: #fff;     font-weight: 700; margin: .6em 0 .3em; }
        .ql-full .ql-editor h3 { font-size: 1.3em; color: #f1f5f9; font-weight: 600; margin: .5em 0 .25em; }
        .ql-full .ql-editor h4,
        .ql-full .ql-editor h5,
        .ql-full .ql-editor h6 { color: #e2e8f0; font-weight: 600; margin: .4em 0 .2em; }
        .ql-full .ql-editor p  { margin: .5em 0; }
        .ql-full .ql-editor a  { color: #F59E0B; text-decoration: underline; }
        .ql-full .ql-editor blockquote {
          border-left: 4px solid #B45309;
          margin: 1em 0; padding: .6em 1em;
          background: rgba(180,83,9,0.06);
          border-radius: 0 8px 8px 0;
          color: rgba(255,255,255,0.6);
          font-style: italic;
        }
        .ql-full .ql-editor pre.ql-syntax {
          background: rgba(0,0,0,0.45);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: #34D399;
          font-size: 13px;
          padding: 16px 20px;
          overflow-x: auto;
        }
        .ql-full .ql-editor code {
          background: rgba(255,255,255,0.08);
          border-radius: 4px;
          padding: 1px 6px;
          font-size: .9em;
          color: #7dd3fc;
        }
        .ql-full .ql-editor ol,
        .ql-full .ql-editor ul { padding-left: 1.5em; }
        .ql-full .ql-editor li { margin: .25em 0; }
        .ql-full .ql-editor img {
          max-width: 100%;
          border-radius: 10px;
          margin: .5em auto;
          display: block;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }
        .ql-full .ql-editor table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        .ql-full .ql-editor td,
        .ql-full .ql-editor th  { border: 1px solid rgba(255,255,255,0.12); padding: 8px 12px; }
        .ql-full .ql-editor th  { background: rgba(255,255,255,0.06); font-weight: 700; }

        /* ── Scrollbar ───────────────────────────────────────────────────── */
        .ql-full .ql-editor::-webkit-scrollbar       { width: 6px; }
        .ql-full .ql-editor::-webkit-scrollbar-track { background: transparent; }
        .ql-full .ql-editor::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .ql-full .ql-editor::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>

      {/* Bleed wrapper — breaks out of parent max-w-2xl on lg screens */}
      <div className="w-full">
        <div
          className="ql-full rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 8px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)" }}
        >
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder="Start writing your note… Use the toolbar above for headings, lists, images, code blocks, videos and more."
          />
        </div>
      </div>
    </>
  );
}