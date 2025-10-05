import { ReactNode } from 'react';
import styles from './NavTabs.module.scss';
import { classNames } from '../../utils/classNames';
import { Link } from '../Link';
import { useLocation } from 'react-router';

export interface NavTabsProps {
  className?: string;
  items: {
    icon: ReactNode;
    text: string;
    href: string;
  }[];
}

export function NavTabs({ className, items }: NavTabsProps) {
  const currentLocation = useLocation();
  console.log(1);

  return (
    <div className={classNames(styles.root, className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          className={classNames(
            styles.item,
            currentLocation.pathname === item.href && styles['item-active']
          )}
          to={item.href}
          title={item.text}
        >
          {item.icon}
          {item.text}
        </Link>
      ))}
    </div>
  );
}
