import * as React from 'react';

interface Props {
  ssr?: boolean
}
const App = ({ ssr }: Props) => <p>Hello from React (ssr={ssr ? 'true' : 'false'})</p>

export default App
