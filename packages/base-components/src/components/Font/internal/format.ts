export const fontFormats = ['ttf', 'otf', 'woff', 'woff2'] as const;

export type FontFormat = (typeof fontFormats)[number];
