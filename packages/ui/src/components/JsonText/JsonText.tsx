import { prettifyJson } from '@game-cms/shared/json';
import jsonLanguage from 'highlight.js/lib/languages/json';
import { createLowlight } from 'lowlight';
import { useMemo, useState } from 'react';

import { DownloadIcon } from '../../icons';
import { classNames } from '../../utils/classNames';
import { Checkbox } from '../Checkbox';
import { DownloadLink } from '../DownloadLink';
import { IconComponentBase } from '../IconComponentBase';
import { LowlightText } from '../LowlightText';
import { Toolbar } from '../Toolbar';
import styles from './JsonText.module.scss';

export interface JsonTextProps {
  className?: string;
  text: string;
  filename?: string;
}

export function JsonText({ className, text, filename }: JsonTextProps) {
  const [isPretty, setPretty] = useState(false);

  const effectiveText = useMemo(
    () => (isPretty ? prettifyJson(text) : text),
    [isPretty, text]
  );

  const lowlight = useMemo(() => createLowlight({ json: jsonLanguage }), []);

  const dataBlob = useMemo(
    () =>
      new Blob([text], {
        type: 'application/json',
      }),
    [text]
  );

  return (
    <div className={classNames(styles.root, className)}>
      <Toolbar>
        <Checkbox checked={isPretty} onCheckedChanged={setPretty}>
          Prettify
        </Checkbox>

        <IconComponentBase
          as={DownloadLink}
          data={dataBlob}
          download={filename}
          hover="fill"
        >
          <DownloadIcon />
        </IconComponentBase>
      </Toolbar>

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
