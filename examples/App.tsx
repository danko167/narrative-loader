import { useState } from "react";
import { NarrativeLoader } from "../src/NarrativeLoader";
import "../src/NarrativeLoader.css";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fakeRequest(shouldFail = false) {
    setError(null);
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 5200));

    setLoading(false);
    if (shouldFail) setError("Could not complete the request");
  }

  return (
    <main style={{ padding: 40, fontFamily: "system-ui, sans-serif" }}>
      <h1>Narrative Loader</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <button onClick={() => fakeRequest(false)}>Start successful request</button>
        <button onClick={() => fakeRequest(true)}>Start failing request</button>
      </div>

      <NarrativeLoader
        loading={loading}
        error={error}
        delay={300}
        minVisibleDuration={700}
        doneMessage={{ text: "Done", emoji: "✅", animation: "fade", emojiAnimation: "pulse" }}
        useEmojis
        tone="playful"
        variant="analysis"
        randomize
      />

      <section style={{ marginTop: 48 }}>
        <h2>Timeline example</h2>
        <NarrativeLoader
          loading={loading}
          useEmojis
          timeline={[
            { after: 0, message: { text: "Thinking", emoji: "🧠", animation: "dots", emojiAnimation: "pulse" } },
            { after: 2500, message: { text: "Still working", emoji: "⚙️", animation: "dots", emojiAnimation: "spin" } },
            { after: 5000, message: { text: "This is taking longer than usual", emoji: "⏳", animation: "dots", emojiAnimation: "flip" } },
          ]}
        />
      </section>
    </main>
  );
}
