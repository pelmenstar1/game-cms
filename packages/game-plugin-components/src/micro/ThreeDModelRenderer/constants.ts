export const LIGHTING_TYPES = ['ambient', 'directional', 'hemisphere'] as const;
export type LightingType = (typeof LIGHTING_TYPES)[number];
