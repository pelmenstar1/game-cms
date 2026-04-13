import jsonLanguage from 'highlight.js/lib/languages/json';
import { createLowlight } from 'lowlight';
import { useMemo } from 'react';

import { classNames } from '../../utils/classNames';
import { LowlightText } from '../LowlightText';
import styles from './JsonRawText.module.scss';

export interface JsonRawTextProps {
  className?: string;
  text: string;
}

export function JsonRawText({ className, text }: JsonRawTextProps) {
  const lowlight = useMemo(() => createLowlight({ json: jsonLanguage }), []);

  return (
    <pre className={classNames(styles['root'], className)}>
      <LowlightText lowlight={lowlight} language="json" text={text} />
    </pre>
  );
}
