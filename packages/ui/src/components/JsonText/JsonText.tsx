import { prettifyJson } from '@game-cms/shared/json';
import jsonLanguage from 'highlight.js/lib/languages/json';
import { createLowlight } from 'lowlight';
import { useMemo, useState } from 'react';

import { classNames } from '../../utils/classNames';
import { Checkbox } from '../Checkbox';
import { LowlightText } from '../LowlightText';
import styles from './JsonText.module.scss';

export interface JsonTextProps {
  className?: string;
  text: string;
}

export function JsonText({ className, text }: JsonTextProps) {
  const [isPretty, setPretty] = useState(false);

  const effectiveText = useMemo(
    () => (isPretty ? prettifyJson(text) : text),
    [isPretty, text]
  );

  const lowlight = useMemo(() => createLowlight({ json: jsonLanguage }), []);

  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.header}>
        <Checkbox checked={isPretty} onCheckedChanged={setPretty}>
          Prettify
        </Checkbox>
      </div>

      <pre className={styles.content}>
        <LowlightText
          lowlight={lowlight}
          language="json"
          text={effectiveText}
        />
      </pre>
    </div>
  );
}
