import { useContext, useState } from 'react';
import { SearchContext } from '../../context/SearchContext';

import defaultUserIcon from '../../assets/defaultUser.webp';
import searchIcon from '../../assets/search.webp';
import phoneIcon from '../../assets/phone.webp';
import dotsIcon from '../../assets/dots.webp';
import type User from '../../types/User';

export const ChatTopPanel = ({ receiverUser }: { receiverUser: User }) => {
  const [isSearch, setIsSearch] = useState(false);

  const { setSearchString } = useContext(SearchContext);

  const handleSearchButtonClick = () => {
    setIsSearch(!isSearch);
    setSearchString('');
  };

  return (
    <div className="w-full z-10">
      <div className="h-[7vh] flex items-center justify-between px-4 py-2 bg-gray-50">
        <div className="flex items-center gap-2">
          <img src={defaultUserIcon} alt="default user icon" className="w-[40px] h-[40px]" />
          <div>
            <h2 className="font-bold">{receiverUser.userName}</h2>
            <h6>Last seen 5 minutes ago</h6>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="w-[24px] h-[24px]" onClick={handleSearchButtonClick}>
            <img src={searchIcon} alt="search icon" />
          </button>
          <button type="button" className="w-[24px] h-[24px]">
            <img src={phoneIcon} alt="phone icon" />
          </button>
          <button type="button" className="w-[24px] h-[24px]">
            <img src={dotsIcon} alt="dots icon" />
          </button>
        </div>
      </div>
      {isSearch && (
        <input
          className="w-full h-12 px-5 bg-gray-300 outline-none border-t-2 border-[#9232d7] z-10"
          placeholder="Search"
          onChange={(e) => setSearchString(e.target.value)}
        />
      )}
    </div>
  );
};
