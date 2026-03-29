import { ToClientType } from '@game-cms/core';
import type z from 'zod';

import { gameData } from './schema/gameData.js';

export type GameData = z.infer<typeof gameData>;
export type ClientGameData = ToClientType<GameData>;
