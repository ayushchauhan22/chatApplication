import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import uploadRoutes from './routes/uploadRoutes';
import setupSocket from './sockets/socket';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorMiddleware';
import userRoutes from './routes/userRoutes';
import conversation from './routes/conversationRoutes';
import chatRequest from './routes/chatRequestRoutes';
import message from './routes/messageRoutes';
import connectDB from './config/db';
import logger from './utils/logger';

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setupSocket(io);
connectDB();

app.use(cookieParser());
app.use(cors({ origin: process.env.URL, credentials: true }));
app.use(express.json());

import { getSwaggerDocument } from './swagger/swagger';
app.use('/docs', swaggerUi.serve, swaggerUi.setup(getSwaggerDocument()));

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' });
});

app.use('/users', userRoutes);
app.use('/rooms', conversation);
app.use('/chat-requests', chatRequest);
app.use('/messages', message);
app.use('/auth', authRoutes);
app.use('/file', uploadRoutes);

app.use(errorHandler);

server.listen(5000, () => {
  logger.info('Server is running on port 5000');
});
