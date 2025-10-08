import { useContext, useEffect, useState } from 'react';
import type User from '../../types/User';
import { Search } from '../Search/Search';
import { ChatsIconsPanel } from '../ChatsIconsPanel/ChatsIconsPanel';
import axios from 'axios';

import noUserImageIcon from '../../assets/noUserImage.webp';
import { UserContext } from '../../context/UserContext';
import { MessagesContext } from '../../context/MessagesContext';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export const ChatsPanel = () => {
  const { user } = useContext(UserContext);
  const { setReceiverUser } = useContext(MessagesContext);

  const [searchValue, setSearchValue] = useState('');
  const [foundUser, setFoundUser] = useState<User>({} as User);

  function handleSearch(input: string) {
    setSearchValue(input);
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/user/nickname/${searchValue}`);
        setFoundUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (searchValue) {
      getUser();
    } else {
      setFoundUser({} as User);
    }
  }, [searchValue]);

  return (
    <div className="flex flex-col flex-[0_0_25%] border-r-2 border-gray-400 bg-purple-300/80">
      <Search handleSearch={handleSearch} />
      <div className="flex-[1_1_auto] p-4">
        {foundUser?.userId && user.userId !== foundUser.userId && (
          <div
            className="p-3 flex items-center gap-2 bg-amber-400 rounded-2xl cursor-pointer"
            onClick={() => setReceiverUser(foundUser)}
          >
            <img src={noUserImageIcon} alt="no user image icon" className="w-[40px] h-[40px]" />
            {foundUser.userName}
          </div>
        )}
      </div>
      <ChatsIconsPanel />
    </div>
  );
};
