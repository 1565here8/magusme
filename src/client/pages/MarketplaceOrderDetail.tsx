import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Send, Loader2, AlertTriangle, CheckCircle2,
  Clock, XCircle, Shield, Star, MessageSquare, User,
  Wallet, ExternalLink, DollarSign,
} from "lucide-react";
import { SeoHead } from "../components/SeoHead";
import { useSession } from "../context/SessionContext";
import {
  fetchOrder,
  fetchOrderMessages,
  sendOrderMessage,
  updateOrderStatus,
  cancelOrder,
  submitReview,
  type ServiceOrderDetail,
  type ServiceOrderMessage,
} from "../api/marketplaceClient";

const STATUS_FLOW = ["pending", "confirmed", "in_progress", "completed"];

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  disputed: "Disputed",
  refunded: "Refunded",
};

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    confirmed: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    in_progress: "bg-purple-500/10 text-purple-300 border-purple-500/20",
    completed: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    cancelled: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    disputed: "bg-red-500/10 text-red-300 border-red-500/20",
    refunded: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${colors[status] ?? colors.pending}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

interface Action {
  label: string;
  action: string;
  color: string;
  confirm?: string;
  requiresNotes?: boolean;
  notesLabel?: string;
  notesPlaceholder?: string;
}

const SELLER_ACTIONS: Record<string, Action[]> = {
  pending: [
    { label: "Accept Order", action: "confirmed", color: "bg-emerald-600 hover:bg-emerald-500", requiresNotes: true, notesLabel: "Message to buyer", notesPlaceholder: "Thanks for your order! I'll start working on it shortly." },
    { label: "Decline", action: "cancelled", color: "bg-red-600 hover:bg-red-500", confirm: "Cancel this order?" },
  ],
  confirmed: [
    { label: "Start Work", action: "in_progress", color: "bg-purple-600 hover:bg-purple-500" },
    { label: "Cancel", action: "cancelled", color: "bg-red-600 hover:bg-red-500", confirm: "Cancel this order?" },
  ],
  in_progress: [
    { label: "Mark Complete", action: "completed", color: "bg-emerald-600 hover:bg-emerald-500", requiresNotes: true, notesLabel: "Delivery notes", notesPlaceholder: "Describe what was delivered..." },
  ],
};

const BUYER_ACTIONS: Record<string, Action[]> = {
  pending: [
    { label: "Cancel Order", action: "cancelled", color: "bg-red-600 hover:bg-red-500", confirm: "Cancel this order?" },
  ],
  confirmed: [
    { label: "Cancel Order", action: "cancelled", color: "bg-red-600 hover:bg-red-500", confirm: "Cancel this order?" },
  ],
};

