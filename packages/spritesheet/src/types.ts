export type Point = { x: number; y: number };
export type Size = { width: number; height: number };

export type Rect = Point & Size;

export interface RotatedRect extends Rect {
  rotated?: boolean;
}

export interface TaggedRect<Tag> extends Rect {
  tag: Tag;
}

export interface TaggedSize<Tag> extends Size {
  tag: Tag;
}

export type SpriteRect<Tag> = TaggedRect<Tag> & RotatedRect;

export type SpritesheetMapEntrySource = {
  data: Uint8Array;
  size: Size;
};

export type SpritesheetMapLimits = {
  bounds: Rect;
};

export type SpritesheetMapEntry<Tag> = {
  source: SpritesheetMapEntrySource;
  target: SpriteRect<Tag>;
};

export type SpritesheetMappingResult<Tag> = {
  rects: SpriteRect<Tag>[];
};

export interface SpritesheetMap {
  entries: SpritesheetMapEntry<string>[];
  output: SpritesheetMapLimits;
}

export type SpritesheetMappingAlgorithm = <Tag>(
  rects: TaggedSize<Tag>[],
  limits: Size
) => SpritesheetMappingResult<Tag>;
