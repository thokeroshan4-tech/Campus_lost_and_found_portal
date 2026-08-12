import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail, Lock, CheckCircle2, Clock, ShieldCheck,
  ArrowRight, ArrowLeft, CreditCard, Search, Eye, EyeOff, User, Briefcase, Hash
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";

const DESIGNATIONS = [
  { value: "student", label: "Student" },
  { value: "staff", label: "Staff" },
  { value: "worker", label: "Worker" },
  { value: "faculty", label: "Faculty" },
];

const STEPS = [
  { n: 1, label: "Your details" },
  { n: 2, label: "Confirm email" },
  { n: 3, label: "Upload ID card" },
  { n: 4, label: "Admin review" },
];

export default function Auth() {
  const navigate = useNavigate();
  const { login, submitForReview } = useAuth();
  const [mode, setMode] = useState("signup"); // 'login' | 'signup'
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");
  const [campusId, setCampusId] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [idFile, setIdFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const step1Valid = name.trim().length >= 2 && emailValid && password.length >= 6 && designation && campusId.trim();

  const handleFile = (f) => {
    if (f && f.type.startsWith("image/")) setIdFile(f);
  };

  const resetToLogin = () => {
    setMode("login");
    setStep(1);
  };

  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .lf-root { font-family: 'Inter', sans-serif; color: var(--ink); }
        .lf-display { font-family: 'Fraunces', serif; }
        .lf-mono { font-family: 'IBM Plex Mono', monospace; }
        .lf-input {
          width: 100%; padding: 12px 14px 12px 42px; border-radius: 10px;
          border: 1.5px solid var(--line); background: #fff; font-size: 14.5px;
          outline: none; transition: border-color .15s, box-shadow .15s;
          font-family: 'Inter', sans-serif; color: var(--ink);
        }
        .lf-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(31,111,107,0.15); }
        .lf-btn-primary {
          background: var(--teal); color: #fff; border: none; border-radius: 10px;
          padding: 12px 20px; font-weight: 600; font-size: 14.5px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background .15s, transform .1s; width: 100%;
        }
        .lf-btn-primary:hover:not(:disabled) { background: var(--teal-deep); }
        .lf-btn-primary:active:not(:disabled) { transform: scale(0.98); }
        .lf-btn-primary:disabled { background: #B9C4C3; cursor: not-allowed; }
        .lf-btn-ghost {
          background: transparent; color: var(--ink); border: 1.5px solid var(--line);
          border-radius: 10px; padding: 12px 20px; font-weight: 600; font-size: 14.5px;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; transition: border-color .15s, background .15s;
        }
        .lf-btn-ghost:hover { border-color: var(--ink); background: #F3F4F1; }
        .lf-tab {
          flex: 1; text-align: center; padding: 10px 0; font-weight: 600; font-size: 14px;
          cursor: pointer; border-bottom: 2.5px solid transparent; color: #8A8F8E; transition: all .15s;
        }
        .lf-tab.active { color: var(--ink); border-bottom-color: var(--teal); }
        .lf-step-dot {
          width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center;
          justify-content: center; font-family: 'Fraunces', serif; font-size: 13px; font-weight: 600;
          border: 1.5px solid rgba(255,255,255,0.25); flex-shrink: 0; transition: all .2s;
        }
        .lf-drop {
          border: 1.5px dashed var(--line); border-radius: 12px; padding: 28px 16px;
          text-align: center; cursor: pointer; transition: border-color .15s, background .15s;
        }
        .lf-drop.drag { border-color: var(--teal); background: #EEF5F4; }
        .seal {
          animation: sealIn .5s cubic-bezier(.2,1.4,.4,1) both;
        }
        @keyframes sealIn {
          0% { transform: scale(0.4) rotate(-18deg); opacity: 0; }
          100% { transform: scale(1) rotate(-8deg); opacity: 1; }
        }
        @media (max-width: 860px) {
          .lf-left { display: none !important; }
        }
      `}</style>

      <div className="lf-root" style={styles.shell}>
        {/* LEFT — brand / process panel */}
        <div className="lf-left" style={styles.left}>
          <div>
            <div style={styles.logoRow}>
              <div style={styles.logoMark}>
                <ShieldCheck size={18} color="#fff" strokeWidth={2.25} />
              </div>
              <span className="lf-display" style={styles.logoText}>Campus Lost &amp; Found</span>
            </div>

            <h1 className="lf-display" style={styles.headline}>
              Every item finds<br />its way back.
            </h1>
            <p style={styles.subhead}>
              One account, verified once, for the whole college. No noticeboards.
              No guessing who's real.
            </p>
          </div>

          <div style={styles.stepsWrap}>
            {STEPS.map((s, i) => (
              <div key={s.n} style={styles.stepRow}>
                <div
                  className="lf-step-dot"
                  style={{
                    background: mode === "signup" && step >= s.n ? "#fff" : "transparent",
                    color: mode === "signup" && step >= s.n ? "var(--ink)" : "rgba(255,255,255,0.65)",
                    borderColor: mode === "signup" && step >= s.n ? "#fff" : "rgba(255,255,255,0.25)",
                  }}
                >
                  {mode === "signup" && step > s.n ? <CheckCircle2 size={16} /> : s.n}
                </div>
                <div>
                  <div style={{
                    fontSize: 13.5, fontWeight: 600,
                    color: mode === "signup" && step >= s.n ? "#fff" : "rgba(255,255,255,0.55)",
                  }}>
                    {s.label}
                  </div>
                </div>
                {i < STEPS.length - 1 && <div style={styles.stepLine} />}
              </div>
            ))}
          </div>

          <p style={styles.leftFoot}>
            Your ID photo is only ever seen by campus admins — never shown to other users.
          </p>
        </div>

        {/* RIGHT — form panel */}
        <div style={styles.right}>
          <div style={styles.card}>

            <div style={styles.tabRow}>
              <div
                className={`lf-tab ${mode === "login" ? "active" : ""}`}
                onClick={() => setMode("login")}
              >
                Log in
              </div>
              <div
                className={`lf-tab ${mode === "signup" ? "active" : ""}`}
                onClick={() => { setMode("signup"); setStep(1); }}
              >
                Sign up
              </div>
            </div>

            {mode === "login" && (
              <div style={{ marginTop: 26 }}>
                <h2 className="lf-display" style={styles.cardTitle}>Welcome back</h2>
                <p style={styles.cardSub}>Log in with your college email.</p>

                <div style={{ marginTop: 20 }}>
                  <Field icon={Mail}>
                    <input
                      className="lf-input"
                      placeholder="you@college.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Field>
                  <div style={{ height: 12 }} />
                  <Field icon={Lock} trailing={
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      style={styles.eyeBtn}
                      aria-label="Toggle password visibility"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }>
                    <input
                      className="lf-input"
                      type={showPw ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ paddingRight: 40 }}
                    />
                  </Field>

                  <button style={{ ...styles.linkBtn, marginTop: 10 }}>Forgot password?</button>

                  <button
                    className="lf-btn-primary"
                    style={{ marginTop: 18 }}
                    disabled={!emailValid || password.length < 1}
                    onClick={() => { login(email); navigate("/browse"); }}
                  >
                    Log in <ArrowRight size={16} />
                  </button>

                  <p style={styles.switchLine}>
                    New here?{" "}
                    <button style={styles.linkBtn} onClick={() => { setMode("signup"); setStep(1); }}>
                      Create an account
                    </button>
                  </p>
                </div>
              </div>
            )}

            {mode === "signup" && step === 1 && (
              <div style={{ marginTop: 26 }}>
                <h2 className="lf-display" style={styles.cardTitle}>Create your account</h2>
                <p style={styles.cardSub}>Any email you have access to works — your identity is verified via ID card, not your email domain.</p>

                <div style={{ marginTop: 20 }}>
                  <Field icon={User}>
                    <input
                      className="lf-input"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Field>
                  <div style={{ height: 12 }} />
                  <Field icon={Mail}>
                    <input
                      className="lf-input"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Field>
                  <div style={{ height: 12 }} />
                  <Field icon={Lock} trailing={
                    <button type="button" onClick={() => setShowPw(!showPw)} style={styles.eyeBtn} aria-label="Toggle password visibility">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }>
                    <input
                      className="lf-input"
                      type={showPw ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ paddingRight: 40 }}
                    />
                  </Field>
                  <div style={{ height: 12 }} />
                  <Field icon={Briefcase}>
                    <select
                      className="lf-input"
                      style={{ paddingLeft: 42, appearance: "none", background: "#fff" }}
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                    >
                      <option value="" disabled>I am a...</option>
                      {DESIGNATIONS.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </Field>
                  <div style={{ height: 12 }} />
                  <Field icon={Hash}>
                    <input
                      className="lf-input"
                      placeholder="Campus ID (roll no. / staff ID)"
                      value={campusId}
                      onChange={(e) => setCampusId(e.target.value)}
                    />
                  </Field>

                  <button
                    className="lf-btn-primary"
                    style={{ marginTop: 18 }}
                    disabled={!step1Valid}
                    onClick={() => setStep(2)}
                  >
                    Continue <ArrowRight size={16} />
                  </button>

                  <p style={styles.switchLine}>
                    Already verified?{" "}
                    <button style={styles.linkBtn} onClick={resetToLogin}>Log in</button>
                  </p>
                </div>
              </div>
            )}

            {mode === "signup" && step === 2 && (
              <div style={{ marginTop: 26 }}>
                <div style={styles.iconCircle}><Mail size={22} color="var(--teal)" /></div>
                <h2 className="lf-display" style={{ ...styles.cardTitle, marginTop: 16 }}>Check your inbox</h2>
                <p style={styles.cardSub}>
                  We sent a confirmation link to <strong style={{ color: "var(--ink)" }}>{email || "your college email"}</strong>.
                  Click it to continue.
                </p>

                <button className="lf-btn-primary" style={{ marginTop: 22 }} onClick={() => setStep(3)}>
                  I've confirmed my email <ArrowRight size={16} />
                </button>
                <button className="lf-btn-ghost" style={{ marginTop: 10 }}>
                  Resend email
                </button>
                <button style={{ ...styles.linkBtn, marginTop: 14 }} onClick={() => setStep(1)}>
                  <ArrowLeft size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
                  Back
                </button>
              </div>
            )}

            {mode === "signup" && step === 3 && (
              <div style={{ marginTop: 26 }}>
                <h2 className="lf-display" style={styles.cardTitle}>Upload your ID card</h2>
                <p style={styles.cardSub}>A clear photo of your college ID. An admin checks this manually before you can use the site.</p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files[0])}
                />

                <div
                  className={`lf-drop ${dragOver ? "drag" : ""}`}
                  style={{ marginTop: 20 }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                >
                  {!idFile ? (
                    <>
                      <div style={styles.idCardOutline}>
                        <CreditCard size={26} color="var(--teal)" strokeWidth={1.6} />
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 14, marginTop: 12 }}>
                        Drag your ID photo here, or click to browse
                      </div>
                      <div style={{ fontSize: 12.5, color: "#8A8F8E", marginTop: 4 }}>
                        JPG or PNG, under 8MB
                      </div>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={26} color="var(--teal)" style={{ margin: "0 auto" }} />
                      <div style={{ fontWeight: 600, fontSize: 14, marginTop: 10 }}>{idFile.name}</div>
                      <div style={{ fontSize: 12.5, color: "#8A8F8E", marginTop: 2 }}>
                        Tap to replace
                      </div>
                    </>
                  )}
                </div>

                <button
                  className="lf-btn-primary"
                  style={{ marginTop: 18 }}
                  disabled={!idFile}
                  onClick={() => {
                    submitForReview({ name, email, designation, campusId });
                    setStep(4);
                  }}
                >
                  Submit for review <ArrowRight size={16} />
                </button>
                <button style={{ ...styles.linkBtn, marginTop: 14 }} onClick={() => setStep(2)}>
                  <ArrowLeft size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
                  Back
                </button>
              </div>
            )}

            {mode === "signup" && step === 4 && (
              <div style={{ marginTop: 10, textAlign: "center" }}>
                <div className="seal" style={styles.sealCircle}>
                  <Clock size={28} color="#fff" strokeWidth={2} />
                </div>
                <h2 className="lf-display" style={{ ...styles.cardTitle, marginTop: 18, textAlign: "center" }}>
                  Waiting for approval
                </h2>
                <p style={{ ...styles.cardSub, textAlign: "center" }}>
                  An admin is checking your ID card photo. This is usually quick — you'll
                  get an email the moment you're approved.
                </p>

                <div style={styles.refBox}>
                  <span style={{ fontSize: 12, color: "#8A8F8E" }}>Application reference</span>
                  <span className="lf-mono" style={{ fontSize: 13.5, color: "var(--ink)" }}>
                    LF-{Math.floor(100000 + Math.random() * 900000)}
                  </span>
                </div>

                <button className="lf-btn-ghost" style={{ marginTop: 20 }} onClick={resetToLogin}>
                  <Search size={15} /> Back to log in
                </button>
              </div>
            )}
          </div>

          <p style={styles.microcopy}>
            By continuing you agree this account is for genuine campus use only.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, children, trailing }) {
  return (
    <div style={{ position: "relative" }}>
      <Icon size={16} color="#8A8F8E" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
      {children}
      {trailing}
    </div>
  );
}

const styles = {
  app: {
    "--ink": "#1B2430",
    "--paper": "#F3F4F1",
    "--teal": "#1F6F6B",
    "--teal-deep": "#164F4C",
    "--line": "#DEDFDA",
    minHeight: "100vh",
    background: "var(--paper)",
  },
  shell: {
    display: "flex",
    minHeight: "100vh",
  },
  left: {
    width: "42%",
    minWidth: 360,
    background: "linear-gradient(160deg, #1B2430 0%, #223245 100%)",
    padding: "56px 48px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
  },
  logoRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 60 },
  logoMark: {
    width: 32, height: 32, borderRadius: "50%", background: "var(--teal)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  logoText: { color: "#fff", fontSize: 16, fontWeight: 500, letterSpacing: 0.2 },
  headline: {
    color: "#fff", fontSize: 38, lineHeight: 1.15, fontWeight: 500, letterSpacing: -0.5,
    margin: "0 0 18px 0",
  },
  subhead: { color: "rgba(255,255,255,0.68)", fontSize: 15, lineHeight: 1.6, maxWidth: 340, margin: 0 },
  stepsWrap: { display: "flex", flexDirection: "column" },
  stepRow: { display: "flex", alignItems: "flex-start", gap: 14, position: "relative", paddingBottom: 30 },
  stepLine: {
    position: "absolute", left: 14.5, top: 32, width: 1, height: 26, background: "rgba(255,255,255,0.22)",
  },
  leftFoot: { color: "rgba(255,255,255,0.45)", fontSize: 12.5, lineHeight: 1.6, maxWidth: 320, margin: 0 },
  right: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    padding: "40px 24px",
  },
  card: {
    width: "100%", maxWidth: 380, background: "#fff", borderRadius: 18, padding: "28px 30px 32px",
    border: "1px solid var(--line)", boxShadow: "0 1px 2px rgba(27,36,48,0.04), 0 12px 32px rgba(27,36,48,0.06)",
  },
  tabRow: { display: "flex", borderBottom: "1.5px solid var(--line)" },
  cardTitle: { fontSize: 22, fontWeight: 500, margin: 0, letterSpacing: -0.3 },
  cardSub: { fontSize: 13.5, color: "#767B7A", lineHeight: 1.55, marginTop: 6 },
  eyeBtn: {
    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", cursor: "pointer", color: "#8A8F8E", padding: 4,
  },
  linkBtn: {
    background: "none", border: "none", color: "var(--teal)", fontWeight: 600, fontSize: 13.5,
    cursor: "pointer", padding: 0,
  },
  switchLine: { fontSize: 13.5, color: "#767B7A", textAlign: "center", marginTop: 18 },
  iconCircle: {
    width: 48, height: 48, borderRadius: "50%", background: "#EEF5F4",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  idCardOutline: {
    width: 52, height: 52, borderRadius: 10, border: "1.5px solid var(--line)", background: "#F8F9F7",
    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto",
  },
  sealCircle: {
    width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(160deg, #D8A03D, #C08A2C)",
    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto",
    boxShadow: "0 6px 16px rgba(216,160,61,0.35)",
  },
  refBox: {
    marginTop: 18, background: "#F8F9F7", border: "1px solid var(--line)", borderRadius: 10,
    padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  microcopy: { fontSize: 12, color: "#9A9E9C", marginTop: 18, textAlign: "center" },
};
