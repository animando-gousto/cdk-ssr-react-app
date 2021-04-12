import { useMemo, useEffect, RefObject } from 'react';
import { useSsr } from '../../context/ssr';

const useResizeCallback = (ref: RefObject<HTMLElement>, cb: (rect: DOMRectReadOnly) => void) => {
  const ssr = useSsr();
  const ro = useMemo(() => {
    if (ssr) {
      return null;
    }
    return new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.contentRect) {
          cb(entry.contentRect)
        }
      }
    })
  }, [cb])

  useEffect(() => {
    if (ref.current && ro) {
      ro.observe(ref.current)
    }
    return () => {
      ro && ro.disconnect();
    }
  }, [ref, ro])
}

export default useResizeCallback
