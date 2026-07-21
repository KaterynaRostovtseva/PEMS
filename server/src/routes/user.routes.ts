
import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';

const router = Router();

// Все пути указываются относительно базового пути (который мы подключим в index.ts)
router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.post('/', UserController.create);
router.patch('/:id', UserController.update);
router.delete('/:id', UserController.delete);

export default router;