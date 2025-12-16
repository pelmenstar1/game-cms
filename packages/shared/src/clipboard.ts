/* eslint-disable @typescript-eslint/no-deprecated */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */

export function copyToClipboard(value: string): Promise<void> {
  if ('clipboard' in navigator) {
    return navigator.clipboard.writeText(value);
  } else if (
    document.queryCommandSupported &&
    document.queryCommandSupported('copy')
  ) {
    document.execCommand('copy', false, value);

    return Promise.resolve();
  }

  return Promise.reject(new Error("Environment doesn't support copying"));
}
