import { prisma } from './user.service.js';

export class PostService {
  // Создание поста для конкретного пользователя
  static async createPost(data: { title: string; content?: string; authorId: number }) {
    return await prisma.post.create({ data });
  }

  // Получение всех постов с информацией об авторе
  static async getAllPosts() {
    return await prisma.post.findMany({
      include: {
        author: {
          select: { id: true, name: true, email: true }, // Выбираем только безопасные поля автора
        },
      },
    });
  }
}