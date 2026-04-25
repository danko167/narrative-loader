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
      vi.advanceTimersByTime(0);
    });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current.visible).toBe(true);
    expect(result.current.text).toBe("Custom message");
  });

  it("falls back to the default preset with no configuration", () => {
    const { result } = renderHook(() => useNarrativeLoader({ loading: true }));

    act(() => {
      vi.advanceTimersByTime(0);
    });

    act(() => {
      vi.advanceTimersByTime(0);
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
      vi.advanceTimersByTime(0);
    });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current.text).toBe("Start");

    act(() => {
      vi.advanceTimersByTime(1100);
    });

    expect(result.current.text).toBe("Later");
  });

  it("does not show first timeline message before its scheduled time", () => {
    const { result } = renderHook(() =>
      useNarrativeLoader({
        loading: true,
        timeline: [{ after: 500, message: "Delayed start" }],
      })
    );

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(result.current.text).toBe("Working on it");

    act(() => {
      vi.advanceTimersByTime(499);
    });

    expect(result.current.text).toBe("Working on it");

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(result.current.text).toBe("Delayed start");
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
      vi.advanceTimersByTime(1100);
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

  it("ignores invalid runtime error values", () => {
    const { result } = renderHook(() =>
      useNarrativeLoader({
        loading: true,
        error: { message: "Not a real error" } as unknown as Error,
      })
    );

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(result.current.status).toBe("loading");
    expect(result.current.text).toBe("Thinking");
  });

  it("polls sequentially without overlapping requests", async () => {
    const pendingResolvers: Array<(value: Response) => void> = [];

    globalThis.fetch = vi.fn().mockImplementation(
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

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

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

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it("stops polling when stopWhen returns true", async () => {
    const pendingResolvers: Array<(value: Response) => void> = [];
    globalThis.fetch = vi.fn().mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          pendingResolvers.push(resolve);
        })
    );

    const { result } = renderHook(() =>
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

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    await act(async () => {
      pendingResolvers[0]({
        ok: true,
        json: async () => ({ done: true, message: "Complete" }),
      } as Response);
      await flushMicrotasks();
    });

    expect(result.current.status).toBe("done");
    expect(result.current.text).toBe("Complete");
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    await act(async () => {
      vi.advanceTimersByTime(0);
      await flushMicrotasks();
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.visible).toBe(false);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it("surfaces polling failures as error state and stops polling", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({}),
    } as Response);

    const { result } = renderHook(() =>
      useNarrativeLoader({
        loading: true,
        source: "/api/status",
        pollInterval: 100,
      })
    );

    act(() => {
      vi.runOnlyPendingTimers();
    });

    await act(async () => {
      await flushMicrotasks();
    });

    expect(result.current.status).toBe("error");
    expect(result.current.text).toContain("Status request failed with 503");

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it("falls back to response.message when getMessage returns an empty value", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Response message" }),
    } as Response);

    const { result } = renderHook(() =>
      useNarrativeLoader({
        loading: true,
        source: "/api/status",
        getMessage: () => "",
      })
    );

    act(() => {
      vi.runOnlyPendingTimers();
    });

    await act(async () => {
      await flushMicrotasks();
    });

    expect(result.current.text).toBe("Response message");
  });

  it("accepts text/plain polling responses without treating them as failures", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response("Plain status", {
        status: 200,
        headers: { "content-type": "text/plain" },
      })
    );

    const { result } = renderHook(() =>
      useNarrativeLoader({
        loading: true,
        source: "/api/status",
      })
    );

    act(() => {
      vi.runOnlyPendingTimers();
    });

    await act(async () => {
      await flushMicrotasks();
    });

    expect(result.current.status).toBe("loading");
    expect(result.current.text).toBe("Plain status");
  });

  it("keeps polling active when a successful response has an empty body", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(null, {
        status: 204,
      })
    );

    const { result } = renderHook(() =>
      useNarrativeLoader({
        loading: true,
        source: "/api/status",
      })
    );

    act(() => {
      vi.runOnlyPendingTimers();
    });

    await act(async () => {
      await flushMicrotasks();
    });

    expect(result.current.status).toBe("loading");
    expect(result.current.text).toBe("Working on it");
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(1800);
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it("keeps the returned message object in sync with backend polling text", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Backend step" }),
    } as Response);

    const { result } = renderHook(() =>
      useNarrativeLoader({
        loading: true,
        source: "/api/status",
        messages: [{ text: "Queued", emoji: "🔄" }],
      })
    );

    act(() => {
      vi.runOnlyPendingTimers();
    });

    await act(async () => {
      await flushMicrotasks();
    });

    expect(result.current.text).toBe("Backend step");
    expect(result.current.message.text).toBe("Backend step");
    expect(result.current.message.emoji).toBe("🔄");
  });

  it("preserves message-level text animation during source-driven loading", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Backend step" }),
    } as Response);

    const { result } = renderHook(() =>
      useNarrativeLoader({
        loading: true,
        source: "/api/status",
        animation: "typewriter",
        messages: [{ text: "Queued", animation: "dots" }],
      })
    );

    act(() => {
      vi.runOnlyPendingTimers();
    });

    await act(async () => {
      await flushMicrotasks();
    });

    expect(result.current.text).toBe("Backend step");
    expect(result.current.animation).toBe("dots");
  });

  it("uses fetcher and sourceRequestInit for polling requests", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Authorized" }),
    } as Response);

    const { result } = renderHook(() =>
      useNarrativeLoader({
        loading: true,
        source: "/api/status",
        fetcher,
        sourceRequestInit: {
          method: "POST",
          headers: { Authorization: "Bearer test-token" },
          body: JSON.stringify({ jobId: "123" }),
        },
      })
    );

    act(() => {
      vi.runOnlyPendingTimers();
    });

    await act(async () => {
      await flushMicrotasks();
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(
      "/api/status",
      expect.objectContaining({
        method: "POST",
        headers: { Authorization: "Bearer test-token" },
      })
    );
    expect(result.current.text).toBe("Authorized");
  });

  it("can restart polling after a source-driven completion without toggling loading off first", async () => {
    const responses = [
      { done: true, message: "First complete" },
      { done: false, message: "Second run" },
    ];

    globalThis.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: async () => responses.shift() ?? { done: false, message: "Fallback" },
      } as Response)
    );

    const { result, rerender } = renderHook(
      ({ source }) =>
        useNarrativeLoader({
          loading: true,
          source,
          stopWhen: (data) => Boolean((data as { done?: boolean }).done),
        }),
      {
        initialProps: { source: "/api/status/1" },
      }
    );

    act(() => {
      vi.runOnlyPendingTimers();
    });

    await act(async () => {
      await flushMicrotasks();
    });

    expect(result.current.status).toBe("done");
    expect(result.current.text).toBe("First complete");

    await act(async () => {
      vi.advanceTimersByTime(0);
      await flushMicrotasks();
    });

    expect(result.current.visible).toBe(false);
    expect(result.current.status).toBe("idle");

    rerender({ source: "/api/status/2" });

    act(() => {
      vi.runOnlyPendingTimers();
    });

    await act(async () => {
      await flushMicrotasks();
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    expect(result.current.status).toBe("loading");
    expect(result.current.text).toBe("Second run");
    expect(result.current.message.text).toBe("Second run");
  });

  it("uses configured loader text before the first polling response arrives", () => {
    globalThis.fetch = vi.fn().mockImplementation(
      () => new Promise<Response>(() => undefined)
    );

    const { result } = renderHook(() =>
      useNarrativeLoader({
        loading: true,
        source: "/api/status",
        messages: ["Custom pending text"],
      })
    );

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(result.current.status).toBe("loading");
    expect(result.current.text).toBe("Custom pending text");
  });

  it("honors loop=false when randomize is enabled", () => {
    const randomValues = [0.9, 0.1, 0.9, 0.1, 0.9, 0.1];
    let randomIndex = 0;
    const randomSpy = vi.spyOn(Math, "random").mockImplementation(() => {
      const value = randomValues[randomIndex % randomValues.length];
      randomIndex += 1;
      return value;
    });

    const { result } = renderHook(() =>
      useNarrativeLoader({
        loading: true,
        messages: ["A", "B", "C"],
        randomize: true,
        loop: false,
        interval: 100,
      })
    );

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(result.current.text).toBe("A");

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.text).toBe("C");

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.text).toBe("A");

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.text).toBe("A");
    expect(randomSpy).toHaveBeenCalledTimes(2);
  });
});
