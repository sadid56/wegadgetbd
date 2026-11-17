"use client";

import { useCallback, useEffect, useState } from "react";
import { PromoCodeEndpoints } from "@/query-client/promo-codes";

export interface AppliedPromo {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  discountAmount: number;
}

const STORAGE_KEY = "wegadget_applied_promo";

export function usePromoCode(subtotal: number) {
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Load saved promo code on mount and re-validate against current subtotal
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw || subtotal <= 0) {
      if (!raw) setAppliedPromo(null);
      return;
    }

    let cancelled = false;
    try {
      const parsed = JSON.parse(raw) as { code?: string };
      if (!parsed?.code) return;

      PromoCodeEndpoints.validate({ code: parsed.code, subtotal })
        .then((res) => {
          if (cancelled) return;
          if (res.valid && res.code && res.discountAmount !== undefined) {
            setAppliedPromo({
              code: res.code,
              discountType: res.discountType ?? "FIXED",
              discountValue: res.discountValue ?? res.discountAmount,
              discountAmount: res.discountAmount,
            });
            setPromoError(null);
          } else {
            window.localStorage.removeItem(STORAGE_KEY);
            setAppliedPromo(null);
          }
        })
        .catch(() => {
          // Ignore silent re-validation failures
        });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }

    return () => {
      cancelled = true;
    };
  }, [subtotal]);

  const applyPromoCode = useCallback(
    async (codeInput: string): Promise<{ success: boolean; message: string }> => {
      const trimmed = codeInput.trim().toUpperCase();
      if (!trimmed) {
        const msg = "Please enter a promo code.";
        setPromoError(msg);
        return { success: false, message: msg };
      }

      setIsValidating(true);
      setPromoError(null);
      try {
        const res = await PromoCodeEndpoints.validate({ code: trimmed, subtotal });
        if (!res.valid || !res.code || res.discountAmount === undefined) {
          const msg = res.message || "Invalid promo code.";
          setPromoError(msg);
          return { success: false, message: msg };
        }

        const nextPromo: AppliedPromo = {
          code: res.code,
          discountType: res.discountType ?? "FIXED",
          discountValue: res.discountValue ?? res.discountAmount,
          discountAmount: res.discountAmount,
        };
        setAppliedPromo(nextPromo);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ code: nextPromo.code }));
        }
        return {
          success: true,
          message: res.message || `Promo code "${res.code}" applied!`,
        };
      } catch (err: any) {
        const msg = err?.message || "Failed to validate promo code.";
        setPromoError(msg);
        return { success: false, message: msg };
      } finally {
        setIsValidating(false);
      }
    },
    [subtotal]
  );

  const removePromoCode = useCallback(() => {
    setAppliedPromo(null);
    setPromoError(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    appliedPromo,
    isValidating,
    promoError,
    setPromoError,
    applyPromoCode,
    removePromoCode,
  };
}
