import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { NarrativeLoader } from "../NarrativeLoader";

describe("NarrativeLoader", () => {
  afterEach(() => {
    vi.useRealTimers();
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
});