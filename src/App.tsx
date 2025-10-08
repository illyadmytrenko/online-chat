import './App.css';

import { LoginWindowProvider } from './context/LoginWindowContext';
import { UserProvider } from './context/UserContext';
import { MessagesProvider } from './context/MessagesContext';
import { SearchProvider } from './context/SearchContext';

import { ChatField } from './components/ChatField/ChatField';
import { LoginWindow } from './components/LoginWindow/LoginWindow';
import { ChatsPanel } from './components/ChatsPanel/ChatsPanel';

function App() {
  return (
    <LoginWindowProvider>
      <UserProvider>
        <MessagesProvider>
          <SearchProvider>
            <div className="flex">
              <ChatsPanel />
              <ChatField />
            </div>
            <LoginWindow />
          </SearchProvider>
        </MessagesProvider>
      </UserProvider>
    </LoginWindowProvider>
  );
}

export default App;
