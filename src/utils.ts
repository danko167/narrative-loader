import type {
  LoaderMessage,
  LoaderTimelineItem,
  LoaderTimelineMessageItem,
  NarrativeLoaderProps,
  NormalizedMessage,
} from "./types";

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
  if (!error) return null;
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return null;
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
