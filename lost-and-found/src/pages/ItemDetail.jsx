import { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, PackageSearch, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { mockItems } from "../data/mockItems";
import StatusBadge from "../components/StatusBadge";

export default function ItemDetail() {
  const { id } = useParams();
  const item = mockItems.find((i) => i.id === id);
  const [claiming, setClaiming] = useState(false);
  const [proofText, setProofText] = useState("");
  const [proofPhoto, setProofPhoto] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef(null);

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-20 text-center">
        <p className="text-muted">No item found with that ID.</p>
        <Link to="/browse" className="text-teal font-semibold text-sm">Back to Browse</Link>
      </div>
    );
  }

  const handleFile = (f) => {
    if (f && f.type.startsWith("image/")) setProofPhoto(f);
  };

  const handleSubmitClaim = (e) => {
    e.preventDefault();
    if (!proofText.trim()) return;
    // Real submit will POST to /api/claims here with { itemId, proofText, proofImage }
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <Link to="/browse" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink mb-6">
        <ArrowLeft size={15} /> Back to Browse
      </Link>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <div className="h-52 bg-paper flex items-center justify-center">
          <PackageSearch size={36} className="text-line" strokeWidth={1.3} />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <StatusBadge status={item.status} size="md" />
            <span className="font-mono text-xs text-faint">{item.id}</span>
          </div>
          <h1 className="font-display text-2xl font-medium mt-2">{item.title}</h1>
          <p className="text-muted text-[14.5px] mt-2 leading-relaxed">{item.description}</p>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-line text-[13.5px]">
            <div><span className="text-faint">Category</span><div className="font-semibold mt-0.5">{item.category}</div></div>
            <div><span className="text-faint">Location</span><div className="font-semibold mt-0.5">{item.location}</div></div>
            <div><span className="text-faint">Reported by</span><div className="font-semibold mt-0.5">{item.reporter}</div></div>
            <div><span className="text-faint">Date</span><div className="font-semibold mt-0.5">{item.date}</div></div>
          </div>

          {submitted ? (
            <div className="mt-7 pt-6 border-t border-line text-center">
              <div className="w-12 h-12 rounded-full bg-teal-tint flex items-center justify-center mx-auto">
                <CheckCircle2 size={22} className="text-teal" />
              </div>
              <h3 className="font-display text-lg mt-3">Claim submitted</h3>
              <p className="text-muted text-[13.5px] mt-1.5 leading-relaxed">
                The reporter or an admin will review your proof and get back to you. You can
                track this in your dashboard.
              </p>
              <Link to="/dashboard" className="inline-block mt-4 text-teal font-semibold text-sm hover:text-teal-deep">
                Go to my dashboard
              </Link>
            </div>
          ) : claiming ? (
            <form onSubmit={handleSubmitClaim} className="mt-7 pt-6 border-t border-line">
              <h3 className="font-display text-lg mb-1">Is this yours?</h3>
              <p className="text-muted text-[13px] mb-4">
                Answer with something only the real owner would know — this is what gets
                checked before your claim is approved.
              </p>

              <label className="block text-[13px] font-semibold text-ink mb-2">
                {item.type === "found"
                  ? "What's inside it, or any marks/stickers only you'd know about?"
                  : "Describe a specific detail that proves you found it, not just guessed"}
              </label>
              <textarea
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
                rows={3}
                placeholder="e.g. There's a small scratch on the back and a red keychain attached..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-line text-[14px] outline-none focus:border-teal focus:ring-3 focus:ring-teal/15 transition resize-none"
              />

              <label className="block text-[13px] font-semibold text-ink mt-4 mb-2">
                Optional: supporting photo
              </label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
              <div
                onClick={() => fileRef.current?.click()}
                className="border border-dashed border-line rounded-xl p-4 text-center cursor-pointer hover:border-ink/30 transition-colors"
              >
                {proofPhoto ? (
                  <div className="flex items-center justify-center gap-2 text-[13px] font-semibold">
                    <CheckCircle2 size={15} className="text-teal" /> {proofPhoto.name}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-[13px] text-muted">
                    <ImageIcon size={15} className="text-faint" /> Click to add a photo
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  type="submit"
                  disabled={!proofText.trim()}
                  className="flex-1 py-3 rounded-xl bg-teal text-white font-semibold text-sm disabled:bg-line disabled:text-faint hover:bg-teal-deep transition-colors"
                >
                  Submit claim
                </button>
                <button
                  type="button"
                  onClick={() => setClaiming(false)}
                  className="px-5 py-3 rounded-xl border border-line font-semibold text-sm hover:border-ink/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setClaiming(true)}
              className="w-full mt-7 py-3 rounded-xl bg-teal text-white font-semibold text-sm hover:bg-teal-deep transition-colors"
            >
              {item.type === "found" ? "This is mine — submit a claim" : "I found this — submit a claim"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
