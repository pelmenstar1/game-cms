export type UnknownObject = Record<PropertyKey, unknown>;

export type PlainValue =
  | string
  | number
  | boolean
  | null
  | PlainValue[]
  | {
      [K in string]: PlainValue;
    };
