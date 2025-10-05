import { useEffect } from 'react';

function setScrollbarEnabled(value: boolean) {
  document.body.style.overflowY = value ? 'auto' : 'hidden';
}

export function useScrollbar(enabled: boolean) {
  useEffect(() => {
    setScrollbarEnabled(enabled);

    return () => {
      setScrollbarEnabled(true);
    };
  }, [enabled]);
}
