import { useEffect, useState } from "react";
import { useNarrativeLoader } from "./useNarrativeLoader";
import type { EmojiAnimation, LoaderAnimation, NarrativeLoaderProps } from "./types";
import { emojiAnimationClassNames, lineAnimationClassNames } from "./utils";

const DEFAULT_TYPEWRITER_INTERVAL = 35;
const DEFAULT_DOTS_INTERVAL = 450;

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(mediaQuery.matches);

    onChange();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    }

    mediaQuery.addListener(onChange);
    return () => mediaQuery.removeListener(onChange);
  }, []);

  return prefersReducedMotion;
}

function TypewriterText({ text, interval }: { text: string; interval: number }) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    setVisibleText("");
    let index = 0;

    const timer = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, interval);

    return () => window.clearInterval(timer);
  }, [text, interval]);

  return <>{visibleText}</>;
}

function DotsText({ text, interval }: { text: string; interval: number }) {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDots((current) => (current === "." ? ".." : current === ".." ? "..." : "."));
    }, interval);

    return () => window.clearInterval(timer);
  }, [interval]);

  return <>{text}{dots}</>;
}

function AnimatedEmoji({ emoji, animation, className }: { emoji: string; animation: EmojiAnimation; className?: string }) {
  if (!emoji) return null;

  return (
    <span className={`nl-emoji ${emojiAnimationClassNames[animation]} ${className ?? ""}`.trim()} aria-hidden="true">
      {emoji}
    </span>
  );
}

function RenderAnimatedText({
  text,
  animation,
  prefersReducedMotion,
  typewriterInterval,
  dotsInterval,
}: {
  text: string;
  animation: LoaderAnimation;
  prefersReducedMotion: boolean;
  typewriterInterval: number;
  dotsInterval: number;
}) {
  if (prefersReducedMotion) return <>{text}</>;
  if (animation === "typewriter") return <TypewriterText text={text} interval={typewriterInterval} />;
  if (animation === "dots") return <DotsText text={text} interval={dotsInterval} />;
  return <>{text}</>;
}

export function NarrativeLoader({
  useEmojis = false,
  emojiPosition = "end",
  typewriterInterval = DEFAULT_TYPEWRITER_INTERVAL,
  dotsInterval = DEFAULT_DOTS_INTERVAL,
  className = "",
  textClassName = "",
  emojiClassName = "",
  ...options
}: NarrativeLoaderProps) {
  const loader = useNarrativeLoader(options);
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!loader.visible) return null;

  const showEmoji = useEmojis && Boolean(loader.message.emoji);

  return (
    <div
      className={`nl-root nl-status-${loader.status} ${className}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-busy={loader.status === "loading"}
    >
      <span
        key={`${loader.status}-${loader.text}-${loader.animation}-${loader.index}`}
        className={`nl-line ${lineAnimationClassNames[loader.animation]} ${textClassName}`.trim()}
      >
        {showEmoji && emojiPosition === "start" ? (
          <AnimatedEmoji emoji={loader.message.emoji} animation={loader.emojiAnimation} className={emojiClassName} />
        ) : null}

        <span className="nl-message">
          <span className="nl-sr-only">{loader.text}</span>
          <span aria-hidden="true" className="nl-visual-message">
            <RenderAnimatedText
              text={loader.text}
              animation={loader.animation}
              prefersReducedMotion={prefersReducedMotion}
              typewriterInterval={typewriterInterval}
              dotsInterval={dotsInterval}
            />
          </span>
        </span>

        {showEmoji && emojiPosition === "end" ? (
          <AnimatedEmoji emoji={loader.message.emoji} animation={loader.emojiAnimation} className={emojiClassName} />
        ) : null}
      </span>
    </div>
  );
}
