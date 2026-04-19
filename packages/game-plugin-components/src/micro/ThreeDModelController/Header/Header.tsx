import {
  classNames,
  DarkModeIcon,
  DownloadIcon,
  IconButton,
  IconSwitchButton,
  LightbulbIcon,
  LightModeIcon,
  LoopIcon,
} from '@game-cms/ui';
import { useTranslation } from 'react-i18next';

import { BackgroundTheme, LightingType } from '../../ThreeDModelRenderer';
import styles from './Header.module.scss';

export interface HeaderProps {
  className?: string;
  backgroundTheme: BackgroundTheme;
  lightingType: LightingType;
  isAutoRotating: boolean;

  onSwitchTheme: () => void;
  onCycleLightingType: () => void;
  onToggleAutoRotate: () => void;
  onScreenshot: () => void;
}

export function Header({
  className,
  backgroundTheme,
  lightingType,
  isAutoRotating,
  onSwitchTheme,
  onCycleLightingType,
  onToggleAutoRotate,
  onScreenshot,
}: HeaderProps) {
  const { t } = useTranslation('game', {
    keyPrefix: 'micro.ThreeDModelController',
  });

  return (
    <div className={classNames(styles.root, className)}>
      <IconButton
        className={styles.button}
        title={t('switchTheme')}
        hover="fill"
        onClick={onSwitchTheme}
      >
        {backgroundTheme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>

      <IconButton
        className={styles.button}
        title={t(`lighting.${lightingType}`)}
        hover="fill"
        onClick={onCycleLightingType}
      >
        <LightbulbIcon />
      </IconButton>

      <IconSwitchButton
        className={styles.button}
        title={t('autoRotate')}
        hover="fill"
        checked={isAutoRotating}
        onCheckedChanged={onToggleAutoRotate}
      >
        <LoopIcon />
      </IconSwitchButton>

      <IconButton
        className={styles.button}
        title={t('screenshot')}
        hover="fill"
        onClick={onScreenshot}
      >
        <DownloadIcon />
      </IconButton>
    </div>
  );
}
