import { createHash, randomBytes } from "crypto";
import nodemailer, { type Transporter } from "nodemailer";

export const hashOpaqueToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export const createOpaqueToken = () => randomBytes(32).toString("hex");

const appUrl = () => process.env.APP_URL || "http://localhost:5173";
const apiUrl = () => process.env.API_URL || `http://localhost:${process.env.PORT || 3000}`;

let cachedTransporter: Transporter | null | undefined;
let etherealUser: string | null = null;

const createSmtpTransporter = (): Transporter =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });

/** Ethereal — тестовий SMTP без власної пошти (лист дивіться за preview URL) */
const createEtherealTransporter = async (): Promise<Transporter> => {
  const account = await nodemailer.createTestAccount();
  etherealUser = account.user;
  console.log(`📧 Ethereal SMTP готов: ${account.user}`);
  return nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: { user: account.user, pass: account.pass },
  });
};

const getTransporter = async (): Promise<Transporter | null> => {
  if (cachedTransporter !== undefined) return cachedTransporter;

  if (process.env.SMTP_HOST) {
    cachedTransporter = createSmtpTransporter();
    return cachedTransporter;
  }

  // Поза production за замовчуванням Ethereal (вимкнути можна через SMTP_ETHEREAL=false)
  const useEthereal =
    process.env.SMTP_ETHEREAL !== "false" && process.env.NODE_ENV !== "production";

  if (useEthereal) {
    try {
      cachedTransporter = await createEtherealTransporter();
      return cachedTransporter;
    } catch (error) {
      console.warn("⚠️ Не вдалося створити Ethereal SMTP, запасний варіант — консоль:", error);
      cachedTransporter = null;
      return null;
    }
  }

  cachedTransporter = null;
  return null;
};

export class EmailService {
  static async sendMail(to: string, subject: string, html: string) {
    const from = process.env.SMTP_FROM || "PEMS <noreply@pems.local>";
    const transporter = await getTransporter();

    if (!transporter) {
      console.log("\n📧 [EMAIL DEV FALLBACK — немає SMTP]");
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
      console.log("—\n");
      return { preview: true as const, previewUrl: null as string | null };
    }

    const info = await transporter.sendMail({ from, to, subject, html });
    const previewUrl = nodemailer.getTestMessageUrl(info);

    if (previewUrl) {
      console.log(`\n📧 Лист надіслано (Ethereal). Відкрити: ${previewUrl}\n`);
    } else {
      console.log(`📧 Лист надіслано → ${to}${etherealUser ? ` (via ${etherealUser})` : ""}`);
    }

    return {
      preview: Boolean(previewUrl),
      previewUrl: previewUrl || null,
    };
  }

  static inviteLink(token: string) {
    return `${appUrl()}/accept-invite?token=${token}`;
  }

  static resetPasswordLink(token: string) {
    return `${appUrl()}/reset-password?token=${token}`;
  }

  static async sendInvite(to: string, orgName: string, token: string) {
    const link = this.inviteLink(token);
    return this.sendMail(
      to,
      `Запрошення в ${orgName} / Invitation to ${orgName} (PEMS)`,
      `<p>Вас запросили до організації <b>${orgName}</b>.</p>
       <p>You have been invited to <b>${orgName}</b>.</p>
       <p><a href="${link}">Прийняти запрошення / Accept invitation</a></p>
       <p>Або скопіюйте посилання / Or copy the link: ${link}</p>
       <p>Посилання діє 7 днів. / The link is valid for 7 days.</p>`
    );
  }

  static async sendPasswordReset(to: string, token: string) {
    const link = this.resetPasswordLink(token);
    return this.sendMail(
      to,
      "Скидання пароля PEMS / PEMS password reset",
      `<p>Запит на скидання пароля.</p>
       <p>Password reset request.</p>
       <p><a href="${link}">Скинути пароль / Reset password</a></p>
       <p>Або скопіюйте посилання / Or copy the link: ${link}</p>
       <p>Посилання діє 1 годину. Якщо це були не ви — проігноруйте лист.</p>
       <p>The link is valid for 1 hour. If this was not you, ignore this email.</p>
       <p><small>API: ${apiUrl()}</small></p>`
    );
  }
}
