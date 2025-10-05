import { ReactNode } from 'react';

export type TabProps = {
  id?: string;
  className?: string;
  isSelected?: boolean;
  labelledBy?: string;

  tabId: string;
  title: string;

  children?: ReactNode;
};

export function Tab({
  id,
  className,
  isSelected,
  labelledBy,
  children,
}: TabProps) {
  return (
    <div
      id={id}
      className={className}
      role="tabpanel"
      aria-hidden={!isSelected}
      aria-labelledby={labelledBy}
    >
      {children}
    </div>
  );
}
