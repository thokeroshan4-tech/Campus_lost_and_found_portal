import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PackagePlus, Image as ImageIcon, MapPin, Tag, FileText, CheckCircle2, ArrowRight, CalendarDays,
} from "lucide-react";
import { CATEGORIES } from "../data/mockItems";

export default function Report() {
  const navigate = useNavigate();
  const [type, setType] = useState("lost"); // lost | found
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef(null);

  const canSubmit = title.trim() && category && location.trim() && date;

  const handleFile = (f) => {
    if (f && f.type.startsWith("image/")) setPhoto(f);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    // Real submit will POST to /api/items here.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-5 py-24 text-center">
        <div className="w-14 h-14 rounded-full bg-teal-tint flex items-center justify-center mx-auto">
          <CheckCircle2 size={26} className="text-teal" />
        </div>
        <h1 className="font-display text-2xl mt-5">Report submitted</h1>
        <p className="text-muted text-[14.5px] mt-2 leading-relaxed">
          Your {type} item is now live on the Browse page. You'll be notified the moment
          someone submits a matching claim.
        </p>
        <div className="flex items-center justify-center gap-3 mt-7">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2.5 rounded-xl bg-ink text-white text-sm font-semibold hover:bg-ink/90 transition"
          >
            Go to my dashboard
          </button>
          <button
            onClick={() => navigate("/browse")}
            className="px-5 py-2.5 rounded-xl border border-line text-sm font-semibold hover:border-ink/30 transition"
          >
            Browse items
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-medium tracking-tight">Report an item</h1>
        <p className="text-muted text-[14.5px] mt-1.5">
          Takes under a minute. The more specific, the faster it gets matched.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-line rounded-2xl p-6 sm:p-8">
        {/* Lost / Found toggle */}
        <div className="flex bg-paper border border-line rounded-xl p-1 mb-7">
          <button
            type="button"
            onClick={() => setType("lost")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              type === "lost" ? "bg-rust text-white" : "text-muted hover:text-ink"
            }`}
          >
            I lost something
          </button>
          <button
            type="button"
            onClick={() => setType("found")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              type === "found" ? "bg-teal text-white" : "text-muted hover:text-ink"
            }`}
          >
            I found something
          </button>
        </div>

        {/* Photo upload */}
        <label className="block text-[13px] font-semibold text-ink mb-2">Photo</label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors mb-6 ${
            dragOver ? "border-teal bg-teal-tint" : "border-line hover:border-ink/30"
          }`}
        >
          {photo ? (
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-ink">
              <CheckCircle2 size={16} className="text-teal" /> {photo.name}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon size={22} className="text-faint" />
              <span className="text-[13.5px] text-muted">
                <span className="text-teal font-semibold">Click to upload</span> or drag a photo here
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <FormField icon={Tag} label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={type === "lost" ? "e.g. Black Dell laptop charger" : "e.g. Blue Wildcraft backpack"}
            className="lf-input"
          />
        </FormField>

        {/* Category */}
        <FormField icon={PackagePlus} label="Category">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="lf-input appearance-none bg-white"
          >
            <option value="" disabled>Select a category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </FormField>

        {/* Location */}
        <FormField icon={MapPin} label={type === "lost" ? "Last seen where?" : "Found where?"}>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Library, 2nd floor"
            className="lf-input"
          />
        </FormField>

        {/* Date */}
        <FormField icon={CalendarDays} label={type === "lost" ? "When did you lose it?" : "When did you find it?"}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="lf-input"
          />
        </FormField>

        {/* Description */}
        <div className="mb-1">
          <label className="flex items-center gap-1.5 text-[13px] font-semibold text-ink mb-2">
            <FileText size={14} className="text-faint" /> Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Any details that would help someone recognize it — marks, stickers, contents..."
            className="lf-input resize-none"
          />
          <p className="text-[12px] text-faint mt-1.5">
            Specific details (a sticker, a scratch, what's inside) are what let claims get verified later.
          </p>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full mt-6 py-3 rounded-xl bg-teal text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:bg-line disabled:text-faint hover:bg-teal-deep transition-colors"
        >
          Submit report <ArrowRight size={16} />
        </button>
      </form>

      <style>{`
        .lf-input {
          width: 100%;
          padding: 11px 14px;
          border-radius: 10px;
          border: 1.5px solid var(--color-line);
          font-size: 14.5px;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
          font-family: var(--font-body);
          color: var(--color-ink);
        }
        .lf-input:focus {
          border-color: var(--color-teal);
          box-shadow: 0 0 0 3px rgba(31,111,107,0.15);
        }
      `}</style>
    </div>
  );
}

function FormField({ icon: Icon, label, children }) {
  return (
    <div className="mb-5">
      <label className="flex items-center gap-1.5 text-[13px] font-semibold text-ink mb-2">
        <Icon size={14} className="text-faint" /> {label}
      </label>
      {children}
    </div>
  );
}
