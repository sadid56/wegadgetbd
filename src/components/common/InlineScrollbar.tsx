"use client";

import {
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Box from "@mui/material/Box";
import { tokens } from "@/theme/theme";

const BASE_MARGIN = 10;
const MIN_THUMB_HEIGHT = 36;
const MIN_SCROLLABLE_PX = 2;
const IDLE_OPACITY = "0.4";
const ACTIVE_OPACITY = "1";
const FADE_DELAY_MS = 900;

interface ThumbMetrics {
  maxScroll: number;
  maxThumbTop: number;
  thumbHeight: number;
  thumbTop: number;
}

function getScrollTop(): number {
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

function getBoundaryOffsets(): { topOffset: number; bottomOffset: number } {
  let topOffset = BASE_MARGIN;
  let bottomOffset = BASE_MARGIN;

  if (typeof document === "undefined" || typeof window === "undefined") {
    return { topOffset, bottomOffset };
  }

  // Header / Navbar boundary check
  const header = document.querySelector("header");
  if (header) {
    const headerRect = header.getBoundingClientRect();
    if (headerRect.bottom > 0) {
      topOffset = Math.max(Math.round(headerRect.bottom) + 8, BASE_MARGIN);
    }
  }

  // Footer boundary check (stops above footer if visible in viewport)
  const footer = document.querySelector("footer");
  if (footer) {
    const footerRect = footer.getBoundingClientRect();
    if (footerRect.top < window.innerHeight) {
      const footerVisible = window.innerHeight - footerRect.top;
      bottomOffset = Math.max(Math.round(footerVisible) + 8, BASE_MARGIN);
    }
  }

  return { topOffset, bottomOffset };
}

function computeThumbMetrics(topOffset: number, bottomOffset: number): ThumbMetrics | null {
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = window.innerHeight;
  const maxScroll = scrollHeight - clientHeight;

  if (maxScroll <= MIN_SCROLLABLE_PX) return null;

  const trackHeight = clientHeight - topOffset - bottomOffset;
  if (trackHeight < MIN_THUMB_HEIGHT + 8) return null;

  const thumbHeight = Math.max(
    (clientHeight / scrollHeight) * trackHeight,
    MIN_THUMB_HEIGHT,
  );
  const maxThumbTop = Math.max(trackHeight - thumbHeight, 1);
  const thumbTop = (getScrollTop() / maxScroll) * maxThumbTop;

  return { maxScroll, maxThumbTop, thumbHeight, thumbTop };
}

function applyThumbGeometry(thumb: HTMLDivElement, metrics: ThumbMetrics): void {
  thumb.style.height = `${metrics.thumbHeight}px`;
  thumb.style.transform = `translate3d(0, ${metrics.thumbTop}px, 0)`;
}

export function InlineScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startY: number;
    startScrollTop: number;
  } | null>(null);

  useEffect(() => {
    const cancelFade = () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };

    const refresh = (keepVisible: boolean) => {
      const track = trackRef.current;
      const thumb = thumbRef.current;
      if (!track || !thumb) return;

      const { topOffset, bottomOffset } = getBoundaryOffsets();
      track.style.top = `${topOffset}px`;
      track.style.bottom = `${bottomOffset}px`;

      const metrics = computeThumbMetrics(topOffset, bottomOffset);
      if (!metrics) {
        track.style.opacity = "0";
        track.style.pointerEvents = "none";
        return;
      }

      track.style.pointerEvents = "auto";
      applyThumbGeometry(thumb, metrics);

      if (keepVisible || dragRef.current) {
        track.style.opacity = ACTIVE_OPACITY;
        cancelFade();
        if (!dragRef.current) {
          hideTimerRef.current = setTimeout(() => {
            if (trackRef.current && !dragRef.current) {
              trackRef.current.style.opacity = IDLE_OPACITY;
            }
          }, FADE_DELAY_MS);
        }
      } else if (track.style.opacity === "" || track.style.opacity === "0") {
        track.style.opacity = IDLE_OPACITY;
      }
    };

    let rafId = 0;

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => refresh(true));
    };

    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => refresh(false));
    };

    refresh(false);

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", onResize, { passive: true });

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(document.body);

    return () => {
      cancelAnimationFrame(rafId);
      cancelFade();
      dragRef.current = null;
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
    };
  }, []);

  const handleThumbPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const thumb = thumbRef.current;
    if (!thumb) return;

    thumb.setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startY: e.clientY,
      startScrollTop: getScrollTop(),
    };

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (trackRef.current) trackRef.current.style.opacity = ACTIVE_OPACITY;
  };

  const handleThumbPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const { topOffset, bottomOffset } = getBoundaryOffsets();
    const metrics = computeThumbMetrics(topOffset, bottomOffset);
    if (!metrics) return;

    const deltaY = e.clientY - drag.startY;
    const scrollDelta = (deltaY / metrics.maxThumbTop) * metrics.maxScroll;
    window.scrollTo({ top: drag.startScrollTop + scrollDelta });
  };

  const handleThumbPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const thumb = thumbRef.current;
    if (thumb?.hasPointerCapture(e.pointerId)) {
      thumb.releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
    if (trackRef.current) trackRef.current.style.opacity = IDLE_OPACITY;
  };

  const handleTrackClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (e.target === thumbRef.current) return;
    const track = trackRef.current;
    if (!track) return;

    const { topOffset, bottomOffset } = getBoundaryOffsets();
    const metrics = computeThumbMetrics(topOffset, bottomOffset);
    if (!metrics) return;

    const rect = track.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const maxThumbTop = Math.max(rect.height - metrics.thumbHeight, 1);
    const ratio = Math.min(
      Math.max((clickY - metrics.thumbHeight / 2) / maxThumbTop, 0),
      1,
    );

    window.scrollTo({ top: ratio * metrics.maxScroll, behavior: "smooth" });
  };

  const handleTrackMouseEnter = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (trackRef.current) trackRef.current.style.opacity = ACTIVE_OPACITY;
  };

  const handleTrackMouseLeave = () => {
    if (!dragRef.current && trackRef.current) {
      trackRef.current.style.opacity = IDLE_OPACITY;
    }
  };

  return (
    <Box
      ref={trackRef}
      onClick={handleTrackClick}
      onMouseEnter={handleTrackMouseEnter}
      onMouseLeave={handleTrackMouseLeave}
      sx={{
        position: "fixed",
        top: BASE_MARGIN,
        bottom: BASE_MARGIN,
        right: 4,
        width: 10,
        zIndex: 9999,
        display: { xs: "none", sm: "flex" },
        alignItems: "flex-start",
        justifyContent: "flex-end",
        opacity: 0,
        pointerEvents: "none",
        transition: "opacity 0.2s ease, top 0.15s ease, bottom 0.15s ease",
        userSelect: "none",
        cursor: "pointer",
        "&:hover > div": {
          width: 7,
          bgcolor: tokens.primary,
        },
      }}
    >
      <Box
        ref={thumbRef}
        onPointerDown={handleThumbPointerDown}
        onPointerMove={handleThumbPointerMove}
        onPointerUp={handleThumbPointerUp}
        onPointerCancel={handleThumbPointerUp}
        sx={{
          width: 5,
          height: 0,
          borderRadius: `${tokens.radiusPill}px`,
          bgcolor: "rgba(37, 99, 235, 0.75)",
          boxShadow: "0 0 0 1px rgba(8, 13, 26, 0.25)",
          transition: "width 0.15s ease, background-color 0.15s ease",
          cursor: "grab",
          "&:active": {
            cursor: "grabbing",
            width: 7,
            bgcolor: tokens.primary,
          },
        }}
      />
    </Box>
  );
}

export default InlineScrollbar;
