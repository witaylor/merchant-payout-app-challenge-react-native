import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Returns state that updates immediately plus a debounced value that updates after
 * the given delay when the user stops typing. Useful for expensive validation
 * or API calls on form inputs.
 *
 * @param initialValue - Initial value
 * @param delayMs - Debounce delay in milliseconds
 * @returns [value, setValue, debouncedValue]
 */
export function useDebouncedState<T>(
  initialValue: T,
  delayMs: number,
): [T, (value: T) => void, T] {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setValueWithDebounce = useCallback(
    (newValue: T) => {
      setValue(newValue);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setDebouncedValue(newValue);
        timeoutRef.current = null;
      }, delayMs);
    },
    [delayMs],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [value, setValueWithDebounce, debouncedValue];
}
