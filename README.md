# 🧠 Narrative Loader

Human-friendly async feedback for React apps.

Instead of generic spinners, show meaningful, animated status messages like:

```
Thinking...
→ Interesting...
→ Working on it...
→ Almost done...
```

Designed for modern apps:
- dashboards
- CRUD apps
- AI / chat interfaces
- background tasks

---

## ✨ Features

- 🧠 Narrative, human-like loading states
- 🎭 Built-in variants and tone presets
- 🔀 Optional randomized message flow
- ⏱ Delay + minimum visible duration (no flicker)
- 📡 Backend-driven status polling
- 🎬 Text + emoji animations
- 🧩 Fully customizable messages
- ♿ Respects reduced motion

---

## Install

Requires React 18 or newer.

```bash
npm install @danko167/narrative-loader
```

Import the CSS once in your app:

```ts
import "@danko167/narrative-loader/styles.css";
```

---

## Quick start

```tsx
import { NarrativeLoader } from "@danko167/narrative-loader";

<NarrativeLoader loading />
```

That uses the default preset sequence.

---

## Custom messages

Custom messages always win over presets.

```tsx
<NarrativeLoader
  loading={loading}
  messages={[
    "Validating your data",
    "Saving changes",
    "Almost done",
  ]}
/>
```

You can also pass richer message objects:

```tsx
<NarrativeLoader
  loading={loading}
  useEmojis
  messages={[
    {
      text: "Validating your data",
      emoji: "🔍",
      animation: "dots",
      emojiAnimation: "pulse",
    },
    {
      text: "Updating records",
      emoji: "💾",
      animation: "fade",
      emojiAnimation: "bounce",
    },
    {
      text: "Finishing up",
      emoji: "✨",
      animation: "typewriter",
      emojiAnimation: "bounce",
    },
  ]}
/>
```

---

## Variants

Use variants for common async flows:

```tsx
<NarrativeLoader loading={loading} variant="chat" />
<NarrativeLoader loading={loading} variant="save" />
<NarrativeLoader loading={loading} variant="upload" />
<NarrativeLoader loading={loading} variant="search" />
<NarrativeLoader loading={loading} variant="delete" />
<NarrativeLoader loading={loading} variant="analysis" />
```

---

## Tones

```tsx
<NarrativeLoader loading={loading} tone="professional" />
<NarrativeLoader loading={loading} tone="friendly" />
<NarrativeLoader loading={loading} tone="playful" />
```

---

## Randomized messages

```tsx
<NarrativeLoader loading={loading} variant="analysis" randomize />
```

---

## Text animations

```tsx
<NarrativeLoader loading={loading} animation="typewriter" />
<NarrativeLoader loading={loading} animation="dots" />
<NarrativeLoader loading={loading} animation="fade" />
<NarrativeLoader loading={loading} animation="none" />
```

---

## Emojis

```tsx
<NarrativeLoader loading={loading} useEmojis />
```

---

## Timeline

```tsx
<NarrativeLoader
  loading={loading}
  timeline={[
    { after: 0, message: "Starting" },
    { after: 2500, message: "Still working" },
    { after: 7000, message: "This is taking longer than usual" },
  ]}
/>
```

Shorthand objects are also supported:

```tsx
timeline={[
  { after: 0, text: "Starting", emoji: "🧠", animation: "dots" },
  { after: 2500, text: "Still working", emoji: "⚙️" },
]}
```

---

## Delay & duration

```tsx
<NarrativeLoader loading={loading} delay={400} />
<NarrativeLoader loading={loading} minVisibleDuration={700} />
```

---

## Done & error

```tsx
<NarrativeLoader loading={loading} doneMessage="Done" />
<NarrativeLoader loading={loading} error errorMessage="Something went wrong" />
```

---

## Backend polling

```tsx
<NarrativeLoader
  loading={loading}
  source="/api/jobs/123/status"
  pollInterval={1500}
  getMessage={(data) => data.step}
  stopWhen={(data) => data.done === true}
/>
```

This works well with responses like:

```json
{ "step": "Generating summary", "done": false }
```

- `pollInterval` controls how often the status endpoint is checked.
- `getMessage` maps the response into the displayed loader text.
- `stopWhen` stops polling once your job is complete.

---

## Headless usage

```tsx
import { useNarrativeLoader } from "@danko167/narrative-loader";

const loader = useNarrativeLoader({ loading });

return loader.visible ? (
  <div aria-live="polite" aria-busy={loader.status === "loading"}>
    <strong>{loader.status}</strong>
    <span>{loader.text}</span>
  </div>
) : null;
```

---

## License

MIT
