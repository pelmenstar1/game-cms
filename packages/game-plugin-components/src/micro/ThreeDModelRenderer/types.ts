export type BackgroundTheme = 'light' | 'dark';

export type ModelStatus =
  | {
      type: 'loaded' | 'error';
    }
  | {
      type: 'loading';
      progress: number;
    };
