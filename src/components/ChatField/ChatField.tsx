import { useContext } from 'react';
import { MessagesContext } from '../../context/MessagesContext';

import { InputComponent } from '../Input/Input';
import { MessagesField } from '../MessagesField/MessagesField';
import { ChatTopPanel } from '../ChatTopPanel/ChatTopPanel';

import chatBg from '../../assets/chat-bg.webp';

export const ChatField = () => {
  const { messages, receiverUser } = useContext(MessagesContext);

  return (
    <div
      className="h-[100vh] flex-[0_0_75%] flex flex-col justify-between bg-cover bg-center"
      style={{ backgroundImage: `url(${chatBg})` }}
    >
      <div className="h-full w-[75vw] absolute left-[25vw] inset-0 bg-purple-900/60 mix-blend-multiply pointer-events-none" />
      {receiverUser.userId && <ChatTopPanel receiverUser={receiverUser} />}
      <div className="h-[100vh] flex flex-col justify-end flex-1 overflow-y-auto scroll-none px-10 pt-0">
        <MessagesField messages={messages} receiverUser={receiverUser} />
      </div>
      {receiverUser.userId && <InputComponent />}
    </div>
  );
};
