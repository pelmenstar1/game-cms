import type { EntityId } from '@game-cms/types';
import { classNames, Labeled } from '@game-cms/ui';

import { RemoteComponent, type RemoteComponentProps } from '../RemoteComponent';
import styles from './EntityComponent.module.scss';

export interface EntityComponentProps<T extends EntityId>
  extends RemoteComponentProps<T> {
  className?: string;
  title: string;
}

export function EntityComponent<T extends EntityId>({
  className,
  title,
  ...rest
}: EntityComponentProps<T>) {
  return (
    <Labeled title={title} className={classNames(styles.root, className)}>
      <RemoteComponent {...rest} />
    </Labeled>
  );
}
