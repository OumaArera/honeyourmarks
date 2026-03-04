// ─── FontLoader ───────────────────────────────────────────────────────────────
export const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Layout shell ── */
    .login-root {
      font-family: 'DM Sans', sans-serif;
      min-height: 100vh;
      background: #0B1829;
      display: flex;
      overflow: hidden;
      position: relative;
    }

    /* ── Background orbs ── */
    .bg-canvas { position: fixed; inset: 0; z-index: 0; overflow: hidden; }
    .bg-orb {
      position: absolute; border-radius: 50%;
      filter: blur(80px); opacity: 0.18;
      animation: drift 18s ease-in-out infinite alternate;
    }
    .bg-orb-1 { width:600px;height:600px;background:#1B2F4E;top:-100px;left:-150px;animation-duration:20s; }
    .bg-orb-2 { width:400px;height:400px;background:#E84A0C;bottom:-80px;right:-80px;animation-duration:14s;animation-delay:-5s; }
    .bg-orb-3 { width:300px;height:300px;background:#2E8B2A;top:40%;left:30%;animation-duration:16s;animation-delay:-8s; }
    @keyframes drift {
      0%   { transform: translate(0,0) scale(1); }
      50%  { transform: translate(40px,-30px) scale(1.08); }
      100% { transform: translate(-20px,50px) scale(0.95); }
    }
    .bg-grid {
      position: fixed; inset: 0; z-index: 1; pointer-events: none;
      background-image:
        linear-gradient(rgba(253,248,242,0.025) 1px,transparent 1px),
        linear-gradient(90deg,rgba(253,248,242,0.025) 1px,transparent 1px);
      background-size: 48px 48px;
    }

    /* ── Left panel ── */
    .left-panel {
      display:none; flex:1; position:relative; z-index:2;
      flex-direction:column; justify-content:space-between; padding:52px 56px;
    }
    @media(min-width:900px){ .left-panel{display:flex;} }
    .brand-mark { display:flex;align-items:center;gap:12px;text-decoration:none; }
    .brand-logo  { width:44px;height:44px;object-fit:contain; }
    .brand-name  { font-family:'Playfair Display',serif;font-weight:800;font-size:18px;color:#FDF8F2;letter-spacing:-0.02em; }
    .brand-name em { color:#E84A0C;font-style:normal; }
    .left-quote  { max-width:420px; }
    .left-quote h2 {
      font-family:'Playfair Display',serif;font-weight:800;
      font-size:clamp(32px,3.5vw,48px);line-height:1.12;
      color:#FDF8F2;letter-spacing:-0.025em;margin-bottom:20px;
    }
    .left-quote h2 em { color:#E84A0C;font-style:italic; }
    .left-quote p { font-size:15px;font-weight:300;line-height:1.75;color:rgba(253,248,242,0.55); }
    .left-stats  { display:flex;gap:40px; }
    .stat-item   { display:flex;flex-direction:column;gap:4px; }
    .stat-num    { font-family:'Playfair Display',serif;font-weight:800;font-size:28px;color:#FDF8F2;letter-spacing:-0.03em; }
    .stat-label  { font-size:12px;font-weight:400;color:rgba(253,248,242,0.4);letter-spacing:0.06em;text-transform:uppercase; }

    /* ── Right panel ── */
    .right-panel {
      position:relative;z-index:2;width:100%;max-width:520px;
      margin-left:auto;display:flex;align-items:center;justify-content:center;
      padding:40px 24px;
      background:rgba(8,16,30,0.6);
      backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
      border-left:1px solid rgba(253,248,242,0.06);
      min-height:100vh;
    }
    @media(max-width:899px){ .right-panel{max-width:100%;border-left:none;} }
    .form-shell  { width:100%;max-width:380px; }

    /* ── Mobile brand ── */
    .mobile-brand { display:flex;align-items:center;gap:10px;margin-bottom:32px;text-decoration:none; }
    @media(min-width:900px){ .mobile-brand{display:none;} }
    .mobile-brand-logo { width:36px;height:36px;object-fit:contain; }
    .mobile-brand-name { font-family:'Playfair Display',serif;font-weight:800;font-size:16px;color:#FDF8F2;letter-spacing:-0.015em; }
    .mobile-brand-name em { color:#E84A0C;font-style:normal; }

    /* ── Mode tabs ── */
    .mode-tabs { display:flex;border-bottom:1px solid rgba(253,248,242,0.08);margin-bottom:28px; }
    .mode-tab {
      flex:1;padding:0 0 13px;
      font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;
      color:rgba(253,248,242,0.35);background:transparent;border:none;
      cursor:pointer;letter-spacing:0.03em;position:relative;transition:color 0.2s;
    }
    .mode-tab::after {
      content:'';position:absolute;bottom:-1px;left:0;right:0;
      height:2px;background:#E84A0C;transform:scaleX(0);transition:transform 0.25s ease;
    }
    .mode-tab.active { color:#FDF8F2; }
    .mode-tab.active::after { transform:scaleX(1); }

    /* ── Slide animation ── */
    .slide-enter { animation:slideIn 0.28s cubic-bezier(0.22,1,0.36,1) forwards; }
    @keyframes slideIn {
      from { opacity:0;transform:translateY(10px); }
      to   { opacity:1;transform:translateY(0); }
    }

    /* ── Headings ── */
    .form-heading {
      font-family:'Playfair Display',serif;font-weight:800;font-size:26px;
      color:#FDF8F2;letter-spacing:-0.02em;margin-bottom:5px;line-height:1.2;
    }
    .form-heading em { color:#E84A0C;font-style:italic; }
    .form-subheading { font-size:13.5px;font-weight:300;color:rgba(253,248,242,0.45);margin-bottom:24px;line-height:1.6; }

    /* ── Accent line ── */
    .accent-line { width:32px;height:3px;background:#E84A0C;margin-bottom:14px; }

    /* ── Field primitives ── */
    .field-group  { display:flex;flex-direction:column;gap:14px;margin-bottom:18px; }
    .field-wrap   { position:relative; }
    .field-label  {
      display:block;font-size:11.5px;font-weight:600;
      letter-spacing:0.07em;text-transform:uppercase;
      color:rgba(253,248,242,0.4);margin-bottom:7px;
    }
    .field-input {
      width:100%;padding:12px 16px;
      background:rgba(253,248,242,0.05);
      border:1px solid rgba(253,248,242,0.1);
      color:#FDF8F2;font-family:'DM Sans',sans-serif;
      font-size:14px;font-weight:400;outline:none;border-radius:2px;
      transition:border-color 0.2s,background 0.2s;
    }
    .field-input::placeholder { color:rgba(253,248,242,0.2); }
    .field-input:focus { border-color:rgba(232,74,12,0.6);background:rgba(253,248,242,0.07); }
    .field-input.has-eye { padding-right:44px; }
    .field-row { display:grid;grid-template-columns:1fr 1fr;gap:12px; }

    /* ── Select ── */
    .field-select {
      width:100%;padding:12px 16px;
      background:rgba(253,248,242,0.05);
      border:1px solid rgba(253,248,242,0.1);
      color:#FDF8F2;font-family:'DM Sans',sans-serif;
      font-size:14px;outline:none;border-radius:2px;
      transition:border-color 0.2s;cursor:pointer;
      appearance:none;
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(253,248,242,0.35)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat:no-repeat;background-position:right 14px center;
      padding-right:36px;
    }
    .field-select:focus { border-color:rgba(232,74,12,0.6); }
    .field-select option { background:#0F1E35;color:#FDF8F2; }

    /* ── Eye button ── */
    .eye-btn {
      position:absolute;right:14px;top:50%;transform:translateY(-50%);
      background:none;border:none;cursor:pointer;
      color:rgba(253,248,242,0.3);padding:4px;
      transition:color 0.2s;line-height:1;
    }
    .eye-btn:hover { color:rgba(253,248,242,0.7); }

    /* ── Forgot link ── */
    .forgot-row   { display:flex;justify-content:flex-end;margin-bottom:22px;margin-top:-4px; }
    .forgot-link  {
      font-size:12.5px;font-weight:500;color:rgba(253,248,242,0.4);
      background:none;border:none;cursor:pointer;
      letter-spacing:0.02em;transition:color 0.2s;padding:0;
    }
    .forgot-link:hover { color:#E84A0C; }

    /* ── Submit button ── */
    .btn-submit {
      width:100%;padding:14px;background:#E84A0C;color:#FDF8F2;border:none;
      font-family:'DM Sans',sans-serif;font-size:14.5px;font-weight:600;
      letter-spacing:0.04em;cursor:pointer;position:relative;overflow:hidden;
      transition:background 0.2s,transform 0.1s;border-radius:2px;
    }
    .btn-submit:hover  { background:#c93d08; }
    .btn-submit:active { transform:scale(0.99); }
    .btn-submit:disabled { opacity:0.6;cursor:not-allowed; }
    .btn-shimmer {
      position:absolute;top:0;left:-100%;width:60%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);
      animation:shimmer 2.4s ease-in-out infinite;
    }
    @keyframes shimmer { to{left:160%;} }

    /* ── Ghost button ── */
    .btn-ghost {
      width:100%;padding:13px;background:transparent;color:#FDF8F2;
      border:1.5px solid rgba(253,248,242,0.15);
      font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;
      letter-spacing:0.03em;cursor:pointer;
      transition:border-color 0.2s,background 0.2s;border-radius:2px;
    }
    .btn-ghost:hover { border-color:rgba(253,248,242,0.35);background:rgba(253,248,242,0.04); }

    /* ── Spinner ── */
    .spinner {
      width:16px;height:16px;
      border:2px solid rgba(253,248,242,0.3);border-top-color:#FDF8F2;
      border-radius:50%;animation:spin 0.7s linear infinite;
      display:inline-block;vertical-align:middle;margin-right:8px;
    }
    @keyframes spin { to{transform:rotate(360deg);} }

    /* ── Alert box ── */
    .alert-box    { padding:12px 14px;border-radius:2px;font-size:13px;font-weight:400;margin-bottom:18px;line-height:1.55; }
    .alert-success{ background:rgba(46,139,42,0.12);border:1px solid rgba(46,139,42,0.35);color:#6fcf6b; }
    .alert-error  { background:rgba(232,74,12,0.1);border:1px solid rgba(232,74,12,0.35);color:#f8907a; }

    /* ── Switch row ── */
    .switch-row { text-align:center;font-size:13px;color:rgba(253,248,242,0.35);margin-top:20px; }
    .switch-btn {
      color:#E84A0C;background:none;border:none;cursor:pointer;
      font-size:13px;font-weight:600;padding:0;margin-left:4px;transition:opacity 0.2s;
    }
    .switch-btn:hover { opacity:0.8; }

    /* ── Terms ── */
    .terms-text { font-size:11.5px;color:rgba(253,248,242,0.28);line-height:1.6;margin-top:14px;text-align:center; }
    .terms-text a { color:rgba(253,248,242,0.45);text-decoration:underline;cursor:pointer; }

    /* ── Stepper ── */
    .stepper { display:flex;align-items:center;gap:0;margin-bottom:26px; }
    .step-node {
      display:flex;align-items:center;justify-content:center;
      width:28px;height:28px;border-radius:50%;
      font-size:12px;font-weight:700;letter-spacing:0;
      border:1.5px solid rgba(253,248,242,0.15);
      color:rgba(253,248,242,0.3);background:transparent;
      transition:all 0.3s;flex-shrink:0;
    }
    .step-node.active  { border-color:#E84A0C;color:#E84A0C;background:rgba(232,74,12,0.1); }
    .step-node.done    { border-color:#2E8B2A;background:#2E8B2A;color:#fff; }
    .step-connector    { flex:1;height:1px;background:rgba(253,248,242,0.1); }
    .step-connector.done { background:#2E8B2A; }
    .step-label-row    { display:flex;justify-content:space-between;margin-bottom:22px;margin-top:-18px;padding:0 2px; }
    .step-label        { font-size:10px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:rgba(253,248,242,0.25);width:28px;text-align:center; }
    .step-label.active { color:rgba(253,248,242,0.7); }

    /* ── Role cards ── */
    .role-grid { display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px; }
    .role-card {
      padding:11px 13px;border:1px solid rgba(253,248,242,0.1);
      background:rgba(253,248,242,0.03);cursor:pointer;border-radius:2px;
      transition:all 0.2s;display:flex;align-items:center;gap:9px;
    }
    .role-card.selected { border-color:#E84A0C;background:rgba(232,74,12,0.08); }
    .role-icon  { font-size:17px;line-height:1; }
    .role-name  { font-size:13px;font-weight:600;color:#FDF8F2; }
    .role-desc  { font-size:11px;font-weight:300;color:rgba(253,248,242,0.4);margin-top:1px; }

    /* ── Gender toggle ── */
    .sex-toggle { display:grid;grid-template-columns:1fr 1fr;gap:10px; }
    .sex-card {
      padding:10px 12px;border:1px solid rgba(253,248,242,0.1);
      background:rgba(253,248,242,0.03);cursor:pointer;border-radius:2px;
      text-align:center;transition:all 0.2s;
      font-size:13px;font-weight:600;color:rgba(253,248,242,0.5);
    }
    .sex-card.selected { border-color:#E84A0C;background:rgba(232,74,12,0.08);color:#FDF8F2; }

    /* ── Checkbox ── */
    .checkbox-row { display:flex;align-items:flex-start;gap:11px;margin-top:4px; }
    .checkbox-input { width:17px;height:17px;accent-color:#E84A0C;flex-shrink:0;margin-top:2px;cursor:pointer; }
    .checkbox-label { font-size:12.5px;font-weight:400;color:rgba(253,248,242,0.5);line-height:1.6;cursor:pointer; }
    .checkbox-label strong { color:rgba(253,248,242,0.8); }

    /* ── Credential reveal box ── */
    .cred-box {
      background:rgba(46,139,42,0.08);border:1px solid rgba(46,139,42,0.3);
      border-radius:2px;padding:18px 20px;margin-bottom:20px;
    }
    .cred-box-title { font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6fcf6b;margin-bottom:12px; }
    .cred-row  { display:flex;justify-content:space-between;align-items:center;padding:6px 0; }
    .cred-row + .cred-row { border-top:1px solid rgba(46,139,42,0.15); }
    .cred-key  { font-size:11.5px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;color:rgba(253,248,242,0.4); }
    .cred-val  { font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:#FDF8F2;letter-spacing:0.02em; }
    .cred-note { font-size:11.5px;color:rgba(253,248,242,0.35);margin-top:10px;line-height:1.6; }
  `}</style>
);

// ─── EyeIcon ──────────────────────────────────────────────────────────────────
export const EyeIcon = ({ open }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open
      ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
      : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>}
  </svg>
);

// ─── CheckIcon (for stepper done state) ──────────────────────────────────────
export const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ─── Stepper ─────────────────────────────────────────────────────────────────
export const Stepper = ({ step }) => {
  const steps = ["Parent", "Student", "Done"];
  return (
    <>
      <div className="stepper">
        {steps.map((s, i) => (
          <>
            <div key={s} className={`step-node ${i < step ? "done" : i === step ? "active" : ""}`}>
              {i < step ? <CheckIcon /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div key={`c-${i}`} className={`step-connector ${i < step ? "done" : ""}`} />
            )}
          </>
        ))}
      </div>
      <div className="step-label-row">
        {steps.map((s, i) => (
          <span key={s} className={`step-label ${i === step ? "active" : ""}`}>{s}</span>
        ))}
      </div>
    </>
  );
};

// ─── AlertBox ─────────────────────────────────────────────────────────────────
export const AlertBox = ({ alert }) =>
  alert ? <div className={`alert-box alert-${alert.type}`}>{alert.msg}</div> : null;

// ─── SubmitButton ─────────────────────────────────────────────────────────────
export const SubmitButton = ({ loading, label, disabled }) => (
  <button className="btn-submit" type="submit" disabled={loading || disabled}>
    <span className="btn-shimmer" />
    {loading && <span className="spinner" />}
    {loading ? "Please wait…" : label}
  </button>
);

// export { FontLoader };