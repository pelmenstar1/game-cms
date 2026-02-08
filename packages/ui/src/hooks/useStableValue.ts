/* eslint-disable react-hooks/refs */
import { useRef } from 'react';

export function useStableValue<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}
