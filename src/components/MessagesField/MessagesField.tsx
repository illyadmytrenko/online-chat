import { useContext, useEffect, useRef } from 'react';
import { SearchContext } from '../../context/SearchContext';

import type MessageType from '../../types/Message';
import { Message } from '../MessagesField/Message/Message';
import type User from '../../types/User';

export const MessagesField = ({
  messages,
  receiverUser,
}: {
  messages: MessageType[];
  receiverUser: User;
}) => {
  const { searchString } = useContext(SearchContext);

  const highlightedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (searchString) {
      const found = messages.find((msg) => msg.text === searchString);
      if (found && highlightedRef.current) {
        highlightedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [messages, searchString]);

  return (
    <div className="w-full flex flex-col justify-end gap-2">
      {messages.map((msg, index) => {
        const isHighlighted = searchString !== '' && msg.text.includes(searchString.trim());
        return (
          (receiverUser.userId === msg.receiverId || receiverUser.userId === msg.senderId) && (
            <div
              key={index}
              ref={isHighlighted ? highlightedRef : null}
              className="first:mt-4 last:mb-4"
            >
              <Message message={msg.text} senderId={msg.senderId} isHighlighted={isHighlighted} />
            </div>
          )
        );
      })}
    </div>
  );
};
