import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { NarrativeLoader } from "../NarrativeLoader";

describe("NarrativeLoader", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
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

    expect(screen.getAllByText("Loading custom thing").length).toBeGreaterThan(0);
  });

  it("shows full text immediately when reduced motion is enabled", async () => {
    vi.useFakeTimers();

    vi.stubGlobal("matchMedia", vi.fn().mockImplementation(() => ({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));

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

    expect(screen.getAllByText("Typing now").length).toBeGreaterThan(0);
  });

  it("exposes stable status aria attributes while loading", async () => {
    vi.useFakeTimers();

    render(
      <NarrativeLoader
        loading
        delay={0}
        messages={[{ text: "Working", animation: "dots" }]}
      />
    );

    await act(async () => {
      vi.runOnlyPendingTimers();
    });

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveAttribute("aria-atomic", "true");
    expect(status).toHaveAttribute("aria-busy", "true");
  });

  it("clears aria-busy in error state", async () => {
    render(<NarrativeLoader loading={false} error="Boom" />);

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-busy", "false");
  });

  it("keeps configured emojis visible during source-driven loading", async () => {
    vi.useFakeTimers();

    globalThis.fetch = vi.fn().mockImplementation(
      () => new Promise<Response>(() => undefined)
    );

    render(
      <NarrativeLoader
        loading
        delay={0}
        source="/api/status"
        useEmojis
        messages={[{ text: "Fetching status", emoji: "🔄" }]}
      />
    );

    await act(async () => {
      vi.runOnlyPendingTimers();
    });

    expect(screen.getAllByText("Fetching status").length).toBeGreaterThan(0);
    expect(screen.getByText("🔄")).toBeInTheDocument();
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

    expect(screen.getAllByText("Working").length).toBeGreaterThan(0);

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

    expect(screen.getAllByText("Done").length).toBeGreaterThan(0);

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

    expect(screen.getAllByText("Boom").length).toBeGreaterThan(0);
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

    globalThis.fetch = vi.fn().mockResolvedValue({
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

    expect(screen.getAllByText(/Backend step/).length).toBeGreaterThan(0);
  });

  it("uses custom typewriter timing", async () => {
    vi.useFakeTimers();

    render(
      <NarrativeLoader
        loading
        delay={0}
        typewriterInterval={10}
        messages={[{ text: "Test", animation: "typewriter" }]}
      />
    );

    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    await act(async () => {
      vi.advanceTimersByTime(10);
    });

    expect(screen.getByText("T")).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(30);
    });

    expect(screen.getAllByText("Test").length).toBeGreaterThan(0);
  });
});