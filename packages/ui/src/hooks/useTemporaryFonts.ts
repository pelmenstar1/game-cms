import {
  datePrefixSource,
  pendingQueryResult,
  prefixedIdSource,
  type QueryResult,
} from '@game-cms/shared';
import { setAddMany, setDeleteMany } from '@game-cms/shared/collections';
import { useEffect, useState } from 'react';

const idSource = prefixedIdSource(datePrefixSource('useTemporaryFonts'));

export type FontDescriptor = {
  source: string;
  weight: number;
  style: 'normal' | 'italic';
};

export function useTemporaryFonts(fonts: readonly FontDescriptor[]) {
  const [result, setResult] =
    useState<QueryResult<string[]>>(pendingQueryResult());

  useEffect(() => {
    const fontFaces = fonts.map((font) => {
      const id = idSource();

      return new FontFace(id, `url(${font.source})`, {
        weight: font.weight.toString(),
        style: font.style,
      });
    });

    Promise.all(fontFaces.map((fontFace) => fontFace.load()))
      .then((loadedFonts) => {
        setAddMany(document.fonts, loadedFonts);

        setResult({
          status: 'success',
          value: loadedFonts.map((fontFace) => fontFace.family),
        });
      })
      .catch((error: unknown) => {
        setResult({
          status: 'error',
          error,
        });
      });

    return () => {
      setDeleteMany(document.fonts, fontFaces);
    };
  }, [fonts]);

  return result;
}
