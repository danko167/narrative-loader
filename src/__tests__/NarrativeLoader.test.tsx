import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { NarrativeLoader } from "../NarrativeLoader";

describe("NarrativeLoader", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders nothing when not visible", () => {
    render(<NarrativeLoader loading={false} />);

    expect(screen.queryByText(/thinking/i)).not.toBeInTheDocument();
  });

  it("renders custom text", async () => {
    vi.useFakeTimers();

    render(
      <NarrativeLoader
        loading
        delay={0}
        messages={["Loading custom thing"]}
      />
    );

    await act(async () => {
      vi.runOnlyPendingTimers();
    });

    expect(screen.getByText("Loading custom thing")).toBeInTheDocument();
  });

  it("shows full text immediately when reduced motion is enabled", async () => {
    vi.useFakeTimers();

    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <NarrativeLoader
        loading
        delay={0}
        messages={[{ text: "Typing now", animation: "typewriter" }]}
      />
    );

    await act(async () => {
      vi.runOnlyPendingTimers();
    });

    expect(screen.getByText("Typing now")).toBeInTheDocument();

    window.matchMedia = originalMatchMedia;
  });

  it("shows done message after loading completes", async () => {
    vi.useFakeTimers();

    const { rerender } = render(
      <NarrativeLoader
        loading
        delay={0}
        messages={["Working"]}
        doneMessage="Done"
        doneDuration={1000}
      />
    );

    await act(async () => {
      vi.runOnlyPendingTimers();
    });

    expect(screen.getByText("Working")).toBeInTheDocument();

    rerender(
      <NarrativeLoader
        loading={false}
        delay={0}
        messages={["Working"]}
        doneMessage="Done"
        doneDuration={1000}
      />
    );

    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getByText("Done")).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText("Done")).not.toBeInTheDocument();
  });

  it("renders error state text", async () => {
    vi.useFakeTimers();

    render(<NarrativeLoader loading={false} error="Boom" />);

    await act(async () => {
      vi.runOnlyPendingTimers();
    });

    expect(screen.getByText("Boom")).toBeInTheDocument();
  });

  it("renders emoji at the configured position", async () => {
    vi.useFakeTimers();

    const { container, rerender } = render(
      <NarrativeLoader
        loading
        delay={0}
        useEmojis
        emojiPosition="start"
        messages={[{ text: "Saving", emoji: "💾" }]}
      />
    );

    await act(async () => {
      vi.runOnlyPendingTimers();
    });

    const startLine = container.querySelector(".nl-line");
    expect(startLine?.firstElementChild).toHaveClass("nl-emoji");

    rerender(
      <NarrativeLoader
        loading
        delay={0}
        useEmojis
        emojiPosition="end"
        messages={[{ text: "Saving", emoji: "💾" }]}
      />
    );

    await act(async () => {
      vi.runOnlyPendingTimers();
    });

    const endLine = container.querySelector(".nl-line");
    expect(endLine?.lastElementChild).toHaveClass("nl-emoji");
  });

  it("renders source-driven backend messages", async () => {
    vi.useFakeTimers();

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Backend step" }),
    } as Response);

    render(
      <NarrativeLoader
        loading
        delay={0}
        source="/api/status"
        pollInterval={1000}
      />
    );

    await act(async () => {
      vi.runOnlyPendingTimers();
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByText("Backend step")).toBeInTheDocument();
  });
});