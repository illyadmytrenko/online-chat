import { useContext } from 'react';

import { MessagesContext } from '../../../context/MessagesContext';

export const Message = ({ message, senderId }: { message: string; senderId: string | null }) => {
  const { userId } = useContext(MessagesContext);

  const isMe = senderId === userId;
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`px-3 py-2 rounded-lg max-w-[60%] break-words ${
          isMe ? 'bg-amber-500 text-white self-end' : 'bg-gray-200 text-black self-start'
        }`}
      >
        {message}
      </div>
    </div>
  );
};
