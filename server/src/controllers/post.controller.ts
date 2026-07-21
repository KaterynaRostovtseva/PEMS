import type { Request, Response } from 'express';
import { PostService } from '../services/post.service.js';

export class PostController {
  // POST /posts
  static async create(req: Request, res: Response) {
    try {
      const { title, content, authorId } = req.body;

      if (!title || !authorId) {
        return res.status(400).json({ error: 'title и authorId обязательны' });
      }

      const post = await PostService.createPost({
        title,
        content,
        authorId: Number(authorId),
      });

      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при создании поста' });
    }
  }

  // GET /posts
  static async getAll(req: Request, res: Response) {
    try {
      const posts = await PostService.getAllPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении постов' });
    }
  }
}