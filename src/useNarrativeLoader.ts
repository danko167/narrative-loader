import { useEffect, useMemo, useRef, useState } from "react";
import { tonePresets } from "./presets";
import type {
  NormalizedMessage,
  UseNarrativeLoaderOptions,
  UseNarrativeLoaderResult,
  NarrativeLoaderStatus,
} from "./types";
import { getErrorText, getRandomNextIndex, normalizeMessage, normalizeTimelineItem } from "./utils";

const DEFAULT_ERROR_MESSAGE = {
  text: "Something went wrong",
  emoji: "⚠️",
  animation: "fade" as const,
  emojiAnimation: "bounce" as const,
};

const FALLBACK_MESSAGE = normalizeMessage("Working on it");

export function useNarrativeLoader({
  loading,
  messages,
  variant = "default",
  tone = "neutral",
  timeline,
  source,
  getMessage,
  pollInterval,
  onStatusChange,
  stopWhen,
  interval = 1800,
  delay = 0,
  minVisibleDuration = 0,
  doneMessage = false,
  doneDuration = 900,
  error = null,
  errorMessage = DEFAULT_ERROR_MESSAGE,
  animation = "fade",
  emojiAnimation = "none",
  loop = true,
  randomize = false,
}: UseNarrativeLoaderOptions): UseNarrativeLoaderResult {
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<NarrativeLoaderStatus>("idle");
  const [index, setIndex] = useState(0);
  const [backendMessage, setBackendMessage] = useState<string | null>(null);
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [timelineReady, setTimelineReady] = useState(true);
  const randomStepsRef = useRef(0);
  const visibleSinceRef = useRef<number | null>(null);
  const getMessageRef = useRef(getMessage);
  const onStatusChangeRef = useRef(onStatusChange);
  const stopWhenRef = useRef(stopWhen);

  useEffect(() => {
    getMessageRef.current = getMessage;
    onStatusChangeRef.current = onStatusChange;
    stopWhenRef.current = stopWhen;
  }, [getMessage, onStatusChange, stopWhen]);

  const activeMessages = useMemo<NormalizedMessage[]>(() => {
    const selected = messages?.length ? messages : tonePresets[tone]?.[variant] ?? tonePresets.neutral.default;
    return selected.map(normalizeMessage);
  }, [messages, tone, variant]);

  const sortedTimeline = useMemo(() => {
    if (messages?.length || !timeline?.length) return null;
    return [...timeline].sort((a, b) => a.after - b.after).map(normalizeTimelineItem);
  }, [messages, timeline]);

  useEffect(() => {
    const hasError = Boolean(error || sourceError);

    if (hasError) {
      setStatus("error");
      setIsVisible(true);
      visibleSinceRef.current = visibleSinceRef.current ?? Date.now();
      return;
    }

    if (loading) {
      setStatus("loading");
      randomStepsRef.current = 0;

      if (isVisible) return;

      setTimelineReady(!(sortedTimeline?.[0]?.after && sortedTimeline[0].after > 0));

      const timer = window.setTimeout(() => {
        setIsVisible(true);
        visibleSinceRef.current = Date.now();
      }, delay);

      return () => window.clearTimeout(timer);
    }

    if (!isVisible) {
      setStatus("idle");
      setIndex(0);
      setBackendMessage(null);
      setSourceError(null);
      setTimelineReady(true);
      randomStepsRef.current = 0;
      visibleSinceRef.current = null;
      return;
    }

    const elapsed = visibleSinceRef.current ? Date.now() - visibleSinceRef.current : 0;
    const remainingVisible = Math.max(0, minVisibleDuration - elapsed);

    if (doneMessage) {
      let hideTimer: number | undefined;

      const doneTimer = window.setTimeout(() => {
        setStatus("done");
        hideTimer = window.setTimeout(() => {
          setIsVisible(false);
          setStatus("idle");
          setIndex(0);
          setBackendMessage(null);
          setSourceError(null);
          setTimelineReady(true);
          randomStepsRef.current = 0;
          visibleSinceRef.current = null;
        }, doneDuration);
      }, remainingVisible);

      return () => {
        window.clearTimeout(doneTimer);
        if (hideTimer) window.clearTimeout(hideTimer);
      };
    }

    const timer = window.setTimeout(() => {
      setIsVisible(false);
      setStatus("idle");
      setIndex(0);
      setBackendMessage(null);
      setSourceError(null);
      setTimelineReady(true);
      randomStepsRef.current = 0;
      visibleSinceRef.current = null;
    }, remainingVisible);

    return () => window.clearTimeout(timer);
  }, [loading, error, delay, minVisibleDuration, doneMessage, doneDuration, isVisible, sortedTimeline]);

  useEffect(() => {
    if (!isVisible || status !== "loading" || source || sortedTimeline) return;

    const currentMessage = activeMessages[index] ?? activeMessages[0];
    const duration = currentMessage?.duration ?? interval;

    const timer = window.setTimeout(() => {
      setIndex((current) => {
        if (randomize) {
          if (!loop) {
            const maxSteps = Math.max(0, activeMessages.length - 1);
            if (randomStepsRef.current >= maxSteps) return current;
            randomStepsRef.current += 1;
          }

          return getRandomNextIndex(current, activeMessages.length);
        }

        const next = current + 1;
        if (next >= activeMessages.length) return loop ? 0 : current;
        return next;
      });
    }, duration);

    return () => window.clearTimeout(timer);
  }, [isVisible, status, source, sortedTimeline, index, activeMessages, interval, loop, randomize]);

  useEffect(() => {
    if (!isVisible || status !== "loading" || source || !sortedTimeline) return;

    const startedAt = Date.now();
    const timers = sortedTimeline.map((item, itemIndex) =>
      window.setTimeout(() => {
        if (itemIndex === 0) setTimelineReady(true);
        setIndex(itemIndex);
      }, Math.max(0, item.after - (Date.now() - startedAt)))
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [isVisible, status, sortedTimeline]);

  useEffect(() => {
    if (!isVisible || status !== "loading" || !source) return;

    let cancelled = false;
    let stopped = false;
    let inFlight = false;
    let timer: number | null = null;
    let activeController: AbortController | null = null;
    const sourceUrl = source;
    const effectivePollInterval = pollInterval ?? interval;

    async function tick() {
      if (cancelled || stopped || inFlight) return;

      inFlight = true;
      const controller = new AbortController();
      activeController = controller;

      try {
        const response = await fetch(sourceUrl, { signal: controller.signal });
        if (!response.ok) throw new Error(`Status request failed with ${response.status}`);

        const data = await response.json();
        onStatusChangeRef.current?.(data);

        const message =
          getMessageRef.current?.(data) ??
          (typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof (data as { message: unknown }).message === "string"
            ? (data as { message: string }).message
            : "Working on it");

        if (!cancelled) setBackendMessage(message);
        if (stopWhenRef.current?.(data)) stopped = true;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (!cancelled) {
          const message =
            error instanceof Error && error.message
              ? error.message
              : "Status polling failed";

          setBackendMessage(null);
          setSourceError(message);
          setStatus("error");
        }

        stopped = true;
      } finally {
        inFlight = false;
        activeController = null;

        if (!cancelled && !stopped) {
          timer = window.setTimeout(tick, effectivePollInterval);
        }
      }
    }

    tick();

    return () => {
      cancelled = true;
      if (timer !== null) window.clearTimeout(timer);
      if (activeController) activeController.abort();
    };
  }, [isVisible, status, source, interval, pollInterval]);

  const errorText = getErrorText(error) ?? sourceError;
  const current =
    sortedTimeline && !timelineReady
      ? FALLBACK_MESSAGE
      : sortedTimeline?.[index]?.message ?? activeMessages[index] ?? FALLBACK_MESSAGE;
  const done = doneMessage ? normalizeMessage(doneMessage) : null;
  const errorMsg = normalizeMessage(errorText ? { text: errorText, emoji: "⚠️", animation: "fade", emojiAnimation: "bounce" } : errorMessage);
  const displayed = status === "done" && done ? done : status === "error" ? errorMsg : current;
  const isSourceMessage = Boolean(source && status === "loading");
  const text = isSourceMessage ? backendMessage ?? "Starting" : displayed.text;

  return {
    visible: isVisible && status !== "idle",
    status,
    text,
    message: displayed,
    animation: isSourceMessage ? animation : displayed.animation ?? animation,
    emojiAnimation: displayed.emojiAnimation ?? emojiAnimation,
    index,
    isSourceMessage,
  };
}