export function MarketplaceOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [order, setOrder] = useState<ServiceOrderDetail | null>(null);
  const [messages, setMessages] = useState<ServiceOrderMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [msgInput, setMsgInput] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionNotes, setActionNotes] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewBody, setReviewBody] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<{
    status: string;
    checkoutUrl: string | null;
    amountCents: number;
    platformFeeCents: number;
    sellerPayoutCents: number;
    settledAt: string | null;
    paidAt: string | null;
  } | null>(null);

  useEffect(() => {
    if (!id) return;
    loadOrder();
  }, [id]);

  async function loadOrder() {
    if (!id) return;
    setLoading(true);
    try {
      const [o, m] = await Promise.all([
        fetchOrder(id),
        fetchOrderMessages(id),
      ]);
      setOrder(o);
      setMessages(m.messages);
      try {
        const invRes = await fetch(`/api/marketplace/payments/invoice/${id}`, { credentials: "include" });
        if (invRes.ok) {
          const invData = await invRes.json();
          setInvoice(invData.invoice ?? null);
        }
      } catch { /* no invoice yet */ }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order.");
    }
    setLoading(false);
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSendMessage() {
    if (!id || !msgInput.trim()) return;
    setSendingMsg(true);
    try {
      const msg = await sendOrderMessage(id, msgInput.trim());
      setMessages([...messages, msg]);
      setMsgInput("");
    } catch { /* ignore */ }
    setSendingMsg(false);
  }

  async function handleAction(action: string, notes?: string) {
    if (!id) return;
    setActionLoading(action);
    try {
      await updateOrderStatus(id, action, {
        sellerNotes: notes || undefined,
        deliveryNotes: notes || undefined,
      });
      await loadOrder();
      setActionNotes("");
    } catch { /* ignore */ }
    setActionLoading(null);
  }

  async function handleCancel() {
    if (!id) return;
    setActionLoading("cancel");
    try {
      await cancelOrder(id);
      await loadOrder();
    } catch { /* ignore */ }
    setActionLoading(null);
  }

  async function handleSubmitReview() {
    if (!id) return;
    setSubmittingReview(true);
    setReviewError(null);
    try {
      await submitReview(id, { rating: reviewRating, body: reviewBody.trim() });
      setShowReviewForm(false);
      setReviewBody("");
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : "Failed to submit review.");
    }
    setSubmittingReview(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-20 text-center">
        <AlertTriangle className="mx-auto mb-4 h-8 w-8 text-red-400" />
        <h1 className="mb-2 font-serif text-xl font-bold text-white">Order Not Found</h1>
        <p className="mb-6 text-sm text-zinc-500">{error ?? "This order doesn't exist."}</p>
        <Link to="/marketplace/orders" className="rounded-full bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-500">
          My Orders
        </Link>
      </div>
    );
  }

  const isBuyer = order.buyerId === user?.id;
  const isSeller = order.sellerId === user?.id;
  const sellerActs = SELLER_ACTIONS[order.status] ?? [];
  const buyerActs = BUYER_ACTIONS[order.status] ?? [];
  const actions = isSeller ? sellerActs : isBuyer ? buyerActs : [];
  const canReview = isBuyer && order.status === "completed";

  return (
    <div className="min-h-screen">
      <SeoHead title={`Order #${id?.slice(-8)} — Magic Shop`} description="Order details" path={`/marketplace/orders/${id}`} />

      <section className="border-b border-white/5">
        <div className="mx-auto max-w-4xl px-5 py-4 md:px-8">
          <Link to="/marketplace/orders" className="mb-3 inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300">
            <ArrowLeft className="h-3 w-3" />
            Back to Orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-xl font-bold text-white">Order #{id?.slice(-8)}</h1>
              <p className="mt-1 text-xs text-zinc-500">
                {formatDate(order.createdAt)} · ${(order.amountCents / 100).toFixed(0)}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 py-6 md:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chat + Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status timeline */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="mb-3 text-sm font-medium text-white">Timeline</h3>
              <div className="flex items-center gap-1">
                {STATUS_FLOW.map((s, i) => {
                  const idx = STATUS_FLOW.indexOf(order.status);
                  const done = i <= idx;
                  const current = i === idx;
                  return (
                    <div key={s} className="flex items-center gap-1 flex-1">
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        done ? "bg-emerald-500/20 text-emerald-400" : "bg-white/[0.03] text-zinc-600"
                      } ${current ? "ring-2 ring-emerald-500/30" : ""}`}>
                        {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                      </div>
                      {i < STATUS_FLOW.length - 1 && (
                        <div className={`h-px flex-1 ${done ? "bg-emerald-500/30" : "bg-white/10"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 flex text-[10px] text-zinc-600">
                {STATUS_FLOW.map((s) => (
                  <span key={s} className="flex-1">{STATUS_LABELS[s]}</span>
                ))}
              </div>
            </div>

            {/* Delivery notes */}
            {order.deliveryNotes && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <h3 className="mb-2 text-xs font-medium text-emerald-400">Delivery</h3>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{order.deliveryNotes}</p>
              </div>
            )}

            {/* Messages */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="border-b border-white/10 px-5 py-3">
                <h3 className="flex items-center gap-2 text-sm font-medium text-white">
                  <MessageSquare className="h-4 w-4" />
                  Conversation
                </h3>
              </div>
              <div className="max-h-80 space-y-3 overflow-y-auto px-5 py-4">
                {messages.length === 0 ? (
                  <p className="text-center text-xs text-zinc-600">No messages yet.</p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] rounded-xl px-4 py-2.5 ${
                        msg.senderId === user?.id
                          ? "bg-purple-600/20 text-zinc-200"
                          : "bg-white/[0.03] text-zinc-300"
                      }`}>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-[10px] text-zinc-500">@{msg.senderHandle}</span>
                        </div>
                        <p className="text-sm">{msg.body}</p>
                        <p className="mt-1 text-[10px] text-zinc-600">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="border-t border-white/10 px-5 py-3">
                <div className="flex items-center gap-2">
                  <input
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                    placeholder="Type a message..."
                    className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-purple-500/40"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sendingMsg || !msgInput.trim()}
                    className="rounded-lg bg-purple-600 p-2 text-white transition hover:bg-purple-500 disabled:opacity-30"
                  >
                    {sendingMsg ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Order info */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <h3 className="mb-3 text-sm font-medium text-white">Order Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Listing</span>
                  <Link to={`/marketplace/l/${order.listingSlug}`} className="text-purple-400 hover:text-purple-300 truncate ml-2">
                    {order.listingTitle}
                  </Link>
                </div>
                {order.packageName && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Package</span>
                    <span className="text-zinc-300">{order.packageName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-zinc-500">Amount</span>
                  <span className="text-emerald-400 font-bold">${(order.amountCents / 100).toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Buyer</span>
                  <span className="text-zinc-300">@{order.buyerHandle ?? "Anonymous"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Seller</span>
                  <span className="text-zinc-300">@{order.sellerHandle ?? "Anonymous"}</span>
                </div>
                {order.confirmedAt && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Confirmed</span>
                    <span className="text-zinc-300">{formatDate(order.confirmedAt)}</span>
                  </div>
                )}
                {order.completedAt && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Completed</span>
                    <span className="text-zinc-300">{formatDate(order.completedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Buyer instructions */}
            {order.buyerInstructions && (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <h3 className="mb-2 text-sm font-medium text-white">Buyer Instructions</h3>
                <p className="text-sm text-zinc-400 whitespace-pre-wrap">{order.buyerInstructions}</p>
              </div>
            )}

            {/* Actions */}
            {actions.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                <h3 className="text-sm font-medium text-white">Actions</h3>
                {actions.map((act) => (
                  <div key={act.action}>
                    {act.requiresNotes && (
                      <textarea
                        value={actionNotes}
                        onChange={(e) => setActionNotes(e.target.value)}
                        placeholder={act.notesPlaceholder ?? ""}
                        rows={2}
                        className="mb-2 w-full rounded-lg border border-white/10 bg-white/[0.03] p-2.5 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-purple-500/40"
                      />
                    )}
                    <button
                      onClick={() => {
                        if (act.confirm && !window.confirm(act.confirm)) return;
                        handleAction(act.action, act.requiresNotes ? actionNotes : undefined);
                      }}
                      disabled={actionLoading === act.action}
                      className={`w-full rounded-lg py-2 text-xs font-medium text-white transition disabled:opacity-50 ${act.color}`}
                    >
                      {actionLoading === act.action ? (
                        <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                      ) : (
                        act.label
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Payment */}
            {invoice && (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-medium text-white">
                    <DollarSign className="h-4 w-4 text-purple-400" />
                    Payment
                  </h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                    invoice.status === "settled" ? "bg-emerald-500/10 text-emerald-300" :
                    invoice.status === "paid" ? "bg-blue-500/10 text-blue-300" :
                    invoice.status === "pending" ? "bg-amber-500/10 text-amber-300" :
                    invoice.status === "expired" ? "bg-red-500/10 text-red-300" :
                    "bg-zinc-500/10 text-zinc-400"
                  }`}>{invoice.status}</span>
                </div>
                <div className="mt-2 space-y-1 text-xs text-zinc-400">
                  <p>Total: ${(invoice.amountCents / 100).toFixed(2)}</p>
                  {invoice.platformFeeCents > 0 && (
                    <p>Platform fee (5%): ${(invoice.platformFeeCents / 100).toFixed(2)}</p>
                  )}
                  {isSeller && invoice.sellerPayoutCents > 0 && (
                    <p className="text-emerald-400/70">Your payout: ${(invoice.sellerPayoutCents / 100).toFixed(2)}</p>
                  )}
                  {invoice.paidAt && (
                    <p>Paid: {new Date(invoice.paidAt).toLocaleDateString()}</p>
                  )}
                  {invoice.settledAt && (
                    <p>Payout sent: {new Date(invoice.settledAt).toLocaleDateString()}</p>
                  )}
                </div>
                {isBuyer && invoice.status === "pending" && invoice.checkoutUrl && (
                  <a
                    href={invoice.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Pay Now — ${(invoice.amountCents / 100).toFixed(2)}
                  </a>
                )}
                {isSeller && invoice.status === "pending" && (
                  <p className="mt-2 text-xs text-amber-400">Awaiting buyer payment.</p>
                )}
                {isSeller && invoice.status === "paid" && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-amber-400">
                    <Clock className="h-3 w-3" />
                    Buyer paid — payout processing.
                  </p>
                )}
                {invoice.status === "settled" && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    {isSeller ? "Payout sent to your wallet." : "Payment complete."}
                  </p>
                )}
              </div>
            )}

            {/* Review */}
            {canReview && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left transition hover:border-purple-500/30"
              >
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium text-white">Leave a Review</span>
                </div>
              </button>
            )}
            {canReview && showReviewForm && (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                <h3 className="text-sm font-medium text-white">Write a Review</h3>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button key={r} onClick={() => setReviewRating(r)}>
                      <Star className={`h-5 w-5 ${r <= reviewRating ? "text-amber-400 fill-amber-400" : "text-zinc-600"}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  rows={3}
                  placeholder="Share your experience..."
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-purple-500/40"
                />
                {reviewError && (
                  <p className="text-xs text-red-400">{reviewError}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="flex-1 rounded-lg border border-white/10 py-2 text-xs text-zinc-400 hover:border-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    disabled={submittingReview || reviewBody.trim().length < 10}
                    className="flex-1 rounded-lg bg-amber-600 py-2 text-xs font-medium text-white hover:bg-amber-500 disabled:opacity-50"
                  >
                    {submittingReview ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Submit Review"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
