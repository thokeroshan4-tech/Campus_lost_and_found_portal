import { Link } from "react-router-dom";
import { LayoutDashboard, PackagePlus, PackageSearch } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { myMockItems, myMockClaims } from "../data/mockItems";

export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between mb-1.5">
        <h1 className="font-display text-3xl font-medium tracking-tight">My Dashboard</h1>
        <Link
          to="/report"
          className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-deep transition-colors"
        >
          <PackagePlus size={16} /> Report an item
        </Link>
      </div>
      <p className="text-muted text-[14.5px] mt-1.5 mb-10">
        Your reported items and your claims — only visible to you.
      </p>

      {/* My reported items */}
      <Section title="Items I reported" count={myMockItems.length}>
        {myMockItems.length === 0 ? (
          <EmptyRow icon={LayoutDashboard} text="You haven't reported anything yet." />
        ) : (
          <div className="flex flex-col gap-3">
            {myMockItems.map((item) => (
              <Link
                key={item.id}
                to={`/item/${item.id}`}
                className="flex items-center gap-4 bg-white border border-line rounded-xl p-4 hover:border-ink/25 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-paper flex items-center justify-center flex-shrink-0">
                  <PackageSearch size={18} className="text-faint" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px] truncate">{item.title}</p>
                  <p className="text-[12.5px] text-faint">{item.location}</p>
                </div>
                <StatusBadge status={item.status} />
              </Link>
            ))}
          </div>
        )}
      </Section>

      {/* My claims */}
      <Section title="My claims" count={myMockClaims.length}>
        {myMockClaims.length === 0 ? (
          <EmptyRow icon={LayoutDashboard} text="You haven't submitted any claims yet." />
        ) : (
          <div className="flex flex-col gap-3">
            {myMockClaims.map((claim) => (
              <Link
                key={claim.id}
                to={`/item/${claim.item.id}`}
                className="flex items-center gap-4 bg-white border border-line rounded-xl p-4 hover:border-ink/25 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-paper flex items-center justify-center flex-shrink-0">
                  <PackageSearch size={18} className="text-faint" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px] truncate">{claim.item.title}</p>
                  <p className="text-[12.5px] text-faint truncate">{claim.proofText}</p>
                </div>
                <StatusBadge status={claim.status} />
              </Link>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function Section({ title, count, children }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-display text-xl font-medium">{title}</h2>
        <span className="text-[13px] text-faint">({count})</span>
      </div>
      {children}
    </div>
  );
}

function EmptyRow({ icon: Icon, text }) {
  return (
    <div className="text-center py-14 border border-dashed border-line rounded-2xl bg-white">
      <Icon size={26} className="mx-auto text-line" strokeWidth={1.4} />
      <p className="text-muted text-sm mt-3">{text}</p>
    </div>
  );
}
