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

const gmailConfigured = () =>
  Boolean(
    process.env.GMAIL_CLIENT_ID &&
      process.env.GMAIL_CLIENT_SECRET &&
      process.env.GMAIL_REFRESH_TOKEN
  );

const encodeHeader = (value: string) => {
  if (/^[\u0000-\u007F]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
};

const wrapBase64 = (value: string) => value.replace(/.{1,76}/g, "$&\r\n").trim();

/** Лист у форматі RFC 822, який приймає Gmail API. */
const buildGmailRaw = (from: string, to: string, subject: string, html: string) => {
  const mime = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${encodeHeader(subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    wrapBase64(Buffer.from(html, "utf8").toString("base64")),
  ].join("\r\n");
  return Buffer.from(mime).toString("base64url");
};

const gmailFrom = (fallback: string) => {
  const user = process.env.GMAIL_USER;
  if (!user) return fallback;
  if (fallback.includes(user)) return fallback;
  return `PEMS <${user}>`;
};

let gmailAccess: { token: string; expiresAt: number } | null = null;

const gmailAccessToken = async () => {
  if (gmailAccess && gmailAccess.expiresAt > Date.now() + 60_000) return gmailAccess.token;

  const body = new URLSearchParams({
    client_id: process.env.GMAIL_CLIENT_ID || "",
    client_secret: process.env.GMAIL_CLIENT_SECRET || "",
    refresh_token: process.env.GMAIL_REFRESH_TOKEN || "",
    grant_type: "refresh_token",
  });
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const payload = (await response.json().catch(() => null)) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  } | null;

  if (!response.ok || !payload?.access_token) {
    const detail = payload?.error_description || payload?.error || `HTTP ${response.status}`;
    throw new Error(
      payload?.error === "invalid_grant"
        ? "Gmail: токен прострочений. Запустіть npm run gmail:auth у папці server"
        : `Gmail: ${detail}`
    );
  }

  gmailAccess = {
    token: payload.access_token,
    expiresAt: Date.now() + (payload.expires_in ?? 3600) * 1000,
  };
  return payload.access_token;
};

/** Gmail API по HTTPS. Порти SMTP з цієї мережі закриті. */
const sendViaGmail = async (from: string, to: string, subject: string, html: string) => {
  const token = await gmailAccessToken();
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw: buildGmailRaw(from, to, subject, html) }),
  });
  const payload = (await response.json().catch(() => null)) as {
    error?: { message?: string };
  } | null;

  if (!response.ok) {
    throw new Error(`Gmail: ${payload?.error?.message || `HTTP ${response.status}`}`);
  }

  console.log(`📧 Лист надіслано через Gmail API → ${to}`);
  return { preview: false as const, previewUrl: null as string | null };
};

export class EmailService {
  static async sendMail(to: string, subject: string, html: string) {
    const from = gmailConfigured()
      ? gmailFrom(process.env.SMTP_FROM || "PEMS <noreply@pems.local>")
      : process.env.SMTP_FROM || "PEMS <noreply@pems.local>";

    if (gmailConfigured()) {
      return sendViaGmail(from, to, subject, html);
    }

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
