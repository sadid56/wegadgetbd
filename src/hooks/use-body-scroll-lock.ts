import { useEffect } from "react";

/**
 * Custom hook to lock body and document scrolling when a modal, drawer, or overlay is open.
 * Prevents background scroll on desktop and mobile (iOS Safari, Android Chrome).
 * Restores original scroll position upon unmount or when locked becomes false.
 *
 * @param locked Whether the background scroll should be locked
 */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked || typeof window === "undefined" || typeof document === "undefined") return;

    const scrollY = window.scrollY;

    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyWidth = document.body.style.width;
    const originalBodyOverscroll = document.body.style.overscrollBehavior;

    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    // Lock both documentElement (html) and body
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;

      document.body.style.overflow = originalBodyOverflow;
      document.body.style.overscrollBehavior = originalBodyOverscroll;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;

      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}

export default useBodyScrollLock;


