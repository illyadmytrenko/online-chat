import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import type Message from '../types/Message';
import type User from '../types/User';

// eslint-disable-next-line react-refresh/only-export-components
export const MessagesContext = createContext<{
  messages: Message[];
  sendPrivateMessage: (receiverId: string, text: string) => void;
  receiverUser: User;
  setReceiverUser: (receiverUser: User) => void;
}>({
  messages: [],
  sendPrivateMessage: () => {},
  receiverUser: {} as User,
  setReceiverUser: () => {},
});

let socket: Socket;

export const MessagesProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [receiverUser, setReceiverUser] = useState<User>({} as User);

  useEffect(() => {
    socket = io('http://localhost:5050', {
      withCredentials: true,
      transports: ['websocket'],
    });
    // socket = io('https://online-chat-illya.onrender.com');

    socket.on('initMessages', (msgs: Message[]) => {
      setMessages(msgs);
    });

    socket.on('receivePrivateMessage', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendPrivateMessage = (receiverId: string, text: string) => {
    socket.emit('sendPrivateMessage', { receiverId, text });
  };

  return (
    <MessagesContext.Provider
      value={{ messages, sendPrivateMessage, receiverUser, setReceiverUser }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
