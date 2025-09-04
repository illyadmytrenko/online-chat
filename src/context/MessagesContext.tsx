import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import type Message from '../types/Message';

// eslint-disable-next-line react-refresh/only-export-components
export const MessagesContext = createContext<{
  messages: Message[];
  sendMessage: (msg: Message) => void;
  userId: string;
}>({
  messages: [],
  sendMessage: () => {},
  userId: '',
});

let socket: Socket;

export const MessagesProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    let storedId = localStorage.getItem('userId');
    if (!storedId) {
      storedId = crypto.randomUUID();
      localStorage.setItem('userId', storedId);
    }
    setUserId(storedId);
  }, []);

  useEffect(() => {
    socket = io('http://localhost:4000');

    socket.on('initMessages', (msgs: Message[]) => {
      setMessages(msgs);
    });

    socket.on('receiveMessage', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (msg: Message) => {
    socket.emit('sendMessage', msg);
  };

  return (
    <MessagesContext.Provider value={{ messages, sendMessage, userId }}>
      {children}
    </MessagesContext.Provider>
  );
};
