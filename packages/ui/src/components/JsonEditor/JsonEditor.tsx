import { isValidJson, prettifyJson } from '@game-cms/shared/json';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { EditorContent, type EditorEvents, useEditor } from '@tiptap/react';
import jsonLanguage from 'highlight.js/lib/languages/json';
import { createLowlight } from 'lowlight';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { CheckmarkIcon, ErrorIcon } from '../../icons';
import { classNames } from '../../utils/classNames';
import { Button } from '../Button';
import { Typography } from '../Typography';
import styles from './JsonEditor.module.scss';

export interface JsonEditorProps {
  className?: string;
  text: string;
  allowEmpty?: boolean;
  onTextChanged?: (text: string) => void;
}

function createCodeBlockJson(text: string) {
  return {
    type: 'codeBlock',
    attrs: {
      language: 'json',
    },
    content: [{ type: 'text', text }],
  };
}

export function JsonEditor({
  className,
  text,
  allowEmpty,
  onTextChanged,
}: JsonEditorProps) {
  const currentText = useRef(text);
  const lowlight = useMemo(() => createLowlight({ json: jsonLanguage }), []);
  const isValid = useMemo(
    () => (allowEmpty && text.length === 0) || isValidJson(text),
    [allowEmpty, text]
  );

  const onUpdate = useCallback(
    ({ editor }: EditorEvents['update']) => {
      const newText = editor.getText();
      currentText.current = newText;

      onTextChanged?.(newText);
    },
    [onTextChanged]
  );

  const editor = useEditor({
    extensions: [
      Text,
      Document,
      Paragraph,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: {
      type: 'doc',
      content: [createCodeBlockJson(text)],
    },
    onUpdate,
  });

  const onPrettify = useCallback(() => {
    if (text.length > 0) {
      onTextChanged?.(prettifyJson(text));
    }
  }, [onTextChanged, text]);

  useEffect(() => {
    if (text !== currentText.current) {
      currentText.current = text;

      const { tr } = editor.state;
      const codeBlockNode = editor.state.schema.nodeFromJSON(
        createCodeBlockJson(text)
      );

      tr.replaceWith(0, currentText.current.length, codeBlockNode);
      editor.view.dispatch(tr);
    }
  }, [editor, text]);

  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.header}>
        {isValid && (
          <Button
            buttonVariant="flat"
            variant="caption"
            className={styles.prettify}
            onClick={onPrettify}
          >
            Prettify
          </Button>
        )}

        <Typography
          variant="caption"
          hasIcon
          className={classNames(
            styles['validation-indicator'],
            !isValid && styles['validation-indicator-invalid']
          )}
        >
          {isValid ? <CheckmarkIcon /> : <ErrorIcon />}
          {isValid ? 'OK' : 'Parse error'}
        </Typography>
      </div>

      <EditorContent
        autoComplete="off"
        autoCorrect="false"
        spellCheck="false"
        className={styles.content}
        editor={editor}
      />
    </div>
  );
}
