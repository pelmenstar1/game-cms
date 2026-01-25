import type {
  AvifOptions,
  FormatEnum,
  GifOptions,
  HeifOptions,
  Jp2Options,
  JpegOptions,
  JxlOptions,
  OutputOptions,
  PngOptions,
  RawOptions,
  Sharp,
  TiffOptions,
  WebpOptions,
} from 'sharp';

export type AnyFormatOptions =
  | OutputOptions
  | JpegOptions
  | PngOptions
  | WebpOptions
  | AvifOptions
  | HeifOptions
  | JxlOptions
  | GifOptions
  | Jp2Options
  | RawOptions
  | TiffOptions;

export type ImageFormatWithOutput = {
  [K in keyof FormatEnum]: Sharp extends Record<K, unknown> ? K : never;
}[keyof FormatEnum];
