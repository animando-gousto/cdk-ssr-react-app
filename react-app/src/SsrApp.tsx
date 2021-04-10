import * as React from 'react';
import Users from './pages/users'

interface Props {
  ssr?: boolean,
  data?: any,
}
const App = ({ ssr }: Props) => {
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
    <div>
      <p>Hello from React (ssr={ssr ? 'true' : 'false'}, hydrated={hydrated ? 'true' : 'false'})</p>
      <Users />
    </div>
  )
}

export default App
