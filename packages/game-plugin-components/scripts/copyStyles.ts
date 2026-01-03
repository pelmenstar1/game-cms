import { copyStyles } from '@game-cms/codegen/copyStyles';
import path from 'node:path';

void copyStyles(path.join(import.meta.dirname, '../src'), 'src');
