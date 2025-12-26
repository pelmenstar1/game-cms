import { classNames } from '../../../utils/classNames';
import { UnstyledOption } from '../../UnstyledOption';
import styles from './AnimationList.module.scss';

export interface AnimationListProps {
  className?: string;
  animations: string[];
  selectedAnimation: string | undefined;

  onAnimationSelected?: (value: string) => void;
}

export function AnimationList({
  className,
  animations,
  selectedAnimation,
  onAnimationSelected,
}: AnimationListProps) {
  return (
    <div className={classNames(styles['root'], className)}>
      {animations.map((name) => {
        const checked = selectedAnimation === name;

        const onChange = () => {
          onAnimationSelected?.(name);
        };

        return (
          <UnstyledOption
            className={classNames(
              styles['root-item'],
              checked && styles['root-item-checked']
            )}
            key={name}
            type="radio"
            weight="bold"
            checked={checked}
            onChange={onChange}
          >
            {name}
          </UnstyledOption>
        );
      })}
    </div>
  );
}
