import { List } from '@game-cms/ui';

import { SpritesheetDataWithSize } from '../../../../../utils/spritesheet/types';
import { usePreviewTabContext } from '../../context';
import { AtlasItem } from '../AtlasItem';

export interface PrettyAtlasViewProps {
  className?: string;
  spritesheet: SpritesheetDataWithSize;
  imageUrl: string;
}

export function PrettyAtlasView({
  className,
  spritesheet,
  imageUrl,
}: PrettyAtlasViewProps) {
  const { selectedFrame, setSelectedFrame, setPinnedFrame } =
    usePreviewTabContext();

  const { size } = spritesheet.meta;

  return (
    <List className={className}>
      {Object.entries(spritesheet.frames).map(([name, { frame }]) => (
        <AtlasItem
          key={name}
          name={name}
          frame={frame}
          sheetSize={size}
          imageUrl={imageUrl}
          selected={selectedFrame === name}
          onClick={() => {
            setSelectedFrame(name);
            setPinnedFrame(name);
          }}
        />
      ))}
    </List>
  );
}
