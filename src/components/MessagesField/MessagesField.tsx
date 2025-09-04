import type MessageType from '../../types/Message';

import { Message } from '../MessagesField/Message/Message';
export const MessagesField = ({ messages }: { messages: MessageType[] }) => {
  return (
    <div className="absolute bottom-12 w-full px-4 overflow-y-auto max-h-[100%]">
      {messages.map((msg, index) => (
        <Message key={index} message={msg.message} senderId={msg.senderId} />
      ))}
    </div>
  );
};
