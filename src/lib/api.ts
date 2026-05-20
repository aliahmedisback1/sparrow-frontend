/**
 * طبقة التواصل مع الباكيند
 * كل endpoint في مكان واحد — سهل التعديل والصيانة
 */

import { getAccessToken, clearTokens } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * دالة الطلب الأساسية
 * تضيف التوكن تلقائياً وتعالج الأخطاء بشكل موحّد
 */
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // إذا انتهى التوكن نوجه لصفحة الدخول
  if (response.status === 401) {
    clearTokens();
    window.location.href = "/login";
    throw new Error("انتهت جلسة الدخول");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "حدث خطأ في الطلب");
  }

  // إذا لم يكن هناك محتوى (مثل 204 No Content)
  if (response.status === 204) return null as T;

  return response.json();
}

// ===========================
// APIs المستخدم
// ===========================
export const userAPI = {
  getMe:    () => request<UserProfile>("/api/v1/users/me"),
  getStats: () => request<UserStats>("/api/v1/users/me/stats"),
};

// ===========================
// APIs الصفحات
// ===========================
export const pagesAPI = {
  getAll:         () => request<Page[]>("/api/v1/pages"),
  getAvailable:   () => request<FacebookPage[]>("/api/v1/pages/available"),
  connect:        (data: ConnectPageData) =>
    request<Page>("/api/v1/pages", { method: "POST", body: JSON.stringify(data) }),
  disconnect:     (id: string) =>
    request<void>(`/api/v1/pages/${id}`, { method: "DELETE" }),
  retryWebhook:   (id: string) =>
    request<{ webhook_subscribed: boolean }>(`/api/v1/pages/${id}/webhook/retry`, { method: "POST" }),
};

// ===========================
// APIs الحملات
// ===========================
export const campaignsAPI = {
  getAll:    (pageId?: string) =>
    request<Campaign[]>(`/api/v1/campaigns${pageId ? `?page_id=${pageId}` : ""}`),
  getOne:    (id: string) => request<Campaign>(`/api/v1/campaigns/${id}`),
  create:    (data: CreateCampaignData) =>
    request<Campaign>("/api/v1/campaigns", { method: "POST", body: JSON.stringify(data) }),
  update:    (id: string, data: Partial<CreateCampaignData>) =>
    request<Campaign>(`/api/v1/campaigns/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  toggle:    (id: string) =>
    request<Campaign>(`/api/v1/campaigns/${id}/toggle`, { method: "PATCH" }),
  delete:    (id: string) =>
    request<void>(`/api/v1/campaigns/${id}`, { method: "DELETE" }),
  getLogs:   (id: string, limit = 50, offset = 0) =>
    request<CampaignLogs>(`/api/v1/campaigns/${id}/logs?limit=${limit}&offset=${offset}`),
};

// ===========================
// APIs الاشتراكات
// ===========================
export const subscriptionAPI = {
  getMe:        () => request<Subscription>("/api/v1/subscriptions/me"),
  startTrial:   (pageId: string) =>
    request<Subscription>(`/api/v1/subscriptions/free-trial?page_id=${pageId}`, { method: "POST" }),
  upgrade:      (plan: string, paymentIntentId: string) =>
    request<Subscription>(
      `/api/v1/subscriptions/upgrade?plan_type=${plan}&stripe_payment_intent_id=${paymentIntentId}`,
      { method: "POST" }
    ),
};

// ===========================
// APIs الأدمن
// ===========================
export const adminAPI = {
  getStats:           () => request<AdminStats>("/api/v1/admin/stats"),
  getUsers:           (params?: { limit?: number; offset?: number; search?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return request<UserAdminView[]>(`/api/v1/admin/users?${q}`);
  },
  updateUserStatus:   (id: string, data: UpdateStatusData) =>
    request(`/api/v1/admin/users/${id}/status`, { method: "PATCH", body: JSON.stringify(data) }),
  grantSubscription:  (id: string, plan: string, days?: number) =>
    request(`/api/v1/admin/users/${id}/subscription/grant?plan_type=${plan}${days ? `&duration_days=${days}` : ""}`, { method: "POST" }),
  cancelSubscription: (id: string) =>
    request(`/api/v1/admin/users/${id}/subscription`, { method: "DELETE" }),
};

// ===========================
// Types
// ===========================
export interface UserProfile {
  id: string;
  facebook_name: string;
  facebook_email: string | null;
  facebook_picture_url: string | null;
  role: "user" | "admin";
  status: "active" | "suspended" | "banned" | "frozen";
  created_at: string;
  last_login_at: string | null;
}

export interface UserStats {
  pages_count: number;
  active_campaigns: number;
  total_comments_received: number;
  total_replies_sent: number;
  total_dms_sent: number;
}

export interface Page {
  id: string;
  facebook_page_id: string;
  page_name: string;
  page_category: string | null;
  page_picture_url: string | null;
  page_followers_count: number;
  is_active: boolean;
  webhook_subscribed: boolean;
  had_free_trial: boolean;
  created_at: string;
}

export interface FacebookPage {
  id: string;
  name: string;
  category: string;
  access_token: string;
  picture?: { data: { url: string } };
  fan_count?: number;
}

export interface ConnectPageData {
  facebook_page_id: string;
  page_name: string;
  page_access_token: string;
  page_category?: string;
  page_picture_url?: string;
  page_followers_count?: number;
}

export interface Campaign {
  id: string;
  facebook_post_id: string;
  page_id: string;
  post_url: string | null;
  post_preview: string | null;
  reply_type: "default" | "custom" | "random";
  custom_reply_text: string | null;
  random_replies: string[] | null;
  send_dm: boolean;
  dm_condition: "always" | "keywords";
  dm_keywords: string[] | null;
  is_active: boolean;
  total_comments_received: number;
  total_replies_sent: number;
  total_dms_sent: number;
  created_at: string;
}

export interface CreateCampaignData {
  facebook_post_id: string;
  page_id: string;
  post_url?: string;
  post_preview?: string;
  reply_type: "default" | "custom" | "random";
  custom_reply_text?: string;
  random_replies?: string[];
  send_dm: boolean;
  dm_text?: string;
  dm_condition: "always" | "keywords";
  dm_keywords?: string[];
  reply_all_comments: boolean;
  dm_once_per_user: boolean;
}

export interface CampaignLogs {
  total: number;
  limit: number;
  offset: number;
  logs: Array<{
    id: string;
    comment_id: string;
    commenter_name: string;
    comment_text: string;
    reply_sent: string | null;
    dm_sent: string | null;
    status: string;
    received_at: string;
  }>;
}

export interface Subscription {
  id: string;
  plan_type: string;
  status: string;
  started_at: string;
  expires_at: string;
  max_pages: number;
  max_active_campaigns: number;
  max_comments_per_month: number;
  comments_used_this_month: number;
}

export interface AdminStats {
  users: {
    total: number;
    active: number;
    banned: number;
    new_this_week: number;
  };
  subscriptions: {
    active_total: number;
    by_plan: Record<string, number>;
  };
  pages:     { total: number };
  campaigns: { total: number; active: number };
  activity:  {
    total_replies_sent: number;
    total_dms_sent: number;
    failed_replies_this_month: number;
  };
}

export interface UserAdminView extends UserProfile {
  facebook_id: string;
  admin_notes: string | null;
  frozen_until: string | null;
}

export interface UpdateStatusData {
  status: "active" | "suspended" | "banned" | "frozen";
  frozen_until?: string;
  admin_notes?: string;
}
