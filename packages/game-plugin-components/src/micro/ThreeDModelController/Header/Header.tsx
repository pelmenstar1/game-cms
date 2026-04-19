import {
  classNames,
  DarkModeIcon,
  IconButton,
  LightbulbIcon,
  LightModeIcon,
} from '@game-cms/ui';
import { useTranslation } from 'react-i18next';

import { BackgroundTheme, LightingType } from '../../ThreeDModelRenderer';
import styles from './Header.module.scss';

export interface HeaderProps {
  className?: string;
  backgroundTheme: BackgroundTheme;
  lightingType: LightingType;

  onSwitchTheme: () => void;
  onCycleLightingType: () => void;
}

export function Header({
  className,
  backgroundTheme,
  lightingType,
  onSwitchTheme,
  onCycleLightingType,
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
    </div>
  );
}
