
import * as React from 'react';

const ssrContext = React.createContext<boolean>(false);

export const useSsr = () => React.useContext(ssrContext);
export default ssrContext;
