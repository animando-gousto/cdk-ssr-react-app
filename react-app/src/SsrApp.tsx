import * as React from 'react';

interface Props {
  ssr?: boolean,
  data?: any,
}
const App = ({ ssr, data }: Props) => {
  const timeoutRef = React.useRef<any>();
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setHydrated(true)

    }, 500)
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    }
  }, [])

  return (
    <p>Hello from React (ssr={ssr ? 'true' : 'false'}, hydrated={hydrated ? 'true' : 'false'}, data=${JSON.stringify(data)})</p>
  )
}

export default App
