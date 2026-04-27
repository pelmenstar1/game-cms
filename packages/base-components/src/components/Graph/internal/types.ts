export type PositionMeta = {
  position: {
    x: number;
    y: number;
  };
};

export type NodeWithMeta<T = unknown, Meta = PositionMeta> = {
  value: T;
  meta: Meta;
};
