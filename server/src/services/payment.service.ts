import { Prisma, TimeEntryStatus } from "../lib/prisma-client.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";
import type { CalculatePaymentInput } from "../schemas/payment.schema.js";
import { paginated, parsePagination, type PaginationQuery } from "../utils/pagination.js";
import { userBriefSelect } from "../utils/user-select.js";

const money = (n: number) => n.toFixed(2);

/**
 * ФОП 3 група: 5% єдиного податку.
 * ЄСВ спрощено: 22% від gross (мінімальний внесок можна уточнити пізніше).
 */
const calcTaxes = (gross: number, isFop3Group: boolean) => {
  if (!isFop3Group) return { taxes: 0, net: gross };
  const singleTax = gross * 0.05;
  const esv = gross * 0.22;
  const taxes = singleTax + esv;
  return { taxes, net: Math.max(gross - taxes, 0) };
};

export class PaymentService {
  static async list(
    organizationId: string,
    filters: { userId?: string; periodYear?: number } = {},
    query: PaginationQuery = {}
  ) {
    const { page, limit, skip } = parsePagination(query);
    const where = {
      user: { organizationId },
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.periodYear && { periodYear: filters.periodYear }),
    };

    const [total, data] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.findMany({
        where,
        include: {
          user: { select: userBriefSelect },
        },
        orderBy: [{ periodYear: "desc" }, { periodMonth: "desc" }],
        skip,
        take: limit,
      }),
    ]);

    return paginated(data, total, { page, limit });
  }

  static async getById(organizationId: string, id: string) {
    const payment = await prisma.payment.findFirst({
      where: { id, user: { organizationId } },
      include: {
        user: { select: { ...userBriefSelect, currency: true } },
      },
    });
    if (!payment) throw new AppError("Выплата не найдена", 404);
    return payment;
  }

  static async calculate(organizationId: string, data: CalculatePaymentInput) {
    const user = await prisma.user.findFirst({
      where: { id: data.userId, organizationId, isActive: true },
    });
    if (!user) throw new AppError("Сотрудник не найден", 404);

    const periodStart = new Date(Date.UTC(data.periodYear, data.periodMonth - 1, 1));
    const periodEnd = new Date(Date.UTC(data.periodYear, data.periodMonth, 1));

    const approved = await prisma.timeEntry.findMany({
      where: {
        userId: user.id,
        status: TimeEntryStatus.APPROVED,
        date: { gte: periodStart, lt: periodEnd },
        project: { organizationId },
      },
      select: { hours: true },
    });

    const totalHours = approved.reduce((sum, entry) => sum + Number(entry.hours), 0);
    const hourlyRate = Number(user.hourlyRate ?? 0);
    const gross = totalHours * hourlyRate;
    const { taxes, net } = calcTaxes(gross, user.isFop3Group);

    try {
      return await prisma.payment.create({
        data: {
          userId: user.id,
          periodMonth: data.periodMonth,
          periodYear: data.periodYear,
          totalHours,
          hourlyRate,
          grossAmount: money(gross),
          taxesAmount: money(taxes),
          netAmount: money(net),
        },
        include: {
          user: { select: { ...userBriefSelect, currency: true } },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError("Ведомость за этот период уже существует", 400);
      }
      throw error;
    }
  }

  static async markPaid(organizationId: string, id: string) {
    const payment = await this.getById(organizationId, id);
    if (payment.isPaid) throw new AppError("Выплата уже отмечена как оплаченная", 400);

    return prisma.payment.update({
      where: { id },
      data: { isPaid: true, paidAt: new Date() },
      include: {
        user: { select: { ...userBriefSelect, currency: true } },
      },
    });
  }

  static async delete(organizationId: string, id: string) {
    const payment = await this.getById(organizationId, id);
    if (payment.isPaid) throw new AppError("Нельзя удалить оплаченную ведомость", 400);
    await prisma.payment.delete({ where: { id } });
  }
}
