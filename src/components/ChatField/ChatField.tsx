import { useContext } from 'react';
import { MessagesContext } from '../../context/MessagesContext';

import { InputComponent } from '../Input/Input';
import { MessagesField } from '../MessagesField/MessagesField';

export const ChatField = () => {
  const { messages } = useContext(MessagesContext);

  return (
    <div className="border-4 border-amber-500 h-[100vh] w-[80vw] relative left-[20vw]">
      <InputComponent />
      <MessagesField messages={messages} />
    </div>
  );
};
