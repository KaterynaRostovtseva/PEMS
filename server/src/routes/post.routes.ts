import { Router } from 'express';
import { PostController } from '../controllers/post.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Публичный роут: смотреть посты могут все
router.get('/', PostController.getAll);

// Защищенный роут: создавать пост может только авторизованный юзер!
router.post('/', authenticateToken, PostController.create);

export default router;