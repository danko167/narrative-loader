import type { LoaderMessage, LoaderTone, LoaderVariant } from "./types";

export const tonePresets: Record<LoaderTone, Record<LoaderVariant, LoaderMessage[]>> = {
  neutral: {
    default: [
      { text: "Thinking", emoji: "🧠", animation: "dots", emojiAnimation: "pulse", duration: 1600 },
      { text: "Interesting", emoji: "✨", animation: "fade", emojiAnimation: "bounce", duration: 1400 },
      { text: "Working on it", emoji: "⚙️", animation: "dots", emojiAnimation: "spin", duration: 1800 },
      { text: "Almost done", emoji: "⏳", animation: "dots", emojiAnimation: "flip", duration: 1600 },
    ],
    chat: [
      { text: "Reading your message", emoji: "💬", animation: "dots", emojiAnimation: "bounce" },
      { text: "Thinking it through", emoji: "🧠", animation: "dots", emojiAnimation: "pulse" },
      { text: "Writing a response", emoji: "✍️", animation: "typewriter", emojiAnimation: "bounce" },
    ],
    save: [
      { text: "Validating your data", emoji: "🔍", animation: "dots", emojiAnimation: "pulse" },
      { text: "Saving changes", emoji: "💾", animation: "dots", emojiAnimation: "bounce" },
      { text: "Finishing up", emoji: "✅", animation: "fade", emojiAnimation: "pulse" },
    ],
    upload: [
      { text: "Uploading your file", emoji: "📤", animation: "dots", emojiAnimation: "bounce" },
      { text: "Processing contents", emoji: "⚙️", animation: "dots", emojiAnimation: "spin" },
      { text: "Wrapping things up", emoji: "📦", animation: "fade", emojiAnimation: "bounce" },
    ],
    search: [
      { text: "Searching", emoji: "🔍", animation: "dots", emojiAnimation: "pulse" },
      { text: "Checking results", emoji: "🧭", animation: "dots", emojiAnimation: "spin" },
      { text: "Sorting matches", emoji: "📚", animation: "fade", emojiAnimation: "bounce" },
    ],
    delete: [
      { text: "Checking dependencies", emoji: "🔎", animation: "dots", emojiAnimation: "pulse" },
      { text: "Removing data", emoji: "🗑️", animation: "dots", emojiAnimation: "bounce" },
      { text: "Cleaning up", emoji: "🧹", animation: "fade", emojiAnimation: "bounce" },
    ],
    analysis: [
      { text: "Analyzing data", emoji: "🧠", animation: "dots", emojiAnimation: "pulse" },
      { text: "Found something interesting", emoji: "✨", animation: "fade", emojiAnimation: "bounce" },
      { text: "Preparing response", emoji: "✍️", animation: "typewriter", emojiAnimation: "bounce" },
    ],
  },
  friendly: {
    default: [
      { text: "Give me a second", emoji: "🙂", animation: "dots", emojiAnimation: "bounce" },
      { text: "I’m checking a few things", emoji: "🔎", animation: "dots", emojiAnimation: "pulse" },
      { text: "This is coming together", emoji: "✨", animation: "fade", emojiAnimation: "bounce" },
      { text: "Almost there", emoji: "⏳", animation: "dots", emojiAnimation: "flip" },
    ],
    chat: [
      { text: "Reading that", emoji: "💬", animation: "dots", emojiAnimation: "bounce" },
      { text: "Thinking it through", emoji: "🧠", animation: "dots", emojiAnimation: "pulse" },
      { text: "Writing it nicely", emoji: "✍️", animation: "typewriter", emojiAnimation: "bounce" },
    ],
    save: [
      { text: "Checking everything", emoji: "🔍", animation: "dots", emojiAnimation: "pulse" },
      { text: "Saving your changes", emoji: "💾", animation: "dots", emojiAnimation: "bounce" },
      { text: "Just about done", emoji: "✅", animation: "fade", emojiAnimation: "pulse" },
    ],
    upload: [
      { text: "Sending your file", emoji: "📤", animation: "dots", emojiAnimation: "bounce" },
      { text: "Looking through it", emoji: "⚙️", animation: "dots", emojiAnimation: "spin" },
      { text: "Tidying things up", emoji: "📦", animation: "fade", emojiAnimation: "bounce" },
    ],
    search: [
      { text: "Looking around", emoji: "🔍", animation: "dots", emojiAnimation: "pulse" },
      { text: "Checking the best matches", emoji: "🧭", animation: "dots", emojiAnimation: "spin" },
      { text: "Organizing results", emoji: "📚", animation: "fade", emojiAnimation: "bounce" },
    ],
    delete: [
      { text: "Making sure this is safe", emoji: "🔎", animation: "dots", emojiAnimation: "pulse" },
      { text: "Removing it now", emoji: "🗑️", animation: "dots", emojiAnimation: "bounce" },
      { text: "Cleaning up", emoji: "🧹", animation: "fade", emojiAnimation: "bounce" },
    ],
    analysis: [
      { text: "Looking closely", emoji: "🧠", animation: "dots", emojiAnimation: "pulse" },
      { text: "Found something useful", emoji: "✨", animation: "fade", emojiAnimation: "bounce" },
      { text: "Putting it together", emoji: "✍️", animation: "typewriter", emojiAnimation: "bounce" },
    ],
  },
  playful: {
    default: [
      { text: "Hmm", emoji: "🤔", animation: "dots", emojiAnimation: "pulse" },
      { text: "Oh, interesting", emoji: "✨", animation: "fade", emojiAnimation: "bounce" },
      { text: "Cooking something up", emoji: "🍳", animation: "dots", emojiAnimation: "bounce" },
      { text: "Nearly there", emoji: "🚀", animation: "dots", emojiAnimation: "bounce" },
    ],
    chat: [
      { text: "Reading the vibes", emoji: "💬", animation: "dots", emojiAnimation: "bounce" },
      { text: "Brain is braining", emoji: "🧠", animation: "dots", emojiAnimation: "pulse" },
      { text: "Typing something useful", emoji: "✍️", animation: "typewriter", emojiAnimation: "bounce" },
    ],
    save: [
      { text: "Inspecting the goods", emoji: "🔍", animation: "dots", emojiAnimation: "pulse" },
      { text: "Saving the magic", emoji: "💾", animation: "dots", emojiAnimation: "bounce" },
      { text: "Locking it in", emoji: "✅", animation: "fade", emojiAnimation: "pulse" },
    ],
    upload: [
      { text: "Launching your file", emoji: "📤", animation: "dots", emojiAnimation: "bounce" },
      { text: "Crunching bits", emoji: "⚙️", animation: "dots", emojiAnimation: "spin" },
      { text: "Packing it neatly", emoji: "📦", animation: "fade", emojiAnimation: "bounce" },
    ],
    search: [
      { text: "Detective mode", emoji: "🔍", animation: "dots", emojiAnimation: "pulse" },
      { text: "Following clues", emoji: "🧭", animation: "dots", emojiAnimation: "spin" },
      { text: "Sorting the loot", emoji: "📚", animation: "fade", emojiAnimation: "bounce" },
    ],
    delete: [
      { text: "Checking escape routes", emoji: "🔎", animation: "dots", emojiAnimation: "pulse" },
      { text: "Into the bin", emoji: "🗑️", animation: "dots", emojiAnimation: "bounce" },
      { text: "Sweeping crumbs", emoji: "🧹", animation: "fade", emojiAnimation: "bounce" },
    ],
    analysis: [
      { text: "Putting on the thinking cap", emoji: "🧠", animation: "dots", emojiAnimation: "pulse" },
      { text: "Ooh, found a thing", emoji: "✨", animation: "fade", emojiAnimation: "bounce" },
      { text: "Making it make sense", emoji: "✍️", animation: "typewriter", emojiAnimation: "bounce" },
    ],
  },
  professional: {
    default: [
      { text: "Processing request", emoji: "⚙️", animation: "dots", emojiAnimation: "spin" },
      { text: "Reviewing details", emoji: "🔎", animation: "dots", emojiAnimation: "pulse" },
      { text: "Finalizing response", emoji: "✅", animation: "fade", emojiAnimation: "pulse" },
    ],
    chat: [
      { text: "Reviewing message", emoji: "💬", animation: "dots", emojiAnimation: "bounce" },
      { text: "Generating response", emoji: "🧠", animation: "dots", emojiAnimation: "pulse" },
      { text: "Finalizing answer", emoji: "✍️", animation: "typewriter", emojiAnimation: "bounce" },
    ],
    save: [
      { text: "Validating input", emoji: "🔍", animation: "dots", emojiAnimation: "pulse" },
      { text: "Persisting changes", emoji: "💾", animation: "dots", emojiAnimation: "bounce" },
      { text: "Confirming update", emoji: "✅", animation: "fade", emojiAnimation: "pulse" },
    ],
    upload: [
      { text: "Uploading file", emoji: "📤", animation: "dots", emojiAnimation: "bounce" },
      { text: "Processing file", emoji: "⚙️", animation: "dots", emojiAnimation: "spin" },
      { text: "Finalizing upload", emoji: "📦", animation: "fade", emojiAnimation: "bounce" },
    ],
    search: [
      { text: "Running search", emoji: "🔍", animation: "dots", emojiAnimation: "pulse" },
      { text: "Evaluating results", emoji: "🧭", animation: "dots", emojiAnimation: "spin" },
      { text: "Ranking matches", emoji: "📚", animation: "fade", emojiAnimation: "bounce" },
    ],
    delete: [
      { text: "Validating delete request", emoji: "🔎", animation: "dots", emojiAnimation: "pulse" },
      { text: "Removing record", emoji: "🗑️", animation: "dots", emojiAnimation: "bounce" },
      { text: "Completing cleanup", emoji: "🧹", animation: "fade", emojiAnimation: "bounce" },
    ],
    analysis: [
      { text: "Analyzing input", emoji: "🧠", animation: "dots", emojiAnimation: "pulse" },
      { text: "Identifying patterns", emoji: "✨", animation: "fade", emojiAnimation: "bounce" },
      { text: "Preparing response", emoji: "✍️", animation: "typewriter", emojiAnimation: "bounce" },
    ],
  },
};

