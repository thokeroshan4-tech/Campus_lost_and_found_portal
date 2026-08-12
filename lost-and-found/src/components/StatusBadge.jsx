const STATUS_MAP = {
  open:     { label: "Open",     text: "text-status-open",     bg: "bg-status-open-bg" },
  pending:  { label: "Pending",  text: "text-status-pending",  bg: "bg-status-pending-bg" },
  approved: { label: "Approved", text: "text-status-approved", bg: "bg-status-approved-bg" },
  resolved: { label: "Resolved", text: "text-status-resolved", bg: "bg-status-resolved-bg" },
};

// Single source of truth for status color + label.
// Every page imports this instead of re-deciding what "pending" looks like.
export default function StatusBadge({ status, size = "sm" }) {
  const s = STATUS_MAP[status] || STATUS_MAP.open;
  const pad = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${pad} ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.text.replace("text-", "bg-")}`} />
      {s.label}
    </span>
  );
}
