import { useState, useContext } from 'react';
import { MessagesContext } from '../../context/MessagesContext';

import sendIcon from '../../assets/send.webp';
import emojiIcon from '../../assets/emoji.svg';

export const InputComponent = () => {
  const { sendPrivateMessage, receiverId, setIsNewMessageSent } = useContext(MessagesContext);

  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    sendPrivateMessage(receiverId, value);
    setValue('');

    setIsNewMessageSent(true);
    setTimeout(() => {
      setIsNewMessageSent(false);
    }, 10);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        className="w-full h-[70px] p-4 pl-14 border-2 border-gray-300 focus:border-[#9232d7] focus:outline-none bg-white text-gray-700 z-10"
        onChange={(e) => setValue(e.target.value)}
        value={value}
        placeholder="Message"
      />
      <button type="button" className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <img src={emojiIcon} alt="send icon" className="w-[24px] h-[24px]" />
      </button>
      <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <img src={sendIcon} alt="send icon" className="w-[50px] h-[50px]" />
      </button>
    </form>
  );
};
