import fs from "fs/promises";
import path from "path";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";
import { paginated, parsePagination, type PaginationQuery } from "../utils/pagination.js";
import { userNameSelect } from "../utils/user-select.js";

const uploadsRoot = path.resolve(process.cwd(), "uploads");

export class FileService {
  static async ensureUploadsDir() {
    await fs.mkdir(uploadsRoot, { recursive: true });
  }

  static async list(organizationId: string, query: PaginationQuery) {
    const { page, limit, skip } = parsePagination(query);
    const where = { organizationId };

    const [total, data] = await Promise.all([
      prisma.fileAsset.count({ where }),
      prisma.fileAsset.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          uploadedBy: { select: userNameSelect },
        },
      }),
    ]);

    return paginated(data, total, { page, limit });
  }

  static async upload(
    organizationId: string,
    uploadedById: string,
    file: Express.Multer.File,
    setAsAvatar = false
  ) {
    await this.ensureUploadsDir();

    const relativePath = path.relative(process.cwd(), file.path).replace(/\\/g, "/");
    const url = `/${relativePath}`;

    const asset = await prisma.fileAsset.create({
      data: {
        organizationId,
        uploadedById,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        storagePath: relativePath,
        url,
      },
      include: {
        uploadedBy: { select: userNameSelect },
      },
    });

    if (setAsAvatar) {
      await prisma.user.update({
        where: { id: uploadedById },
        data: { avatarUrl: url },
      });
    }

    return asset;
  }

  static async getById(organizationId: string, id: string) {
    const asset = await prisma.fileAsset.findFirst({
      where: { id, organizationId },
      include: { uploadedBy: { select: userNameSelect } },
    });
    if (!asset) throw new AppError("Файл не найден", 404);
    return asset;
  }

  static async delete(organizationId: string, id: string, actorUserId: string, isManager: boolean) {
    const asset = await prisma.fileAsset.findFirst({
      where: { id, organizationId },
    });
    if (!asset) throw new AppError("Файл не найден", 404);

    if (!isManager && asset.uploadedById !== actorUserId) {
      throw new AppError("Можно удалять только свои файлы", 403);
    }

    await prisma.fileAsset.delete({ where: { id } });
    try {
      await fs.unlink(path.resolve(process.cwd(), asset.storagePath));
    } catch {
      // файл уже могли видалити з диска
    }
  }
}
