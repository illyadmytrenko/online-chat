import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // на продакшене укажи домен фронта
  },
});

let messages = []; // временное хранилище (можно заменить на БД)

io.on('connection', (socket) => {
  console.log('Новый клиент подключился:', socket.id);

  // Отправляем историю сообщений новому клиенту
  socket.emit('initMessages', messages);

  // Слушаем сообщения
  socket.on('sendMessage', (message) => {
    messages.push(message);
    console.log(messages);
    io.emit('receiveMessage', message); // транслируем всем
  });

  socket.on('disconnect', () => {
    console.log('Клиент отключился:', socket.id);
  });
});

server.listen(4000, () => {
  console.log('🚀 Сервер запущен на http://localhost:4000');
});
