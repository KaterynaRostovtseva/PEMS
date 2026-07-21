import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev')); // 👈 Логирование запросов
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Роуты
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// Обязательно ПОСЛЕ всех роутов — обработчик ошибок
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});