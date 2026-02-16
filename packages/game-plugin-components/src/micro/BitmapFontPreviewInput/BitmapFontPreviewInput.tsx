import { classNames, TextInput } from '@game-cms/ui';
import { BitmapFont } from 'pixi.js';
import { useState } from 'react';

import styles from './BitmapFontPreviewInput.module.scss';
import { Renderer } from './components/Renderer';

export interface BitmapFontPreviewInputProps {
  className?: string;
  font: BitmapFont;
}

function isValidText(text: string, font: BitmapFont) {
  // eslint-disable-next-line @typescript-eslint/no-misused-spread
  return [...text].every((char) => char in font.chars);
}

export function BitmapFontPreviewInput({
  className,
  font,
}: BitmapFontPreviewInputProps) {
  const [text, setText] = useState(
    'The quick brown fox jumps over the lazy dog'
  );

  return (
    <div className={classNames(styles.root, className)}>
      <TextInput
        className={styles.input}
        value={text}
        onTextChanged={setText}
        error={
          !isValidText(text, font) &&
          'Text contains characters that are not in font'
        }
      />

      <Renderer text={text} font={font} />
    </div>
  );
}
