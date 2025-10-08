import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import type Message from '../types/Message';

// eslint-disable-next-line react-refresh/only-export-components
export const MessagesContext = createContext<{
  messages: Message[];
  sendPrivateMessage: (receiverId: string, text: string) => void;
  receiverId: string;
  setReceiverId: (receiverId: string) => void;
  isNewMessageSent: boolean;
  setIsNewMessageSent: (isMessageSent: boolean) => void;
}>({
  messages: [],
  sendPrivateMessage: () => {},
  receiverId: '',
  setReceiverId: () => {},
  isNewMessageSent: false,
  setIsNewMessageSent: () => {},
});

let socket: Socket;

export const MessagesProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [receiverId, setReceiverId] = useState('');
  const [isNewMessageSent, setIsNewMessageSent] = useState(false);

  useEffect(() => {
    // socket = io('http://localhost:5050', {
    //   withCredentials: true,
    //   transports: ['websocket'],
    // });
    socket = io('https://online-chat-illya.onrender.com');

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
      value={{
        messages,
        sendPrivateMessage,
        receiverId,
        setReceiverId,
        isNewMessageSent,
        setIsNewMessageSent,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
