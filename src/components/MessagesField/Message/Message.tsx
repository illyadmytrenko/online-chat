import { useContext } from 'react';

import { UserContext } from '../../../context/UserContext';

export const Message = ({
  message,
  senderId,
  isHighlighted,
}: {
  message: string;
  senderId: string | null;
  isHighlighted?: boolean;
}) => {
  const { user } = useContext(UserContext);

  const isMe = senderId === user.userId;
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[60%] px-3 py-2 rounded-lg break-words z-10 ${
          isMe ? 'bg-[#9232d7] text-white self-end' : 'bg-gray-200 text-black self-start'
        } ${isHighlighted ? ' p-1 animate-pulse rounded-lg bg-yellow-300 ' : ''}`}
      >
        {message}
      </div>
    </div>
  );
};
