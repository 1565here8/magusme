import type { SqlDriver } from "../db/sql/driver";

function isoNow(): string {
  return new Date().toISOString();
}

function makeId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

export interface MarketplaceNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export async function createNotification(
  driver: SqlDriver,
  userId: string,
  type: string,
  title: string,
  body?: string,
  link?: string,
): Promise<void> {
  const id = makeId("notif");
  await driver.exec(
    `INSERT INTO marketplace_notifications (id, user_id, type, title, body, link, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
    [id, userId, type, title, body ?? "", link ?? null, isoNow()],
  );
}

export async function getNotifications(
  driver: SqlDriver,
  userId: string,
  limit = 20,
): Promise<MarketplaceNotification[]> {
  const rows = await driver.all<{
    id: string;
    user_id: string;
    type: string;
    title: string;
    body: string;
    link: string | null;
    is_read: number;
    created_at: string;
  }>(
    "SELECT * FROM marketplace_notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
    [userId, limit],
  );
  return rows.map(mapRow);
}

export async function getUnreadCount(driver: SqlDriver, userId: string): Promise<number> {
  const row = await driver.get<{ count: number }>(
    "SELECT COUNT(*) AS count FROM marketplace_notifications WHERE user_id = ? AND is_read = 0",
    [userId],
  );
  return row?.count ?? 0;
}

export async function markNotificationRead(driver: SqlDriver, id: string, userId: string): Promise<void> {
  await driver.exec(
    "UPDATE marketplace_notifications SET is_read = 1 WHERE id = ? AND user_id = ?",
    [id, userId],
  );
}

export async function markAllNotificationsRead(driver: SqlDriver, userId: string): Promise<void> {
  await driver.exec(
    "UPDATE marketplace_notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0",
    [userId],
  );
}

function mapRow(row: {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  is_read: number;
  created_at: string;
}): MarketplaceNotification {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    body: row.body,
    link: row.link,
    isRead: row.is_read === 1,
    createdAt: row.created_at,
  };
}
