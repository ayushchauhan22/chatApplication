import express from 'express';
import cors from 'cors';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import setupSocket from './socktes/socket';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorMiddleware';
import userRoutes from './routes/userRoutes';
import conversation from './routes/conversationRoutes';
import chatRequest from './routes/chatRequestRoutes';
import message from './routes/messageRoutes';
import connectDB from './config/db';
import logger from './utils/logger';

import './schema';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

setupSocket(io);

dotenv.config();
connectDB();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

/* ---------- SWAGGER ---------- */

import { getSwaggerDocument } from './swagger/swagger';
app.use('/docs', swaggerUi.serve, swaggerUi.setup(getSwaggerDocument()));

/* ---------- ROUTES ---------- */

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' });
});
app.use('/users', userRoutes);
app.use('/rooms', conversation);
app.use('/chat-requests', chatRequest);
app.use('/messages', message);
app.use('/auth', authRoutes);

app.use(errorHandler);

/* ---------- SERVER ---------- */

server.listen(5000, () => {
  logger.info('Server is running on port 5000');
});