import { FileGroupPreviewRenderer } from '@game-cms/base-core';

import { SpineModal } from '../micro/SpineModal';
import { SpineData } from '../micro/SpineRenderer/types';

const Spine: FileGroupPreviewRenderer<{ spine: SpineData }> = SpineModal;

export default Spine;
