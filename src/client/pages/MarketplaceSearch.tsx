import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search, SlidersHorizontal, X, Loader2, ChevronDown,
} from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import {
  searchListings,
  fetchCategories,
  type ServiceListingSummary,
  type ServiceCategory,
} from "../api/marketplaceClient";

function ListingCard({ listing }: { listing: ServiceListingSummary }) {
  return (
    <Link
      to={`/marketplace/l/${listing.slug}`}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.04]"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10px] text-zinc-500">
          {listing.categoryName ?? "General"}
        </span>
        <span className="text-xs text-zinc-500">
          ★ {listing.rating > 0 ? listing.rating.toFixed(1) : "New"}
          {listing.reviewCount > 0 && ` (${listing.reviewCount})`}
        </span>
      </div>
      <h3 className="font-serif text-base font-bold text-white group-hover:text-purple-300 transition-colors">
        {listing.title}
      </h3>
      <p className="mt-1 text-xs text-zinc-500">
        by <span className="text-zinc-400">@{listing.providerHandle}</span>
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {listing.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-zinc-600">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
        <span className="text-sm font-bold text-emerald-400">
          {listing.pricingModel === "contact" ? "Contact" : `$${(listing.priceCents / 100).toFixed(0)}`}
        </span>
        <div className="flex items-center gap-2 text-[10px] text-zinc-600">
          {listing.deliveryDays && <span>{listing.deliveryDays}d delivery</span>}
          {listing.isOnline && <span className="text-emerald-400">Online</span>}
        </div>
      </div>
    </Link>
  );
}

const SORT_OPTIONS = [
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "orders", label: "Most Ordered" },
];

export function MarketplaceSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "rating";
  const pricingModel = searchParams.get("pricingModel") ?? "";

  const [listings, setListings] = useState<ServiceListingSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    searchListings({
      query: query || undefined,
      category: category || undefined,
      sort: sort || undefined,
      pricingModel: pricingModel || undefined,
      limit: 50,
    })
      .then((res) => {
        if (cancelled) return;
        setListings(res.listings);
        setTotal(res.total);
      })
      .catch(() => null)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [query, category, sort, pricingModel]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  function clearFilters() {
    setSearchParams({});
    setLocalQuery("");
  }

  const hasFilters = Boolean(query || category || pricingModel || sort !== "rating");

  return (
    <div className="min-h-screen">
      <SeoHead
        title={query ? `"${query}" — Magic Shop` : "Browse Services — Magic Shop"}
        description="Browse magical services from verified practitioners."
        path={`/marketplace${window.location.search}`}
      />

      {/* Header */}
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-indigo-900/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 py-8 md:px-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500">
            <Link to="/marketplace" className="hover:text-zinc-300">Magic Shop</Link>
            {category && (
              <>
                <span>/</span>
                <span className="text-zinc-300">{categories.find((c) => c.slug === category)?.name ?? category}</span>
              </>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateParam("query", localQuery);
            }}
            className="relative max-w-xl"
          >
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-purple-500/40 focus:bg-white/[0.05]"
            />
          </form>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-zinc-500">
              {loading ? "Searching..." : `${total} service${total !== 1 ? "s" : ""} found`}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-white/20"
              >
                <SlidersHorizontal className="h-3 w-3" />
                Filters
                {hasFilters && <span className="ml-1 h-1.5 w-1.5 rounded-full bg-purple-400" />}
              </button>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => updateParam("sort", e.target.value)}
                  className="appearance-none rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 pr-7 text-xs text-zinc-400 outline-none transition focus:border-purple-500/40"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters panel */}
      {showFilters && (
        <section className="border-b border-white/5 bg-white/[0.01]">
          <div className="mx-auto max-w-6xl px-5 py-4 md:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-medium text-zinc-400">Pricing:</span>
              {["", "fixed", "hourly", "package", "contact"].map((pm) => (
                <button
                  key={pm}
                  onClick={() => updateParam("pricingModel", pm)}
                  className={`rounded-lg border px-3 py-1 text-xs transition ${
                    pricingModel === pm
                      ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
                      : "border-white/10 text-zinc-500 hover:border-white/20"
                  }`}
                >
                  {pm ? pm.charAt(0).toUpperCase() + pm.slice(1) : "All"}
                </button>
              ))}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 rounded-lg border border-red-500/20 px-3 py-1 text-xs text-red-400 transition hover:bg-red-500/10"
                >
                  <X className="h-3 w-3" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        {loading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        ) : listings.length === 0 ? (
          <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 text-center">
            <Search className="h-8 w-8 text-zinc-600" />
            <p className="text-zinc-400">No services found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="rounded-full bg-purple-600 px-4 py-2 text-xs text-white hover:bg-purple-500"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
