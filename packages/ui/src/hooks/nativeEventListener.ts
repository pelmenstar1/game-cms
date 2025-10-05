type Destructor = () => void;
type Listener<This, Event> = (this: This, ev: Event) => void;

// A helper for useEffect to simplify this pattern.
// useEffect(() => {
//   const listener = () => {};
//
//   target.addEventListener(name, listener);
//   return () => target.removeEventListener(name, listener);
// });

export function addNativeEventListener<K extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  key: K,
  listener: Listener<HTMLElement, HTMLElementEventMap[K]>,
  options?: AddEventListenerOptions
): Destructor;

export function addNativeEventListener<K extends keyof WindowEventMap>(
  target: Window,
  key: K,
  listener: Listener<Window, WindowEventMap[K]>,
  options?: AddEventListenerOptions
): Destructor;

export function addNativeEventListener(
  target: HTMLElement | Window,
  key: keyof HTMLElementEventMap | keyof WindowEventMap,
  listener: (this: HTMLElement | Window, ev: Event) => void,
  options?: AddEventListenerOptions
): () => void {
  target.addEventListener(key, listener, options);

  return () => {
    target.removeEventListener(key, listener);
  };
}
