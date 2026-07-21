import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

export class UserService {
  // Получить всех
  static async getAllUsers() {
    return await prisma.user.findMany();
  }

  // Получить одного по ID
  static async getUserById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
    include: { posts: true }, // 👈 Включаем список постов пользователя
  });
}

  // Создать
  static async createUser(data: { name?: string; email: string }) {
    return await prisma.user.create({ data });
  }

  // Обновить
  static async updateUser(id: number, data: { name?: string; email?: string }) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  // Удалить
  static async deleteUser(id: number) {
    return await prisma.user.delete({ where: { id } });
  }
}