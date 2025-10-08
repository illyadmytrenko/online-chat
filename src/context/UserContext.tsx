import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type User from '../types/User';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<{
  user: User;
  setUser: (user: User) => void;
  onlineUsersIds: string[];
  setOnlineUsersIds: (onlineUsers: string[]) => void;
}>({
  user: {} as User,
  setUser: () => {},
  onlineUsersIds: [],
  setOnlineUsersIds: () => {},
});

const serverUrl = import.meta.env.VITE_SERVER_URL;

let socket: Socket;

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string>('');
  const [user, setUser] = useState<User>({} as User);
  const [onlineUsersIds, setOnlineUsersIds] = useState<string[]>([]);

  useEffect(() => {
    // socket = io('http://localhost:5050', {
    //   withCredentials: true,
    //   transports: ['websocket'],
    // });
    socket = io('https://online-chat-illya.onrender.com');

    socket.on('onlineUsers', (users: string[]) => {
      setOnlineUsersIds(users);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  console.log(onlineUsersIds);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/user/check-auth`, {
          withCredentials: true,
        });
        if (data.authenticated) {
          setUserId(data.user.id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      if (userId) {
        try {
          const { data } = await axios.get(`${serverUrl}/api/user/${userId}`);
          setUser(data);
        } catch (err) {
          console.error(err);
        }
      }
    };
    getUser();
  }, [userId]);

  return (
    <UserContext.Provider value={{ user, setUser, onlineUsersIds, setOnlineUsersIds }}>
      {children}
    </UserContext.Provider>
  );
};
