import { act, renderHook } from "@testing-library/react-native";

import { useDebouncedState } from "./use-debounced-state";

jest.useFakeTimers();

describe("useDebouncedState", () => {
  it("returns initial value and updates immediately on set", () => {
    const { result } = renderHook(() => useDebouncedState("", 500));

    expect(result.current[0]).toBe("");
    expect(result.current[2]).toBe("");

    act(() => {
      result.current[1]("hello");
    });

    expect(result.current[0]).toBe("hello");
    expect(result.current[2]).toBe(""); // debounced not yet updated
  });

  it("updates debounced value after delay", () => {
    const { result } = renderHook(() => useDebouncedState("", 500));

    act(() => {
      result.current[1]("foo");
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current[0]).toBe("foo");
    expect(result.current[2]).toBe("foo");
  });

  it("cancels previous timeout when set is called again before delay", () => {
    const { result } = renderHook(() => useDebouncedState("", 500));

    act(() => {
      result.current[1]("first");
    });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    act(() => {
      result.current[1]("second");
    });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current[2]).toBe(""); // "first" should not have fired yet

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current[2]).toBe("second"); // only "second" should update
  });

  it("cleans up timeout on unmount", () => {
    const { result, unmount } = renderHook(() => useDebouncedState("", 500));

    act(() => {
      result.current[1]("x");
    });
    unmount();
    act(() => {
      jest.advanceTimersByTime(500);
    });
    // No errors = cleanup worked
  });
});
