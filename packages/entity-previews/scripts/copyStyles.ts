import path from 'node:path';

import { copyStyles } from '@game-cms/codegen/copyStyles';

void copyStyles(path.join(import.meta.dirname, '../src'));
