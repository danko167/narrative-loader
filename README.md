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

When `randomize` is used with `loop={false}`, the loader performs up to `messages.length - 1`
random transitions and then stays on the last shown message.

```tsx
<NarrativeLoader loading={loading} messages={["A", "B", "C"]} randomize loop={false} />
```

This mode does not guarantee that every message appears exactly once.

For large message arrays, prefer `loop={false}` or a `timeline` when you want bounded transitions.

---

## Text animations

```tsx
<NarrativeLoader loading={loading} animation="typewriter" />
<NarrativeLoader loading={loading} animation="dots" />
<NarrativeLoader loading={loading} animation="fade" />
<NarrativeLoader loading={loading} animation="none" />
```

You can also tune text animation timing in the wrapper component:

```tsx
<NarrativeLoader
  loading={loading}
  animation="typewriter"
  typewriterInterval={20}
  dotsInterval={300}
/>
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

When `loading` changes from `true` to `false` and `doneMessage` is provided, the loader enters
`done` state briefly before hiding. Control the visibility window with `doneDuration`.

---

## Backend polling

```tsx
<NarrativeLoader
  loading={loading}
  source="/api/jobs/123/status"
  pollInterval={1500}
  doneMessage="Summary ready"
  getMessage={(data) => (data as { step?: string }).step}
  stopWhen={(data) => (data as { done?: boolean }).done === true}
/>
```

For authenticated or non-GET status checks:

```tsx
<NarrativeLoader
  loading={loading}
  source="/api/jobs/123/status"
  sourceRequestInit={{
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ jobId: "123" }),
  }}
/>
```

If you already use a fetch wrapper, inject it:

```tsx
<NarrativeLoader
  loading={loading}
  source="/api/jobs/123/status"
  fetcher={(input, init) => apiClient.fetch(input, init)}
/>
```

This works well with responses like:

```json
{ "step": "Generating summary", "done": false }
```

`getMessage` should return a non-empty string when you want to override the displayed polling text.
If it returns `null`, `undefined`, or an empty string, the loader falls back to `response.message`
and then to the default text.

```tsx
<NarrativeLoader
  loading={loading}
  source="/api/jobs/123/status"
  getMessage={(data) => {
    const step = (data as { step?: string }).step;
    return step ? `Step: ${step}` : undefined;
  }}
/>
```

- `pollInterval` controls how often the status endpoint is checked.
- `sourceRequestInit` lets you pass request options (method, headers, body, etc.).
- `fetcher` lets you provide a custom fetch implementation.
- `getMessage` maps the response into the displayed loader text.
- Until the first polling response arrives, the loader keeps showing your configured preset, custom message, or timeline text.
- Polling starts as soon as `loading` enters `true` (it is not delayed by the visual `delay` prop).
- While `source` polling is active, message-level animation metadata is preserved from your current message/timeline step.
- `stopWhen` completes the loader cycle once your job is complete. Pair it with `doneMessage` if you want a final success message before the loader hides.
- After a source-driven cycle completes, the loader stays idle for that same `source` until you either set `loading={false}` or provide a new `source` value.
- Polling request failures are retried automatically with bounded retries and backoff.
- After repeated polling failures, the loader switches into `error` state with the request error text.
- Polling is sequential: a new request is only scheduled after the previous request settles.

---

## Headless usage

```tsx
import { useNarrativeLoader } from "@danko167/narrative-loader";

const loader = useNarrativeLoader({
  loading,
  source: "/api/jobs/123/status",
  stopWhen: (data) => (data as { done?: boolean }).done === true,
});

return loader.visible ? (
  <div aria-live="polite" aria-busy={loader.status === "loading"}>
    <strong>{loader.status}</strong>
    <span>{loader.text}</span>
    <small>{loader.message.emoji}</small>
  </div>
) : null;
```

`loader.text` is the current display string. `loader.message` carries the same text plus any emoji or animation metadata for custom headless rendering.

## Hook result API

`useNarrativeLoader` returns an object with these fields:

- `visible`: `true` when the loader should be rendered.
- `status`: One of `"idle" | "loading" | "done" | "error"`.
- `text`: The current display string, including backend polling text when `source` is active.
- `message`: The normalized message object for the current step, including `text`, `emoji`, and any message-level animation metadata.
- `animation`: The text animation that should be rendered for the current step.
- `emojiAnimation`: The emoji animation that should be rendered for the current step.
- `index`: The current message or timeline index.
- `isSourceMessage`: `true` while the displayed text is being driven by `source` polling.

---

## License

MIT
