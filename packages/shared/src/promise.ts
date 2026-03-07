export function rejectedPromiseFactory(message: string) {
  return () => Promise.reject(new Error(message));
}
