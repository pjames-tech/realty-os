export const ADMIN_SESSION_COOKIE = "realtyos_admin_session";
export const CLIENT_SESSION_COOKIE = "realtyos_client_session";

const DEFAULT_ADMIN_EMAIL = "admin@realtyos.com";
const DEFAULT_ADMIN_PASSWORD = "realty123";
const DEFAULT_SESSION_TOKEN = "realtyos-admin-authenticated";

export function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL?.trim() || DEFAULT_ADMIN_EMAIL;
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || DEFAULT_ADMIN_PASSWORD;
}

export function getAdminSessionToken(): string {
  return process.env.ADMIN_SESSION_TOKEN?.trim() || DEFAULT_SESSION_TOKEN;
}

export function validateAdminCredentials(
  email: string,
  password: string
): boolean {
  return email === getAdminEmail() && password === getAdminPassword();
}

export function isValidAdminSession(token?: string): boolean {
  return Boolean(token) && token === getAdminSessionToken();
}

