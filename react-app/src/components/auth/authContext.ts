import { createContext } from 'react';

interface AuthContext {
  user?: {
    id: string,
  },
}
const authContext = createContext<AuthContext | void>(undefined);

export default authContext;
