import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useNarrativeLoader } from "../useNarrativeLoader";

function flushMicrotasks() {
  return Promise.resolve();
}

describe("useNarrativeLoader", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("uses custom messages over variant and tone presets", () => {
    const { result } = renderHook(() =>
      useNarrativeLoader({
        loading: true,
        messages: ["Custom message"],
        variant: "chat",
        tone: "playful",
      })
    );

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(result.current.visible).toBe(true);
    expect(result.current.text).toBe("Custom message");
  });

  it("falls back to the default preset with no configuration", () => {
    const { result } = renderHook(() => useNarrativeLoader({ loading: true }));

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(result.current.visible).toBe(true);
    expect(result.current.text).toBe("Thinking");
  });

  it("supports timeline-based progression", () => {
    const { result } = renderHook(() =>
      useNarrativeLoader({
        loading: true,
        timeline: [
          { after: 0, message: "Start" },
          { after: 1000, message: "Later" },
        ],
      })
    );

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(result.current.text).toBe("Start");

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.text).toBe("Later");
  });

  it("supports shorthand timeline items", () => {
    const { result } = renderHook(() =>
      useNarrativeLoader({
        loading: true,
        timeline: [
          { after: 0, text: "Start" },
          { after: 1000, text: "Later" },
        ],
      })
    );

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(result.current.text).toBe("Start");

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.text).toBe("Later");
  });

  it("lets messages take priority over timeline", () => {
    const { result } = renderHook(() =>
      useNarrativeLoader({
        loading: true,
        messages: ["Custom wins"],
        timeline: [{ after: 0, message: "Timeline loses" }],
      })
    );

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(result.current.text).toBe("Custom wins");
  });

  it("shows error text when an error string is provided", () => {
    const { result } = renderHook(() =>
      useNarrativeLoader({
        loading: false,
        error: "Request failed",
      })
    );

    expect(result.current.visible).toBe(true);
    expect(result.current.status).toBe("error");
    expect(result.current.text).toBe("Request failed");
  });

  it("polls sequentially without overlapping requests", async () => {
    const pendingResolvers: Array<(value: Response) => void> = [];

    global.fetch = vi.fn().mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          pendingResolvers.push(resolve);
        })
    );

    renderHook(() =>
      useNarrativeLoader({
        loading: true,
        source: "/api/status",
        pollInterval: 100,
      })
    );

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    await act(async () => {
      pendingResolvers[0]({
        ok: true,
        json: async () => ({ message: "Step 1" }),
      } as Response);
      await flushMicrotasks();
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("stops polling when stopWhen returns true", async () => {
    const pendingResolvers: Array<(value: Response) => void> = [];
    global.fetch = vi.fn().mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          pendingResolvers.push(resolve);
        })
    );

    renderHook(() =>
      useNarrativeLoader({
        loading: true,
        source: "/api/status",
        pollInterval: 100,
        stopWhen: (data) => Boolean((data as { done?: boolean }).done),
      })
    );

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    await act(async () => {
      pendingResolvers[0]({
        ok: true,
        json: async () => ({ done: true, message: "Complete" }),
      } as Response);
      await flushMicrotasks();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
