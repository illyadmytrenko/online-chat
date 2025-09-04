import './App.css';
import { ChatField } from './components/ChatField/ChatField';
import { MessagesProvider } from './context/MessagesContext';

function App() {
  return (
    <MessagesProvider>
      <ChatField />
    </MessagesProvider>
  );
}

export default App;
