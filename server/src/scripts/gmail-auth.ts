import "dotenv/config";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { resolve } from "node:path";

const clientId = process.env.GMAIL_CLIENT_ID;
const clientSecret = process.env.GMAIL_CLIENT_SECRET;
const port = 53682;
const redirectUri = `http://127.0.0.1:${port}`;
const scope = "https://www.googleapis.com/auth/gmail.send";
const envPath = resolve(process.cwd(), ".env");

if (!clientId || !clientSecret) {
  console.error("У server/.env потрібні GMAIL_CLIENT_ID і GMAIL_CLIENT_SECRET з Google Cloud.");
  process.exit(1);
}

const state = randomBytes(16).toString("hex");
const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
authUrl.searchParams.set("client_id", clientId);
authUrl.searchParams.set("redirect_uri", redirectUri);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("scope", scope);
authUrl.searchParams.set("access_type", "offline");
authUrl.searchParams.set("prompt", "consent");
authUrl.searchParams.set("state", state);

const upsertEnv = (name: string, value: string) => {
  const quoted = `"${value.replace(/"/g, '\\"')}"`;
  const line = `${name}=${quoted}`;
  const text = readFileSync(envPath, "utf8");
  const pattern = new RegExp(`^${name}=.*$`, "m");
  const next = pattern.test(text) ? text.replace(pattern, line) : `${text.trimEnd()}\n${line}\n`;
  writeFileSync(envPath, next);
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", redirectUri);
  if (url.pathname !== "/" && url.pathname !== "") {
    response.writeHead(404);
    response.end();
    return;
  }

  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");

  const finish = (status: number, text: string) => {
    response.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
    response.end(`<p>${text}</p>`);
  };

  if (error || !code || returnedState !== state) {
    finish(400, "Вхід не вдався. Поверніться в термінал.");
    console.error(error || "Немає коду авторизації");
    server.close();
    process.exit(1);
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const token = (await tokenResponse.json().catch(() => null)) as {
    refresh_token?: string;
    error?: string;
    error_description?: string;
  } | null;

  if (!tokenResponse.ok || !token?.refresh_token) {
    finish(400, "Токен не отримано. Поверніться в термінал.");
    console.error(token?.error_description || token?.error || `HTTP ${tokenResponse.status}`);
    console.error("Якщо Google не видав refresh token, скасуйте доступ PEMS на https://myaccount.google.com/permissions і запустіть скрипт ще раз.");
    server.close();
    process.exit(1);
  }

  upsertEnv("GMAIL_REFRESH_TOKEN", token.refresh_token);
  finish(200, "Готово. Це вікно можна закрити.");
  console.log("GMAIL_REFRESH_TOKEN записано в server/.env. Перезапустіть сервер.");
  server.close();
  process.exit(0);
});

server.listen(port, "127.0.0.1", () => {
  console.log("Відкрийте сторінку входу Google і дозвольте надсилання листів.");
  console.log(authUrl.toString());
  spawn("cmd", ["/c", "start", "", authUrl.toString()], { detached: true, stdio: "ignore" }).unref();
});
