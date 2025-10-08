import settingsIcon from '../../assets/settings.webp';
import chatIcon from '../../assets/chat.webp';

export const ChatsIconsPanel = () => {
  return (
    <div className="h-[70px] p-4  flex gap-3 justify-between items-center border-t-2 border-gray-400">
      <button type="button" className="w-[32px] h-[32px]">
        <img src={chatIcon} alt="chat icon" />
      </button>
      <button type="button" className="w-[32px] h-[32px]">
        <img src={settingsIcon} alt="settings icon" />
      </button>
    </div>
  );
};
