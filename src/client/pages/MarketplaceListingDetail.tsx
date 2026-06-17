import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Star, MapPin, Clock, Shield, Check, ChevronDown, ChevronUp,
  MessageSquare, Sparkles, User, Award, Loader2, AlertTriangle,
  Send, X, ShoppingCart,
} from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import { useSession } from "../context/SessionContext";
import {
  fetchListingBySlug,
  fetchListingReviews,
  placeOrder,
  type ServiceListingDetail,
  type ServiceReview,
  type ServicePackage,
} from "../api/marketplaceClient";

function ReviewCard({ review }: { review: ServiceReview }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/10 text-[10px] text-purple-400">
            {review.reviewerHandle.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-zinc-400">@{review.reviewerHandle}</span>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-zinc-700"}`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm leading-relaxed text-zinc-300">{review.body}</p>
      <p className="mt-2 text-[10px] text-zinc-600">
        {new Date(review.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

function PackageCard({
  pkg,
  selected,
  onSelect,
}: {
  pkg: ServicePackage;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-xl border p-4 text-left transition ${
        selected
          ? "border-purple-500/50 bg-purple-500/10"
          : "border-white/10 bg-white/[0.02] hover:border-white/20"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <h4 className="font-serif text-base font-bold text-white">{pkg.name}</h4>
        <span className="text-lg font-bold text-emerald-400">
          ${(pkg.priceCents / 100).toFixed(0)}
        </span>
      </div>
      {pkg.description && (
        <p className="mb-2 text-sm text-zinc-400">{pkg.description}</p>
      )}
      {pkg.inclusions.length > 0 && (
        <ul className="space-y-1">
          {pkg.inclusions.map((inc, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-zinc-500">
              <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
              {inc}
            </li>
          ))}
        </ul>
      )}
      {pkg.deliveryDays && (
        <p className="mt-2 text-xs text-zinc-600">
          <Clock className="mr-1 inline h-3 w-3" />
          Delivered in {pkg.deliveryDays} day{pkg.deliveryDays !== 1 ? "s" : ""}
        </p>
      )}
    </button>
  );
}

export function MarketplaceListingDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, authenticated, createSession, loading: authLoading } = useSession();

  const [listing, setListing] = useState<ServiceListingDetail | null>(null);
  const [reviews, setReviews] = useState<{ reviews: ServiceReview[]; avgRating: number; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [instructions, setInstructions] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [showReviewSection, setShowReviewSection] = useState(false);
  const [showOracleModal, setShowOracleModal] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchListingBySlug(slug),
      fetchListingReviews(slug),
    ])
      .then(([l, r]) => {
        if (cancelled) return;
        setListing(l);
        setReviews(r);
        if (l.packages.length > 0) setSelectedPkg(l.packages[0].id);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load listing.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  async function handleOrder() {
    if (!authenticated) {
      await createSession();
    }
    if (!slug) return;
    setOrdering(true);
    setOrderError(null);
    try {
      const result = await placeOrder(slug, {
        packageId: selectedPkg ?? undefined,
        buyerInstructions: instructions || undefined,
      });
      setOrderSuccess(result.id);
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : "Failed to place order.");
    }
    setOrdering(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-20 text-center">
        <AlertTriangle className="mx-auto mb-4 h-8 w-8 text-red-400" />
        <h1 className="mb-2 font-serif text-xl font-bold text-white">Listing Not Found</h1>
        <p className="mb-6 text-sm text-zinc-500">{error ?? "The listing you're looking for doesn't exist."}</p>
        <Link to="/marketplace" className="rounded-full bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-500">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SeoHead
        title={`${listing.title} — Magic Shop`}
        description={listing.description.slice(0, 160)}
        path={`/marketplace/l/${listing.slug}`}
      />

      {/* Breadcrumb */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-5 py-4 md:px-8">
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <Link to="/marketplace" className="hover:text-zinc-400">Magic Shop</Link>
            <span>/</span>
            {listing.categoryName && (
              <>
                <Link to={`/marketplace?category=${listing.categorySlug}`} className="hover:text-zinc-400">
                  {listing.categoryName}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-zinc-400">{listing.title}</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            {listing.mediaUrls.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {listing.mediaUrls.map((url, i) => (
                  <div key={i} className="overflow-hidden rounded-xl bg-white/[0.03]">
                    <img
                      src={url}
                      alt={`${listing.title} ${i + 1}`}
                      className="h-64 w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Title & meta */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-400">
                  {listing.categoryName ?? "General"}
                </span>
                {listing.providerKycStatus === "verified" && (
                  <span className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                    <Shield className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </div>
              <h1 className="font-serif text-2xl font-bold text-white">{listing.title}</h1>
              <Link
                to={`/marketplace/s/${listing.providerHandle}`}
                className="mt-2 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-purple-400"
              >
                <User className="h-4 w-4" />
                by <span className="font-medium">@{listing.providerHandle}</span>
                <span className="text-zinc-600">· {listing.providerDisplayName}</span>
              </Link>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-400" />
                  {listing.rating > 0 ? listing.rating.toFixed(1) : "No ratings yet"}
                  {listing.reviewCount > 0 && ` (${listing.reviewCount})`}
                </span>
                {listing.deliveryDays && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {listing.deliveryDays} day delivery
                  </span>
                )}
                {listing.isOnline && (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    Online Service
                  </span>
                )}
                {listing.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {listing.location}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="mb-3 font-serif text-lg font-bold text-white">About This Service</h2>
              <div className="prose prose-invert prose-sm max-w-none text-zinc-400 leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </div>
            </div>

            {/* Tags */}
            {listing.tags.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-zinc-400">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/marketplace?query=${encodeURIComponent(tag)}`}
                      className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-zinc-500 transition hover:border-white/20 hover:text-zinc-300"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Provider traditions */}
            {listing.providerTraditions.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-zinc-400">Traditions</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.providerTraditions.map((t) => (
                    <span key={t} className="rounded-lg bg-purple-500/10 px-3 py-1 text-xs text-purple-400">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {reviews && (
              <div>
                <button
                  onClick={() => setShowReviewSection(!showReviewSection)}
                  className="flex items-center justify-between w-full"
                >
                  <h2 className="font-serif text-lg font-bold text-white">
                    Reviews ({reviews.total})
                  </h2>
                  {showReviewSection ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
                </button>
                {showReviewSection && (
                  <div className="mt-4 space-y-3">
                    {reviews.reviews.length === 0 ? (
                      <p className="text-sm text-zinc-500">No reviews yet.</p>
                    ) : (
                      reviews.reviews.map((r) => <ReviewCard key={r.id} review={r} />)
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar — Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Provider card */}
              <Link
                to={`/marketplace/s/${listing.providerHandle}`}
                className="block rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-purple-500/30"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-sm text-purple-400">
                    {listing.providerDisplayName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{listing.providerDisplayName}</p>
                    <p className="text-xs text-zinc-500">@{listing.providerHandle}</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 line-clamp-2">{listing.providerBio}</p>
                {listing.providerKycStatus === "verified" && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400">
                    <Award className="h-3 w-3" />
                    KYC Verified
                  </div>
                )}
              </Link>

              {/* Order form */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="mb-4 font-serif text-base font-bold text-white">Book This Service</h3>

                {listing.packages.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <p className="text-xs font-medium text-zinc-400">Choose a package</p>
                    {listing.packages.map((pkg) => (
                      <PackageCard
                        key={pkg.id}
                        pkg={pkg}
                        selected={selectedPkg === pkg.id}
                        onSelect={() => setSelectedPkg(pkg.id)}
                      />
                    ))}
                  </div>
                )}

                {listing.pricingModel === "fixed" && listing.packages.length === 0 && (
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-emerald-400">
                      ${(listing.priceCents / 100).toFixed(0)}
                    </p>
                    <p className="text-xs text-zinc-500">Fixed price</p>
                  </div>
                )}

                <div className="mb-4">
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    Instructions for the seller (optional)
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={3}
                    placeholder="Describe what you're looking for..."
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-500/40"
                  />
                </div>

                {orderSuccess ? (
                  <div className="rounded-lg bg-emerald-500/10 p-4 text-center">
                    <ShoppingCart className="mx-auto mb-2 h-6 w-6 text-emerald-400" />
                    <p className="text-sm font-medium text-emerald-300">Order Placed!</p>
                    <p className="mt-1 text-xs text-zinc-400">Order #{orderSuccess.slice(-8)}</p>
                    <Link
                      to={`/marketplace/orders/${orderSuccess}`}
                      className="mt-3 inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs text-white hover:bg-emerald-500"
                    >
                      View Order
                    </Link>
                  </div>
                ) : (
                  <>
                    {orderError && (
                      <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-400">
                        <AlertTriangle className="h-3 w-3 shrink-0" />
                        {orderError}
                      </div>
                    )}
                    <button
                      onClick={() => setShowOracleModal(true)}
                      className="mb-2 flex w-full items-center justify-center gap-2 rounded-full border border-purple-500/30 px-4 py-2.5 text-xs font-medium text-purple-300 transition hover:bg-purple-500/10"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Consult the Oracle
                    </button>
                    <button
                      onClick={handleOrder}
                      disabled={ordering}
                      className="w-full rounded-full bg-purple-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-purple-500 disabled:opacity-50"
                    >
                      {ordering ? (
                        <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                      ) : !authenticated ? (
                        "Sign In to Book"
                      ) : (
                        `Book Now — ${
                          selectedPkg
                            ? `$${(listing.packages.find((p) => p.id === selectedPkg)?.priceCents ?? listing.priceCents) / 100}`
                            : `$${(listing.priceCents / 100).toFixed(0)}`
                        }`
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Oracle Modal */}
      {showOracleModal && listing && (
        <OracleConsultationModal
          providerName={listing.providerDisplayName}
          providerHandle={listing.providerHandle}
          providerBio={listing.providerBio}
          traditions={listing.providerTraditions}
          serviceTitle={listing.title}
          onClose={() => setShowOracleModal(false)}
        />
      )}
    </div>
  );
}

function OracleConsultationModal({
  providerName,
  providerHandle,
  providerBio,
  traditions,
  serviceTitle,
  onClose,
}: {
  providerName: string;
  providerHandle: string;
  providerBio: string;
  traditions: string[];
  serviceTitle: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"intro" | "revealing" | "done">("intro");
  const [reading, setReading] = useState<string>("");

  useEffect(() => {
    if (step !== "revealing") return;
    setTimeout(() => {
      const cards = [
        { glyph: "🌙", name: "The Moon", meaning: "Trust your intuition about this path." },
        { glyph: "⭐", name: "The Star", meaning: "Hope and inspiration guide you here." },
        { glyph: "🔥", name: "The Sun", meaning: "Clarity and success await." },
        { glyph: "🌀", name: "The Wheel", meaning: "A fateful alignment brings you together." },
        { glyph: "💎", name: "The Crystal", meaning: "This connection has deep value." },
      ];
      const selected = cards[Math.floor(Math.random() * cards.length)];
      const traditionContext = traditions.length > 0 ? traditions.join(", ") : "mystical arts";
      setReading(
        `The cards speak favorably about working with **${providerName}** (${providerHandle}), ` +
        `a practitioner of ${traditionContext}. ` +
        `The **${selected.name}** appears — ${selected.meaning} ` +
        `The energies align with "${serviceTitle}" as a meaningful step forward. ` +
        `Trust what draws you to this offering.`
      );
      setStep("done");
    }, 1800);
  }, [step]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-zinc-600 hover:text-zinc-400">
          <X className="h-4 w-4" />
        </button>

        {step === "intro" && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10">
              <Sparkles className="h-7 w-7 text-purple-400" />
            </div>
            <h3 className="mb-2 font-serif text-lg font-bold text-white">Oracle Consultation</h3>
            <p className="mb-4 text-sm text-zinc-400">
              Before you book, let the oracle offer guidance about working with {providerName}.
            </p>
            <div className="mb-4 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-left text-xs text-zinc-500">
              <p><span className="text-zinc-400">Practitioner:</span> {providerName} (@{providerHandle})</p>
              {traditions.length > 0 && <p><span className="text-zinc-400">Traditions:</span> {traditions.join(", ")}</p>}
              <p><span className="text-zinc-400">Service:</span> {serviceTitle}</p>
            </div>
            <button
              onClick={() => setStep("revealing")}
              className="rounded-full bg-purple-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500"
            >
              <Sparkles className="mr-1.5 inline h-4 w-4" />
              Cast the Reading
            </button>
          </div>
        )}

        {step === "revealing" && (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="mb-4 h-16 w-16 animate-pulse rounded-full bg-purple-500/20">
              <div className="flex h-full items-center justify-center">
                <Sparkles className="h-7 w-7 text-purple-400" />
              </div>
            </div>
            <p className="text-sm text-purple-300">Consulting the oracle...</p>
            <div className="mt-4 flex gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-2 w-2 animate-bounce rounded-full bg-purple-500/50" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
              <Sparkles className="h-7 w-7 text-amber-400" />
            </div>
            <h3 className="mb-3 font-serif text-lg font-bold text-white">The Oracle Speaks</h3>
            <div className="mb-4 rounded-xl border border-amber-500/10 bg-gradient-to-br from-amber-500/[0.04] to-transparent p-4 text-sm leading-relaxed text-zinc-300">
              {reading.split(/\*\*(.*?)\*\*/).map((part, i) =>
                i % 2 === 1 ? <strong key={i} className="text-amber-300">{part}</strong> : part
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-purple-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500"
            >
              Continue Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
