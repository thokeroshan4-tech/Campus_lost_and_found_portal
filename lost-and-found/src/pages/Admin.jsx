import { useState } from "react";
import { ShieldCheck, IdCard, CheckCircle2, XCircle, Users, PackageOpen, Clock } from "lucide-react";
import { mockItems, mockPendingVerifications } from "../data/mockItems";

const DESIGNATION_LABEL = {
  student: "Student",
  staff: "Staff",
  worker: "Worker",
  faculty: "Faculty",
};

export default function Admin() {
  const [queue, setQueue] = useState(mockPendingVerifications);

  const openItems = mockItems.filter((i) => i.status !== "resolved").length;
  const pendingClaims = mockItems.filter((i) => i.status === "pending").length;
  const resolved = mockItems.filter((i) => i.status === "resolved").length;

  const decide = (id) => setQueue((q) => q.filter((u) => u.id !== id));

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="flex items-center gap-2 mb-1.5">
        <ShieldCheck size={20} className="text-teal" />
        <h1 className="font-display text-3xl font-medium tracking-tight">Admin dashboard</h1>
      </div>
      <p className="text-muted text-[14.5px] mb-8">
        Only visible to admins — regular users are redirected before this page ever loads.
      </p>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <StatCard icon={PackageOpen} label="Open items" value={openItems} />
        <StatCard icon={Clock} label="Pending claims" value={pendingClaims} />
        <StatCard icon={Users} label="Pending verifications" value={queue.length} />
      </div>

      {/* Verification queue */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-xl font-medium">Pending identity verifications</h2>
        <span className="text-[13px] text-faint">{queue.length} waiting</span>
      </div>
      <p className="text-muted text-[13.5px] mb-5">
        Review each person's ID proof before granting report/claim access.
      </p>

      {queue.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-line rounded-2xl bg-white">
          <CheckCircle2 size={28} className="mx-auto text-line" strokeWidth={1.4} />
          <p className="text-muted text-sm mt-3">All caught up — no pending verifications.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {queue.map((u) => (
            <VerificationRow key={u.id} user={u} onDecide={decide} />
          ))}
        </div>
      )}

      <p className="text-[12px] text-faint mt-10">
        Resolved items so far: <span className="font-semibold text-ink">{resolved}</span>
      </p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-line rounded-2xl p-5">
      <div className="flex items-center gap-2 text-faint mb-2">
        <Icon size={15} />
        <span className="text-[13px] font-semibold">{label}</span>
      </div>
      <div className="font-display text-3xl font-medium">{value}</div>
    </div>
  );
}

function VerificationRow({ user, onDecide }) {
  return (
    <div className="bg-white border border-line rounded-2xl p-4 flex items-center gap-4">
      <div className="w-14 h-14 rounded-xl bg-paper flex items-center justify-center flex-shrink-0">
        <IdCard size={22} className="text-faint" strokeWidth={1.5} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[14.5px]">{user.name}</p>
        <p className="text-[12.5px] text-faint truncate">
          {DESIGNATION_LABEL[user.designation]} · {user.email}
        </p>
        <p className="text-[12px] text-faint mt-0.5">Campus ID: {user.campusId}</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button className="px-3 py-2 rounded-lg border border-line text-[13px] font-semibold hover:border-ink/30 transition-colors">
          View ID
        </button>
        <button
          onClick={() => onDecide(user.id)}
          className="w-9 h-9 rounded-lg bg-status-resolved-bg text-status-resolved flex items-center justify-center hover:opacity-80 transition"
          title="Approve"
        >
          <CheckCircle2 size={17} />
        </button>
        <button
          onClick={() => onDecide(user.id)}
          className="w-9 h-9 rounded-lg bg-rust/10 text-rust flex items-center justify-center hover:opacity-80 transition"
          title="Reject"
        >
          <XCircle size={17} />
        </button>
      </div>
    </div>
  );
}
