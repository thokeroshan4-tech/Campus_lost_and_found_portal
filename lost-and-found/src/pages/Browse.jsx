import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, SlidersHorizontal, PackageSearch } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { mockItems, CATEGORIES } from "../data/mockItems";

export default function Browse() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all"); // all | lost | found
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    return mockItems.filter((item) => {
      const matchesQuery =
        query.trim() === "" ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      const matchesType = type === "all" || item.type === type;
      const matchesCategory = category === "all" || item.category === category;
      return matchesQuery && matchesType && matchesCategory;
    });
  }, [query, type, category]);

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-medium tracking-tight">Browse reports</h1>
        <p className="text-muted text-[14.5px] mt-1.5">
          Search everything reported lost or found on campus.
        </p>
      </div>

      {/* Search + toggle */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by item, brand, or where it was seen..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-line bg-white text-[14.5px] outline-none focus:border-teal focus:ring-3 focus:ring-teal/15 transition"
          />
        </div>
        <div className="flex bg-white border border-line rounded-xl p-1">
          {[
            { key: "all", label: "All" },
            { key: "lost", label: "Lost" },
            { key: "found", label: "Found" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setType(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                type === t.key ? "bg-ink text-white" : "text-muted hover:bg-paper"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
        <SlidersHorizontal size={14} className="text-faint flex-shrink-0" />
        <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
          All categories
        </FilterChip>
        {CATEGORIES.map((c) => (
          <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
            {c}
          </FilterChip>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState onClear={() => { setQuery(""); setType("all"); setCategory("all"); }} />
      ) : (
        <>
          <p className="text-sm text-faint mb-4">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FilterChip({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-semibold border transition-colors ${
        active
          ? "bg-teal-tint border-teal text-teal-deep"
          : "bg-white border-line text-muted hover:border-ink/30"
      }`}
    >
      {children}
    </button>
  );
}

function ItemCard({ item }) {
  return (
    <Link
      to={`/item/${item.id}`}
      className="group block bg-white border border-line rounded-2xl overflow-hidden hover:border-ink/25 hover:shadow-[0_8px_24px_rgba(27,36,48,0.08)] transition-all"
    >
      <div className="h-36 bg-paper flex items-center justify-center relative">
        <PackageSearch size={30} className="text-line" strokeWidth={1.4} />
        <span
          className={`absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded-md ${
            item.type === "lost" ? "bg-rust/10 text-rust" : "bg-teal/10 text-teal-deep"
          }`}
        >
          {item.type}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-[14.5px] leading-snug line-clamp-2">{item.title}</h3>
        </div>
        <div className="flex items-center gap-1 text-[12.5px] text-faint mb-3">
          <MapPin size={12} />
          <span className="line-clamp-1">{item.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <StatusBadge status={item.status} />
          <span className="font-mono text-[11px] text-faint">{item.id}</span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="text-center py-20 border border-dashed border-line rounded-2xl bg-white">
      <PackageSearch size={32} className="mx-auto text-line" strokeWidth={1.4} />
      <h3 className="font-display text-lg mt-4">Nothing matches yet</h3>
      <p className="text-muted text-sm mt-1.5 max-w-sm mx-auto">
        Try a different search term, or check back later — new reports come in daily.
      </p>
      <button onClick={onClear} className="mt-5 text-teal font-semibold text-sm hover:text-teal-deep">
        Clear filters
      </button>
    </div>
  );
}
