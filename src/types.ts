export type LoaderVariant =
  | "default"
  | "chat"
  | "save"
  | "upload"
  | "search"
  | "delete"
  | "analysis";

export type LoaderTone = "neutral" | "friendly" | "playful" | "professional";

export type LoaderAnimation = "fade" | "typewriter" | "dots" | "none";

export type EmojiAnimation = "none" | "pulse" | "spin" | "flip" | "bounce";

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
  getMessage?: (data: unknown) => string;
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
  emojiPosition?: "start" | "end";
  className?: string;
  textClassName?: string;
  emojiClassName?: string;
};
