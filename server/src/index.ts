import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import projectRoutes from './routes/project.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { swaggerSpec } from './config/swagger.js';
import swaggerUi from 'swagger-ui-express';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev')); // 👈 Логирование запросов
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Роуты
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/projects', projectRoutes);


// Обязательно ПОСЛЕ всех роутов — обработчик ошибок
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});