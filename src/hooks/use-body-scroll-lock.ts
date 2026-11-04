import { useEffect } from "react";

/**
 * Custom hook to lock body scrolling when a modal, drawer, or overlay is open.
 * Restores original body styles upon unmount or when locked becomes false.
 *
 * @param locked Whether the body scroll should be locked
 */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked || typeof document === "undefined") return;

    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.overscrollBehavior = prevOverscroll;
    };
  }, [locked]);
}

export default useBodyScrollLock;

