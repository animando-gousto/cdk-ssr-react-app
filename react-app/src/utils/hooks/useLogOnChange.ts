import { useRef, useEffect } from 'react'

const useLogOnChange = ({ prop, propName, logger = console.log }: { prop: any, propName: string, logger?: (log: string) => void }) => {
  const ref = useRef(prop)
  const propNameRef = useRef(propName)
  useEffect(() => {
    logger(`${propNameRef.current} changed`);
    ref.current = prop;
  }, [prop]);
}

export default useLogOnChange
