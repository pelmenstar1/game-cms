import z from 'zod';

export const entityVariant = z.enum(['published', 'draft']);
