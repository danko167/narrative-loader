import { useEffect, useState } from "react";
import { useNarrativeLoader } from "./useNarrativeLoader";
import type { EmojiAnimation, LoaderAnimation, NarrativeLoaderProps } from "./types";

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

function TypewriterText({ text }: { text: string }) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    setVisibleText("");
    let index = 0;

    const timer = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, 35);

    return () => window.clearInterval(timer);
  }, [text]);

  return <>{visibleText}</>;
}

function DotsText({ text }: { text: string }) {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDots((current) => (current === "." ? ".." : current === ".." ? "..." : "."));
    }, 450);

    return () => window.clearInterval(timer);
  }, []);

  return <>{text}{dots}</>;
}

function AnimatedEmoji({ emoji, animation, className }: { emoji: string; animation: EmojiAnimation; className?: string }) {
  if (!emoji) return null;

  return (
    <span className={`nl-emoji nl-emoji-${animation} ${className ?? ""}`} aria-hidden="true">
      {emoji}
    </span>
  );
}

function RenderAnimatedText({
  text,
  animation,
  prefersReducedMotion,
}: {
  text: string;
  animation: LoaderAnimation;
  prefersReducedMotion: boolean;
}) {
  if (prefersReducedMotion) return <>{text}</>;
  if (animation === "typewriter") return <TypewriterText text={text} />;
  if (animation === "dots") return <DotsText text={text} />;
  return <>{text}</>;
}

export function NarrativeLoader({
  useEmojis = false,
  emojiPosition = "end",
  className = "",
  textClassName = "",
  emojiClassName = "",
  ...options
}: NarrativeLoaderProps) {
  const loader = useNarrativeLoader(options);
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!loader.visible) return null;

  const showEmoji =
    useEmojis &&
    Boolean(loader.message.emoji) &&
    !loader.isSourceMessage;

  return (
    <div className={`nl-root nl-status-${loader.status} ${className}`} aria-live="polite" aria-busy={loader.status === "loading"}>
      <span key={`${loader.status}-${loader.text}-${loader.animation}-${loader.index}`} className={`nl-line nl-${loader.animation} ${textClassName}`}>
        {showEmoji && emojiPosition === "start" ? (
          <AnimatedEmoji emoji={loader.message.emoji} animation={loader.emojiAnimation} className={emojiClassName} />
        ) : null}

        <span className="nl-message">
          <RenderAnimatedText
            text={loader.text}
            animation={loader.animation}
            prefersReducedMotion={prefersReducedMotion}
          />
        </span>

        {showEmoji && emojiPosition === "end" ? (
          <AnimatedEmoji emoji={loader.message.emoji} animation={loader.emojiAnimation} className={emojiClassName} />
        ) : null}
      </span>
    </div>
  );
}
