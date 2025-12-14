import { classNames } from '../../utils/classNames';
import { OptionBase, type OptionBaseProps } from '../OptionBase';
import styles from './Checkbox.module.scss';

export function Checkbox({
  className,
  ...rest
}: Omit<OptionBaseProps, 'type'>) {
  return (
    <OptionBase
      className={classNames(styles.root, className)}
      {...rest}
      type="checkbox"
    />
  );
}
