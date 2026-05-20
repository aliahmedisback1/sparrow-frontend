/**
 * إدارة توكنات JWT في المتصفح
 * نحفظها في localStorage ونرسلها في كل طلب API
 */

const ACCESS_TOKEN_KEY  = "sparrow_access_token";
const REFRESH_TOKEN_KEY = "sparrow_refresh_token";

/** حفظ التوكنين بعد تسجيل الدخول */
export function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY,  accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

/** جلب Access Token الحالي */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/** جلب Refresh Token */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/** حذف التوكنات عند تسجيل الخروج */
export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/** هل المستخدم مسجّل دخول؟ */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
