export const LOADER_VARIANTS = ["default", "chat", "save", "upload", "search", "delete", "analysis"] as const;

export type LoaderVariant = (typeof LOADER_VARIANTS)[number];

export const LOADER_TONES = ["neutral", "friendly", "playful", "professional"] as const;

export type LoaderTone = (typeof LOADER_TONES)[number];

export const LOADER_ANIMATIONS = ["fade", "typewriter", "dots", "none"] as const;

export type LoaderAnimation = (typeof LOADER_ANIMATIONS)[number];

export const EMOJI_ANIMATIONS = ["none", "pulse", "spin", "flip", "bounce"] as const;

export type EmojiAnimation = (typeof EMOJI_ANIMATIONS)[number];

export const EMOJI_POSITIONS = ["start", "end"] as const;

export type LoaderMessage =
  | string
  | {
      text: string;
      emoji?: string;
      animation?: LoaderAnimation;
      emojiAnimation?: EmojiAnimation;
      duration?: number;
    };

export type LoaderTimelineMessageItem = {
  /** Milliseconds after the loader becomes visible. */
  after: number;
  message: LoaderMessage;
};

export type LoaderTimelineInlineItem = {
  /** Milliseconds after the loader becomes visible. */
  after: number;
  text: string;
  emoji?: string;
  animation?: LoaderAnimation;
  emojiAnimation?: EmojiAnimation;
  duration?: number;
};

export type LoaderTimelineItem = LoaderTimelineMessageItem | LoaderTimelineInlineItem;

export type NarrativeLoaderStatus = "idle" | "loading" | "done" | "error";

export type NormalizedMessage = {
  text: string;
  emoji: string;
  animation?: LoaderAnimation;
  emojiAnimation?: EmojiAnimation;
  duration?: number;
};

export type UseNarrativeLoaderOptions = {
  loading: boolean;
  messages?: LoaderMessage[];
  variant?: LoaderVariant;
  tone?: LoaderTone;
  timeline?: LoaderTimelineItem[];
  source?: string;
  /**
   * Maps polling response data into a user-facing loader message.
   * Return a non-empty string to override the response message.
   * Return null/undefined/empty string to fall back to response.message or the default text.
   */
  getMessage?: (data: unknown) => string | null | undefined;
  pollInterval?: number;
  onStatusChange?: (data: unknown) => void;
  stopWhen?: (data: unknown) => boolean;
  interval?: number;
  delay?: number;
  minVisibleDuration?: number;
  doneMessage?: LoaderMessage | false;
  doneDuration?: number;
  error?: boolean | Error | string | null;
  errorMessage?: LoaderMessage;
  animation?: LoaderAnimation;
  emojiAnimation?: EmojiAnimation;
  loop?: boolean;
  randomize?: boolean;
};

export type UseNarrativeLoaderResult = {
  visible: boolean;
  status: NarrativeLoaderStatus;
  text: string;
  message: NormalizedMessage;
  animation: LoaderAnimation;
  emojiAnimation: EmojiAnimation;
  index: number;
  isSourceMessage: boolean;
};

export type NarrativeLoaderProps = UseNarrativeLoaderOptions & {
  useEmojis?: boolean;
  emojiPosition?: (typeof EMOJI_POSITIONS)[number];
  typewriterInterval?: number;
  dotsInterval?: number;
  className?: string;
  textClassName?: string;
  emojiClassName?: string;
};
