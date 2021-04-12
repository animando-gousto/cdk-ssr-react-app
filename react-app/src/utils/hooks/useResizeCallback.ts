import { useMemo, useEffect, RefObject } from 'react';

const useResizeCallback = (ref: RefObject<HTMLElement>, cb: (rect: DOMRectReadOnly) => void) => {
  const ro = useMemo(() => new ResizeObserver(entries => {
    for (let entry of entries) {
      if (entry.contentRect) {
        cb(entry.contentRect)
      }
    }
  }), [cb])

  useEffect(() => {
    if (ref.current) {
      ro.observe(ref.current)
    }
    return () => {
      ro && ro.disconnect();
    }
  }, [ref, ro])
}

export default useResizeCallback
