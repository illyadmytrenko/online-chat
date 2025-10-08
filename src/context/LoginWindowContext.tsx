import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const LoginWindowContext = createContext<{
  isLoginWindow: boolean;
  setIsLoginWindow: (isLoginWindow: boolean) => void;
}>({
  isLoginWindow: false,
  setIsLoginWindow: () => {},
});

const serverUrl = import.meta.env.VITE_SERVER_URL;

export const LoginWindowProvider = ({ children }: { children: ReactNode }) => {
  const [isLoginWindow, setIsLoginWindow] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/user/check-auth`, {
          withCredentials: true,
        });

        if (data.authenticated) {
          setIsLoginWindow(false);
        } else {
          setIsLoginWindow(true);
        }
      } catch (err) {
        console.error(err);
        setIsLoginWindow(true);
      }
    };

    checkAuth();
  }, []);

  return (
    <LoginWindowContext.Provider value={{ isLoginWindow, setIsLoginWindow }}>
      {children}
    </LoginWindowContext.Provider>
  );
};
