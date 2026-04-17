import { GlobeIcon } from '../../icons';
import { classNames } from '../../utils/classNames';
import { Typography, type TypographyProps } from '../Typography';
import styles from './DateTimeUTC.module.scss';

export interface DateTimeUTCProps extends TypographyProps {
  className?: string;
  isCompact?: boolean;
  input: string | Date;
}

function resolveDate(date: string | Date) {
  if (typeof date === 'string') {
    return new Date(date);
  }

  return date;
}

function formatDateToParts(input: string | Date) {
  const text = resolveDate(input).toISOString();
  const tIndex = text.indexOf('T');

  return {
    date: text.slice(0, tIndex),
    time: text.slice(tIndex + 1, -1),
  };
}

export function DateTimeUTC({
  className,
  input,
  isCompact,
  ...rest
}: DateTimeUTCProps) {
  const { date, time } = formatDateToParts(input);

  const content = isCompact ? (
    `${date}T${time}`
  ) : (
    <>
      <span>{date}</span>
      <span className={styles['t-span']}>T</span>
      <span>{time}</span>

      <span title="Date and time are shown in UTC format">
        <GlobeIcon className={styles['globe-icon']} />
      </span>
    </>
  );

  return (
    <Typography className={classNames(styles.root, className)} {...rest}>
      {content}
    </Typography>
  );
}
