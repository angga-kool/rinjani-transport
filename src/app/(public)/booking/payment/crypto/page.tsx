"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Copy, Check, Clock, CheckCircle2, AlertCircle, Loader2, Shield, ExternalLink, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentData {
  id: string;
  walletAddress: string;
  network: string;
  symbol: string;
  amountUSDT: number;
  uniqueAmount: number;
}

export default function CryptoPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingCode = searchParams.get("code") || "";
  const amountParam = parseFloat(searchParams.get("amount") || "0");

  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [explorerUrl, setExplorerUrl] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!bookingCode || !amountParam) return;
    (async () => {
      try {
        const res = await fetch("/api/payment/crypto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingCode, network: "trc20", amountUSDT: amountParam }),
        });
        if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
        const data = await res.json();
        setPayment(data.payment);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed");
      } finally { setLoading(false); }
    })();
  }, [bookingCode, amountParam]);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!payment || verified) return;
    pollRef.current = setInterval(() => verify(), 20000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [payment, verified]);

  const verify = useCallback(async () => {
    if (!payment || checking || verified) return;
    setChecking(true);
    setCheckCount(p => p + 1);
    try {
      const res = await fetch("/api/payment/crypto/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingCode, network: "trc20", paymentId: payment.id }),
      });
      const data = await res.json();
      if (data.verified) {
        setVerified(true);
        setTxHash(data.txHash || "");
        setExplorerUrl(data.explorerUrl || "");
        if (pollRef.current) clearInterval(pollRef.current);
        toast.success("Payment confirmed!");
      }
    } catch {} finally { setChecking(false); }
  }, [payment, checking, verified, bookingCode]);

  const copy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const qrUrl = payment
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(payment.walletAddress)}&margin=6&format=svg`
    : "";

  if (!bookingCode || !amountParam) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">Invalid payment link.</p>
          <Link href="/booking/search" className="mt-3 inline-block text-sm text-primary hover:underline">← Start new booking</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-3 text-sm text-gray-500">Preparing payment...</p>
        </div>
      </div>
    );
  }

  // === SUCCESS ===
  if (verified) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16">
        <div className="rounded-3xl bg-gradient-to-b from-green-50 to-white border border-green-100 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 ring-8 ring-green-50">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="mt-5 text-xl font-bold text-gray-900">Payment Confirmed</h1>
          <p className="mt-1.5 text-sm text-gray-500">USDT verified on Tron (TRC20)</p>

          {txHash && (
            <div className="mt-5 rounded-xl bg-white border border-gray-100 p-3 text-left">
              <p className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold">Transaction</p>
              <p className="mt-1 break-all font-mono text-[10px] leading-relaxed text-gray-600">{txHash}</p>
              {explorerUrl && (
                <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                  <ExternalLink className="h-3 w-3" /> View on TronScan
                </a>
              )}
            </div>
          )}

          <Link href={`/booking/success?code=${bookingCode}`} className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-md shadow-primary/20 hover:shadow-lg transition-shadow">
            View E-Ticket →
          </Link>
        </div>
      </div>
    );
  }

  // === PAYMENT SCREEN ===
  return (
    <div className="mx-auto max-w-[420px] px-4 py-6">
      {/* Branding Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
            <Shield className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">USDT Payment</p>
            <p className="text-[10px] text-gray-400">Tron • TRC20</p>
          </div>
        </div>
        <div className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5", timeLeft < 300 ? "bg-red-50" : "bg-gray-100")}>
          <Clock className={cn("h-3 w-3", timeLeft < 300 ? "text-red-500" : "text-gray-400")} />
          <span className={cn("font-mono text-xs font-semibold", timeLeft < 300 ? "text-red-600" : "text-gray-600")}>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {payment && (
        <div className="rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-100/50 overflow-hidden">
          {/* Amount Header */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-6 py-5 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Send Exactly</p>
            <div className="mt-1 flex items-baseline justify-center gap-1.5">
              <span className="text-4xl font-extrabold text-white">{payment.uniqueAmount.toFixed(2)}</span>
              <span className="text-lg font-semibold text-gray-400">USDT</span>
            </div>
            <button
              onClick={() => copy(payment.uniqueAmount.toFixed(2), "amt")}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/80 hover:bg-white/20 backdrop-blur-sm transition-colors"
            >
              {copiedField === "amt" ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
              {copiedField === "amt" ? "Copied!" : "Copy Amount"}
            </button>
          </div>

          {/* QR + Address */}
          <div className="p-6 space-y-5">
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="rounded-2xl border-2 border-gray-100 bg-white p-2.5 shadow-sm">
                <img src={qrUrl} alt="Wallet QR" width={160} height={160} className="rounded-xl" />
              </div>
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Wallet Address</p>
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">TRC20</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-100 p-2.5">
                <code className="flex-1 break-all text-[11px] font-mono text-gray-700 leading-relaxed select-all">
                  {payment.walletAddress}
                </code>
                <button
                  onClick={() => copy(payment.walletAddress, "addr")}
                  className={cn(
                    "shrink-0 rounded-lg p-2 transition-all",
                    copiedField === "addr" ? "bg-green-100 text-green-600" : "bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  {copiedField === "addr" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Live Verification Status */}
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {checking ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  ) : (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>
                  )}
                  <div>
                    <p className="text-[11px] font-medium text-gray-700">{checking ? "Verifying..." : "Listening"}</p>
                    <p className="text-[9px] text-gray-400">{checkCount} check{checkCount !== 1 ? "s" : ""} • auto every 20s</p>
                  </div>
                </div>
                <button
                  onClick={verify}
                  disabled={checking}
                  className="rounded-lg bg-white border border-gray-200 p-1.5 text-gray-400 hover:text-gray-600 hover:border-gray-300 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={cn("h-3.5 w-3.5", checking && "animate-spin")} />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-3.5">
            <p className="text-center text-[10px] text-gray-400 leading-relaxed">
              Send exact amount on <strong className="text-gray-500">TRC20 only</strong>. Do not close this page.
              <br />Payment auto-detected in 1-3 minutes after blockchain confirmation.
            </p>
          </div>
        </div>
      )}

      {/* Booking Reference */}
      <div className="mt-4 text-center">
        <p className="text-[10px] text-gray-400">Booking: <span className="font-mono font-semibold text-gray-500">{bookingCode}</span></p>
      </div>
    </div>
  );
}
