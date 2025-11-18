
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// The context is created with an undefined default value, so we must check for it.
// The provider will always be available in the component tree.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useAuth = () => useContext(AuthContext)!;
