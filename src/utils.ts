import type {
  EmojiAnimation,
  LoaderAnimation,
  LoaderMessage,
  LoaderTimelineItem,
  LoaderTimelineMessageItem,
  NarrativeLoaderProps,
  NormalizedMessage,
} from "./types";

export const lineAnimationClassNames: Record<LoaderAnimation, string> = {
  fade: "nl-fade",
  typewriter: "nl-typewriter",
  dots: "nl-dots",
  none: "nl-none",
};

export const emojiAnimationClassNames: Record<EmojiAnimation, string> = {
  none: "nl-emoji-none",
  pulse: "nl-emoji-pulse",
  spin: "nl-emoji-spin",
  flip: "nl-emoji-flip",
  bounce: "nl-emoji-bounce",
};

export function normalizeMessage(message: LoaderMessage): NormalizedMessage {
  if (typeof message === "string") {
    return { text: message, emoji: "", animation: undefined, emojiAnimation: undefined, duration: undefined };
  }

  return {
    text: message.text,
    emoji: message.emoji ?? "",
    animation: message.animation,
    emojiAnimation: message.emojiAnimation,
    duration: message.duration,
  };
}

export function getErrorText(error: NarrativeLoaderProps["error"]): string | null {
  if (!isValidErrorValue(error)) return null;
  if (error === true) return null;
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return null;
}

export function isValidErrorValue(error: NarrativeLoaderProps["error"]): error is true | string | Error {
  return error === true || typeof error === "string" || error instanceof Error;
}

export function resolveSourceMessage(
  data: unknown,
  getMessage?: (data: unknown) => string | null | undefined
): string {
  const customMessage = getMessage?.(data)?.trim();

  if (customMessage) return customMessage;

  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as { message: unknown }).message === "string"
  ) {
    const fallbackMessage = (data as { message: string }).message.trim();
    if (fallbackMessage) return fallbackMessage;
  }

  return "Working on it";
}

export function getRandomNextIndex(current: number, length: number) {
  if (length <= 1) return current;
  let next = current;
  while (next === current) {
    next = Math.floor(Math.random() * length);
  }
  return next;
}

export function normalizeTimelineItem(item: LoaderTimelineItem): {
  after: number;
  message: NormalizedMessage;
} {
  if ("message" in item) {
    return {
      after: item.after,
      message: normalizeMessage((item as LoaderTimelineMessageItem).message),
    };
  }

  return {
    after: item.after,
    message: normalizeMessage({
      text: item.text,
      emoji: item.emoji,
      animation: item.animation,
      emojiAnimation: item.emojiAnimation,
      duration: item.duration,
    }),
  };
}
