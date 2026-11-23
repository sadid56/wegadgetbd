"use client";

import { useEffect, useRef, type RefObject } from "react";

interface UseClickOutsideOptions {
  enabled?: boolean;
  closeOnEscape?: boolean;
}

/** Calls `onOutside` when clicking/tapping outside `ref` (or pressing Escape if `closeOnEscape` is true). */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutside: () => void,
  options: UseClickOutsideOptions = {},
) {
  const { enabled = true, closeOnEscape = true } = options;
  const onOutsideRef = useRef(onOutside);
  onOutsideRef.current = onOutside;

  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutsideRef.current();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape") {
        onOutsideRef.current();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    if (closeOnEscape) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      if (closeOnEscape) {
        document.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [ref, enabled, closeOnEscape]);
}
