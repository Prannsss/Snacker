
"use client";

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((val: T) => T)) => void;

export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>, boolean] {
  const [isLoading, setIsLoading] = useState(true);

  // Function to read value from localStorage
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) { // If no item, return initialValue
        return initialValue;
      }
      // Ensure that if parsing fails, initialValue is returned.
      try {
        return JSON.parse(item) as T;
      } catch (parseError) {
        console.warn(`Error parsing localStorage key "${key}":`, parseError);
        return initialValue;
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  // State to store our value. Initialize with initialValue, then load from localStorage in useEffect.
  const [storedValue, setStoredValueState] = useState<T>(initialValue);

  // useEffect to load the value from localStorage when the component mounts or key/readValue changes.
  useEffect(() => {
    setStoredValueState(readValue());
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, readValue]); // readValue is stable if initialValue and key are stable.

  // Stable setter function
  const setValue: SetValue<T> = useCallback(
    (value) => {
      if (typeof window === 'undefined') {
        console.warn(
          `Tried setting localStorage key “${key}” even though environment is not a client`
        );
        return;
      }
      try {
        // Use the functional update form of useState's setter
        // This ensures we're working with the latest state value if `value` is a function
        setStoredValueState(currentStoredValue => {
          const valueToStore = value instanceof Function ? value(currentStoredValue) : value;
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          return valueToStore;
        });
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key] // Depends only on `key`, so it's stable.
  );

  return [storedValue, setValue, isLoading];
}
