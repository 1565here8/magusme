import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Check, Loader2, Plus, X,
  Wand2, Sparkles, AlertTriangle,
} from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import { useSession } from "../context/SessionContext";
import {
  createListing,
  fetchCategories,
  type ServiceCategory,
} from "../api/marketplaceClient";

const STEPS = [
  { title: "Basics", description: "Title, category & description" },
  { title: "Pricing", description: "Price, delivery & model" },
  { title: "Packages", description: "Tiered offerings" },
  { title: "Review", description: "Review & publish" },
];

interface PackageForm {
  name: string;
  description: string;
  priceCents: number;
  deliveryDays: string;
  inclusions: string[];
}

const emptyPackage = (): PackageForm => ({
  name: "",
  description: "",
  priceCents: 0,
  deliveryDays: "",
  inclusions: [],
});

export function MarketplaceCreateListing() {
  const navigate = useNavigate();
  const { authenticated, createSession } = useSession();
  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [pricingModel, setPricingModel] = useState<"fixed" | "hourly" | "package" | "contact">("fixed");
  const [priceCents, setPriceCents] = useState(0);
  const [deliveryDays, setDeliveryDays] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [location, setLocation] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [packages, setPackages] = useState<PackageForm[]>([emptyPackage()]);
  const [mediaUrlsStr, setMediaUrlsStr] = useState("");

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => null);
  }, []);

  function handleAddPackage() {
    setPackages([...packages, emptyPackage()]);
  }

  function handleRemovePackage(i: number) {
    if (packages.length <= 1) return;
    setPackages(packages.filter((_, idx) => idx !== i));
  }

  function handlePackageChange(i: number, field: keyof PackageForm, value: string | number | string[]) {
    const next = [...packages];
    next[i] = { ...next[i], [field]: value };
    setPackages(next);
  }

  function handleAddInclusion(pkgIdx: number) {
    const next = [...packages];
    next[pkgIdx] = { ...next[pkgIdx], inclusions: [...next[pkgIdx].inclusions, ""] };
    setPackages(next);
  }

  function handleRemoveInclusion(pkgIdx: number, incIdx: number) {
    const next = [...packages];
    next[pkgIdx] = { ...next[pkgIdx], inclusions: next[pkgIdx].inclusions.filter((_, i) => i !== incIdx) };
    setPackages(next);
  }

  function handleInclusionChange(pkgIdx: number, incIdx: number, value: string) {
    const next = [...packages];
    const inc = [...next[pkgIdx].inclusions];
    inc[incIdx] = value;
    next[pkgIdx] = { ...next[pkgIdx], inclusions: inc };
    setPackages(next);
  }

  function canProceed(): boolean {
    if (step === 0) return title.trim().length >= 3 && description.trim().length >= 10;
    if (step === 1) {
      if (pricingModel === "package") return packages.some((p) => p.name && p.priceCents > 0);
      return pricingModel === "contact" || priceCents >= 0;
    }
    if (step === 2) return true;
    return true;
  }

  async function handleSubmit() {
    if (!authenticated) {
      await createSession();
    }
    setSubmitting(true);
    setError(null);
    try {
      const parsedTags = tagsStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const parsedMedia = mediaUrlsStr
        .split("\n")
        .map((u) => u.trim())
        .filter((u) => u.startsWith("http"));

      const packagesData = pricingModel === "package"
        ? packages
            .filter((p) => p.name && p.priceCents > 0)
            .map((p, i) => ({
              name: p.name,
              description: p.description,
              priceCents: p.priceCents,
              deliveryDays: p.deliveryDays ? parseInt(p.deliveryDays) : undefined,
              inclusions: p.inclusions.filter(Boolean),
              sortOrder: i,
            }))
        : undefined;

      const result = await createListing({
        title: title.trim(),
        categoryId: categoryId || undefined,
        description: description.trim(),
        pricingModel,
        priceCents: pricingModel === "contact" ? 0 : priceCents,
        deliveryDays: deliveryDays ? parseInt(deliveryDays) : undefined,
        durationMinutes: durationMinutes ? parseInt(durationMinutes) : undefined,
        isOnline,
        location: location.trim() || undefined,
        tags: parsedTags,
        mediaUrls: parsedMedia,
        packages: packagesData,
      });

      navigate(`/marketplace/l/${result.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create listing.");
    }
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen">
      <SeoHead title="Create Listing — Magic Shop" description="Offer your magical services on MagusMe." path="/marketplace/create" />

      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-indigo-900/5 to-transparent" />
        <div className="relative mx-auto max-w-3xl px-5 py-8 md:px-8">
          <Link to="/marketplace" className="mb-4 inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300">
            <ArrowLeft className="h-3 w-3" />
            Back to Marketplace
          </Link>
          <h1 className="font-serif text-2xl font-bold text-white">Create a Listing</h1>
          <p className="mt-1 text-sm text-zinc-500">Offer your magical services to the community.</p>

          {/* Progress */}
          <div className="mt-6 flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition ${
                    i < step
                      ? "bg-emerald-500 text-white"
                      : i === step
                        ? "bg-purple-600 text-white"
                        : "border border-white/10 text-zinc-600"
                  }`}
                >
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </button>
                <span className={`hidden text-xs sm:inline ${i === step ? "text-zinc-300" : "text-zinc-600"}`}>
                  {s.title}
                </span>
                {i < STEPS.length - 1 && <div className="h-px w-6 bg-white/10" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-8 md:px-8">
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Step 0: Basics */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                Service Title <span className="text-red-400">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Full Tarot Reading with 3-Card Spread"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-500/40"
              />
              <p className="mt-1 text-[10px] text-zinc-600">{title.length}/80 characters</p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-purple-500/40"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="Describe what you offer, how it works, what the buyer receives..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-500/40"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">Online Service?</label>
                <button
                  onClick={() => setIsOnline(!isOnline)}
                  className={`w-full rounded-xl border px-4 py-3 text-sm transition ${
                    isOnline
                      ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
                      : "border-white/10 text-zinc-500 hover:border-white/20"
                  }`}
                >
                  {isOnline ? "Yes (remote)" : "No (in-person)"}
                </button>
              </div>
              {!isOnline && (
                <div className="flex-1">
                  <label className="mb-1.5 block text-sm font-medium text-zinc-300">Location</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-500/40"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 1: Pricing */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">Pricing Model</label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(["fixed", "hourly", "package", "contact"] as const).map((pm) => (
                  <button
                    key={pm}
                    onClick={() => setPricingModel(pm)}
                    className={`rounded-xl border px-4 py-3 text-sm transition ${
                      pricingModel === pm
                        ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
                        : "border-white/10 text-zinc-500 hover:border-white/20"
                    }`}
                  >
                    {pm.charAt(0).toUpperCase() + pm.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {pricingModel !== "package" && pricingModel !== "contact" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                  Price (in USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500">$</span>
                  <input
                    type="number"
                    min={0}
                    value={priceCents / 100}
                    onChange={(e) => setPriceCents(Math.round(parseFloat(e.target.value) * 100))}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-8 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-500/40"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">Delivery Time (days)</label>
                <input
                  type="number"
                  min={0}
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-500/40"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">Duration (minutes)</label>
                <input
                  type="number"
                  min={0}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  placeholder="e.g. 30"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-500/40"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Packages */}
        {step === 2 && (
          <div className="space-y-6">
            {pricingModel === "package" ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-400">Create tiered packages for your service</p>
                  <button
                    onClick={handleAddPackage}
                    className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-400 hover:border-white/20"
                  >
                    <Plus className="h-3 w-3" />
                    Add Package
                  </button>
                </div>
                {packages.map((pkg, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white">Package {i + 1}</h3>
                      {packages.length > 1 && (
                        <button onClick={() => handleRemovePackage(i)} className="text-zinc-600 hover:text-red-400">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="mb-1 text-xs text-zinc-500">Name</label>
                          <input
                            value={pkg.name}
                            onChange={(e) => handlePackageChange(i, "name", e.target.value)}
                            placeholder="Basic / Standard / Premium"
                            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-purple-500/40"
                          />
                        </div>
                        <div className="w-32">
                          <label className="mb-1 text-xs text-zinc-500">Price ($)</label>
                          <input
                            type="number"
                            min={0}
                            value={pkg.priceCents / 100}
                            onChange={(e) => handlePackageChange(i, "priceCents", Math.round(parseFloat(e.target.value) * 100))}
                            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-purple-500/40"
                          />
                        </div>
                        <div className="w-24">
                          <label className="mb-1 text-xs text-zinc-500">Delivery (d)</label>
                          <input
                            type="number"
                            min={0}
                            value={pkg.deliveryDays}
                            onChange={(e) => handlePackageChange(i, "deliveryDays", e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-purple-500/40"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 text-xs text-zinc-500">Description</label>
                        <input
                          value={pkg.description}
                          onChange={(e) => handlePackageChange(i, "description", e.target.value)}
                          placeholder="What this package includes..."
                          className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-purple-500/40"
                        />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <label className="text-xs text-zinc-500">Inclusions</label>
                          <button
                            onClick={() => handleAddInclusion(i)}
                            className="text-[10px] text-purple-400 hover:text-purple-300"
                          >
                            + Add item
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {pkg.inclusions.map((inc, j) => (
                            <div key={j} className="flex items-center gap-2">
                              <input
                                value={inc}
                                onChange={(e) => handleInclusionChange(i, j, e.target.value)}
                                placeholder="e.g. 3-card spread with written analysis"
                                className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white outline-none focus:border-purple-500/40"
                              />
                              <button
                                onClick={() => handleRemoveInclusion(i, j)}
                                className="text-zinc-600 hover:text-red-400"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center">
                <Sparkles className="mx-auto mb-2 h-5 w-5 text-zinc-500" />
                <p className="text-sm text-zinc-400">
                  Packages are for the &ldquo;Package&rdquo; pricing model. You selected <strong>{pricingModel}</strong>.
                </p>
              </div>
            )}

            {/* Tags & Media */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">Tags</label>
                <input
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="tarot, love reading, relationship, spiritual (comma separated)"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-500/40"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">Media URLs</label>
                <textarea
                  value={mediaUrlsStr}
                  onChange={(e) => setMediaUrlsStr(e.target.value)}
                  rows={3}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-500/40"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2 text-sm text-emerald-300">
                <Check className="h-4 w-4" />
                Review your listing before publishing
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-zinc-500">Title</span>
                  <p className="text-white">{title}</p>
                </div>
                <div>
                  <span className="text-xs text-zinc-500">Category</span>
                  <p className="text-white">{categories.find((c) => c.id === categoryId)?.name ?? "None"}</p>
                </div>
                <div>
                  <span className="text-xs text-zinc-500">Pricing Model</span>
                  <p className="text-white capitalize">{pricingModel}</p>
                </div>
                <div>
                  <span className="text-xs text-zinc-500">Price</span>
                  <p className="text-emerald-400 font-bold">
                    {pricingModel === "contact" ? "Contact" : `$${(priceCents / 100).toFixed(0)}`}
                  </p>
                </div>
                {deliveryDays && (
                  <div>
                    <span className="text-xs text-zinc-500">Delivery</span>
                    <p className="text-white">{deliveryDays} days</p>
                  </div>
                )}
                <div>
                  <span className="text-xs text-zinc-500">Service Type</span>
                  <p className="text-white">{isOnline ? "Online" : "In-person"}</p>
                </div>
              </div>
              <div>
                <span className="text-xs text-zinc-500">Description</span>
                <p className="mt-1 text-sm text-zinc-400 line-clamp-3">{description}</p>
              </div>
              {pricingModel === "package" && packages.filter((p) => p.name).length > 0 && (
                <div>
                  <span className="text-xs text-zinc-500">Packages ({packages.filter((p) => p.name).length})</span>
                  <div className="mt-1 space-y-1">
                    {packages.filter((p) => p.name).map((p, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-sm">
                        <span className="text-zinc-300">{p.name}</span>
                        <span className="text-emerald-400">${(p.priceCents / 100).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tagsStr && (
                <div>
                  <span className="text-xs text-zinc-500">Tags</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {tagsStr.split(",").map((t, i) => t.trim() && (
                      <span key={i} className="rounded bg-white/[0.03] px-2 py-0.5 text-[10px] text-zinc-500">{t.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center gap-1 rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-400 transition hover:border-white/20 disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-1 rounded-full bg-purple-600 px-6 py-2 text-sm text-white transition hover:bg-purple-500 disabled:opacity-30"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {submitting ? "Publishing..." : "Publish Listing"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
