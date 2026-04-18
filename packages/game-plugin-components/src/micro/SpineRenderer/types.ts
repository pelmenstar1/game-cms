export type SpineData = {
  atlas: string;
  skeleton: string;
  images: string[];
};

export type OnAnimationTimeChanged = (time: number, duration: number) => void;
