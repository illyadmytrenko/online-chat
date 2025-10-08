import { useContext, useEffect, useState } from 'react';
import type User from '../../types/User';
import { Search } from '../Search/Search';
import { ChatsIconsPanel } from '../ChatsIconsPanel/ChatsIconsPanel';
import axios from 'axios';

import noUserImageIcon from '../../assets/noUserImage.webp';
import { UserContext } from '../../context/UserContext';
import { MessagesContext } from '../../context/MessagesContext';
import type Chat from '../../types/Chat';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export const ChatsPanel = () => {
  const { user, onlineUsersIds } = useContext(UserContext);
  const { setReceiverId, isNewMessageSent } = useContext(MessagesContext);

  const [searchValue, setSearchValue] = useState('');
  const [foundUser, setFoundUser] = useState<User>({} as User);
  const [userChats, setUserChats] = useState<Chat[]>([]);
  const [chatUsers, setChatUsers] = useState<User[]>([]);

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

  useEffect(() => {
    const getUserChats = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/message/${user.userId}`);
        setUserChats(data);
      } catch (err) {
        console.error(err);
      }
    };
    getUserChats();
  }, [user, isNewMessageSent]);

  useEffect(() => {
    // Создаем уникальный список partnerId из чатов
    const uniquePartnerIds = Array.from(
      new Set(userChats.map((chat) => chat.partnerId).filter((id) => id !== user.userId)),
    );

    const getChatUsers = async () => {
      try {
        const usersData = await Promise.all(
          uniquePartnerIds.map((id) => axios.get(`${serverUrl}/api/user/${id}`)),
        );
        setChatUsers(usersData.map((res) => res.data));
      } catch (err) {
        console.error(err);
      }
    };

    if (uniquePartnerIds.length > 0) {
      getChatUsers();
    } else {
      setChatUsers([]);
    }
  }, [userChats, user]);

  function handleSearch(input: string) {
    setSearchValue(input.trim());
  }

  function handleBlur() {
    setTimeout(() => {
      setSearchValue('');
    }, 100);
  }

  return (
    <div className="flex flex-col flex-[0_0_25%] border-r-2 border-gray-400 bg-purple-300/80">
      <Search searchValue={searchValue} handleSearch={handleSearch} handleBlur={handleBlur} />
      <div className="flex-[1_1_auto] p-4 flex flex-col gap-3">
        {searchValue && foundUser?.userId && user.userId !== foundUser.userId && (
          <div
            className="p-3 flex items-center gap-2 bg-amber-400 rounded-2xl cursor-pointer"
            onClick={() => setReceiverId(foundUser.userId)}
          >
            <div className="relative">
              <img src={noUserImageIcon} alt="no user image icon" className="w-[40px] h-[40px]" />
              {onlineUsersIds.includes(foundUser.userId) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-purple-600 border-2 border-white rounded-full" />
              )}
            </div>
            {foundUser.userName}
          </div>
        )}
        {!searchValue &&
          userChats.map((chat) => {
            const isOnline = onlineUsersIds.includes(chat.partnerId);
            return (
              chat && (
                <div
                  className="p-3 flex items-center justify-between gap-3 bg-amber-400 rounded-2xl cursor-pointer"
                  onClick={() => setReceiverId(chat.partnerId)}
                  key={chat.partnerId}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <img
                        src={noUserImageIcon}
                        alt="no user image icon"
                        className="w-[40px] h-[40px]"
                      />
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-purple-600 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="font-medium">
                        {chatUsers.find((user) => user.userId === chat.partnerId)?.userName}
                      </p>
                      <p className="text-sm text-gray-700">{chat.lastMessage}</p>
                    </div>
                  </div>

                  <p className="self-start text-sm text-gray-600 whitespace-nowrap">
                    {new Date(chat.createdAt).toLocaleDateString('en-US')}
                  </p>
                </div>
              )
            );
          })}
      </div>
      <ChatsIconsPanel />
    </div>
  );
};
