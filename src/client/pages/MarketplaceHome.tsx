import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Store, Sparkles, Search, Star, MapPin, Clock, Shield,
  ChevronRight, Loader2, Users, Wand2, Brain, BookOpen,
  Gem, Wind, Beaker, type LucideIcon,
} from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import {
  searchListings,
  fetchCategories,
  fetchFeaturedListings,
  type ServiceListingSummary,
  type ServiceCategory,
} from "../api/marketplaceClient";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Sparkles, Wand2, Star, Brain, Beaker, BookOpen, Gem, Wind, Shield, Users,
};

function resolveCatIcon(icon: string): LucideIcon {
  return CATEGORY_ICONS[icon] ?? Store;
}

function formatPrice(cents: number, model: string): string {
  if (model === "contact") return "Contact for price";
  if (cents === 0) return "Free";
  return `$${(cents / 100).toFixed(0)}`;
}

function ListingCard({ listing }: { listing: ServiceListingSummary }) {
  return (
    <Link
      to={`/marketplace/l/${listing.slug}`}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.04]"
    >
      {listing.mediaUrls.length > 0 && (
        <div className="mb-3 h-36 overflow-hidden rounded-lg bg-white/[0.03]">
          <img
            src={listing.mediaUrls[0]}
            alt={listing.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10px] text-zinc-500">
          {listing.categoryName ?? "General"}
        </span>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-amber-400" />
          <span className="text-xs text-zinc-400">
            {listing.rating > 0 ? listing.rating.toFixed(1) : "New"}
          </span>
          {listing.reviewCount > 0 && (
            <span className="text-[10px] text-zinc-600">({listing.reviewCount})</span>
          )}
        </div>
      </div>
      <h3 className="font-serif text-base font-bold text-white group-hover:text-purple-300 transition-colors">
        {listing.title}
      </h3>
      <p className="mt-1 text-xs text-zinc-500">
        by <span className="text-zinc-400">@{listing.providerHandle}</span>
      </p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-bold text-emerald-400">
          {formatPrice(listing.priceCents, listing.pricingModel)}
        </span>
        <div className="flex items-center gap-2 text-[10px] text-zinc-600">
          {listing.deliveryDays && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {listing.deliveryDays}d
            </span>
          )}
          {listing.isOnline && (
            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-400">Online</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function CategoryCard({ category }: { category: ServiceCategory }) {
  const Icon = resolveCatIcon(category.icon);
  return (
    <Link
      to={`/marketplace/c/${category.slug}`}
      className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center transition hover:border-purple-500/30 hover:bg-white/[0.04]"
    >
      <div className="rounded-lg bg-purple-500/10 p-3">
        <Icon className="h-5 w-5 text-purple-400" />
      </div>
      <span className="text-xs font-medium text-white">{category.name}</span>
      <span className="text-[10px] text-zinc-600">{category.count} listings</span>
    </Link>
  );
}

export function MarketplaceHome() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [featured, setFeatured] = useState<ServiceListingSummary[]>([]);
  const [recent, setRecent] = useState<ServiceListingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cats, feat, rec] = await Promise.all([
          fetchCategories(),
          fetchFeaturedListings(6),
          searchListings({ sort: "newest", limit: 8 }),
        ]);
        if (cancelled) return;
        setCategories(cats);
        setFeatured(feat.listings);
        setRecent(rec.listings);
      } catch { /* handled */ }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SeoHead title="Magic Shop" description="Browse magical services from verified practitioners. Divination, spellwork, astrology readings, ritual services, and more." path="/marketplace" />

      {/* Hero */}
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-indigo-900/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 text-center md:px-8 md:py-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300">
            <Shield className="h-3.5 w-3.5" />
            Verified Practitioners Only
          </div>
          <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
            The Magic Shop
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Find verified practitioners for divinations, rituals, spellwork, astrology, and more. Every provider is KYC-verified.
          </p>
          <div className="mx-auto mt-6 max-w-lg">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/marketplace?query=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="relative"
            >
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services — tarot reading, protection ritual, natal chart..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-purple-500/40 focus:bg-white/[0.05]"
              />
            </form>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="border-b border-white/5">
          <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-white">Browse by Category</h2>
              <Link to="/marketplace" className="text-xs text-purple-400 hover:text-purple-300">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="border-b border-white/5">
          <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-white">Featured Services</h2>
              <Link to="/marketplace?sort=rating" className="text-xs text-purple-400 hover:text-purple-300">
                View all →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent */}
      {recent.length > 0 && (
        <section className="border-b border-white/5">
          <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-white">Newly Listed</h2>
              <Link to="/marketplace?sort=newest" className="text-xs text-purple-400 hover:text-purple-300">
                View all →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recent.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Provider CTA */}
      <section className="mx-auto max-w-6xl px-5 py-12 text-center md:px-8">
        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-indigo-900/5 p-8 md:p-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300">
            <Wand2 className="h-3.5 w-3.5" />
            Offer Your Services
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">Are You a Practitioner?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
            Create your profile, get KYC-verified, and start offering your magical services to the MagusMe community.
          </p>
          <Link
            to="/marketplace/create"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-purple-500"
          >
            <Sparkles className="h-4 w-4" />
            Start Selling
          </Link>
        </div>
      </section>
    </div>
  );
}
