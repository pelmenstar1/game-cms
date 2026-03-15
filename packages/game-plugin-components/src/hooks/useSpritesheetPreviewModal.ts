import { namedLazy, useModalType } from '@game-cms/ui';

const SpritesheetPreviewModal = namedLazy(
  () => import('../micro/SpritesheetPreviewModal'),
  'SpritesheetPreviewModal'
);

export function useSpritesheetPreviewModal() {
  return useModalType(SpritesheetPreviewModal);
}
