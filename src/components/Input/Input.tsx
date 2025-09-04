import { useState, useContext } from 'react';
import { MessagesContext } from '../../context/MessagesContext';

export const InputComponent = () => {
  const { sendMessage } = useContext(MessagesContext);

  const [value, setValue] = useState('');

  const senderId = localStorage.getItem('userId');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    sendMessage({ message: value, senderId: senderId });
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="border-2 border-amber-950 absolute bottom-5 right-5"
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
    </form>
  );
};
