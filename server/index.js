import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { connectDB } from './db/db.js';
import Message from './models/Message.js';
import router from './routes/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://online-chat-illya.netlify.app/',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  }),
);

// Подключаем БД
connectDB();

app.use('/api', router);

io.on('connection', async (socket) => {
  console.log('🟢 Новый клиент:', socket.id);

  const cookies = cookie.parse(socket.handshake.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    console.log('❌ Нет токена');
    socket.disconnect();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    console.log('👤 Подключён пользователь:', socket.userId);
  } catch (err) {
    console.error('❌ Ошибка JWT:', err.message);
    socket.disconnect();
    return;
  }

  try {
    const messages = await Message.find({
      $or: [{ senderId: socket.userId }, { receiverId: socket.userId }],
    })
      .sort({ createdAt: 1 })
      .limit(50);

    socket.emit('initMessages', messages);
  } catch (err) {
    console.error('Ошибка загрузки истории:', err.message);
  }

  socket.on('sendPrivateMessage', async ({ receiverId, text }) => {
    try {
      console.log(receiverId, text);
      const newMessage = new Message({
        text,
        senderId: socket.userId,
        receiverId,
      });
      await newMessage.save();

      console.log(newMessage);

      const sockets = await io.fetchSockets();
      const receiverSocket = sockets.find((s) => s.userId === receiverId);
      const senderSocket = sockets.find((s) => s.userId === socket.userId);

      if (receiverSocket) receiverSocket.emit('receivePrivateMessage', newMessage);
      if (senderSocket) senderSocket.emit('receivePrivateMessage', newMessage);

      console.log(`📩 ${socket.userId} → ${receiverId}: ${text}`);
    } catch (err) {
      console.error('Ошибка при отправке:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Отключился:', socket.userId || socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
