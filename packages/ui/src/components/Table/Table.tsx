import { ComponentProps } from 'react';

import { Typography } from '../Typography';
import styles from './Table.module.scss';
import { classNames } from '../../utils/classNames';

export interface TableProps extends ComponentProps<'table'> {
  numbered?: boolean;
  columns: string[];
  data: string[][];
}

function Th(props: ComponentProps<'th'>) {
  return <Typography as="th" {...props} />;
}

export function Table({
  className,
  numbered,
  columns,
  data,
  ...rest
}: TableProps) {
  return (
    <table className={classNames(styles.root, className)} {...rest}>
      <thead>
        <tr>
          {/* Empty th is needed here to take space, because numbers is an artificial column - we don't have any name */}
          {numbered && <Th aria-label="№"></Th>}
          {columns.map((value) => (
            <Th key={value}>{value}</Th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {numbered && <Th>{i + 1}</Th>}
            {row.map((value) => (
              <Th key={value}>{value}</Th>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
