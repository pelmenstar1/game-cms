import type { RootContent } from 'hast';
import { createLowlight } from 'lowlight';
import React, { type Key, type ReactNode, useMemo } from 'react';

export interface LowlightTextProps {
  className?: string;
  lowlight: ReturnType<typeof createLowlight>;
  language: string;
  text: string;
}

function renderNodeContentArray(nodes: RootContent[]) {
  return nodes.map((item, i) => renderNodeContent(item, i));
}

function renderNodeContent(node: RootContent, key?: Key): ReactNode {
  if (node.type === 'text') {
    return node.value;
  } else if (node.type === 'element') {
    return React.createElement(
      node.tagName,
      { ...node.properties, key },
      ...renderNodeContentArray(node.children)
    );
  }

  return null;
}

export function LowlightText({ lowlight, language, text }: LowlightTextProps) {
  const root = useMemo(
    () => lowlight.highlight(language, text),
    [language, lowlight, text]
  );

  return renderNodeContentArray(root.children);
}
