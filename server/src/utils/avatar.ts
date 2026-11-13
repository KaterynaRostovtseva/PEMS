const apiBase = () =>
  (process.env.API_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/$/, "");

/** Відносний шлях /uploads/... → повна адреса для клієнта */
export const toAbsoluteUrl = (pathOrUrl: string | null | undefined): string | null => {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${apiBase()}${path}`;
};

export const withAvatar = <T extends { avatarUrl?: string | null }>(user: T) => ({
  ...user,
  avatarUrl: user.avatarUrl ?? null,
  avatar: toAbsoluteUrl(user.avatarUrl),
});
