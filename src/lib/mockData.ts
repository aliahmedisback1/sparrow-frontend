/**
 * MOCK_DATA — بيانات وهمية للتطوير
 * تُستخدم بدلاً من الباكيند الحقيقي حتى توفر مفاتيح Meta
 * عند الانتهاء: احذف هذا الملف واستبدل الاستدعاءات بـ API الحقيقي
 */

import { UserProfile, UserStats, Page, Campaign, Subscription } from "./api";

export const MOCK_USER: UserProfile = {
  id: "mock-user-001",
  facebook_name: "أحمد محمد الكردي",
  facebook_email: "ahmed@example.com",
  facebook_picture_url: null,
  role: "user",
  status: "active",
  created_at: "2026-04-01T10:00:00Z",
  last_login_at: new Date().toISOString(),
};

export const MOCK_STATS: UserStats = {
  pages_count: 2,
  active_campaigns: 5,
  total_comments_received: 1284,
  total_replies_sent: 1201,
  total_dms_sent: 347,
};

export const MOCK_PAGES: Page[] = [
  {
    id: "page-001",
    facebook_page_id: "111222333444",
    page_name: "متجر الإلكترونيات الذكية",
    page_category: "التسوق والبيع بالتجزئة",
    page_picture_url: null,
    page_followers_count: 45200,
    is_active: true,
    webhook_subscribed: true,
    had_free_trial: true,
    created_at: "2026-04-10T08:00:00Z",
  },
  {
    id: "page-002",
    facebook_page_id: "555666777888",
    page_name: "مطعم الشيف الذهبي",
    page_category: "المطعم",
    page_picture_url: null,
    page_followers_count: 12800,
    is_active: true,
    webhook_subscribed: false,
    had_free_trial: false,
    created_at: "2026-05-01T12:00:00Z",
  },
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-001",
    facebook_post_id: "post-111",
    page_id: "page-001",
    post_url: "https://facebook.com/post/111",
    post_preview: "🔥 عرض حصري على سماعات Sony — خصم 40% لفترة محدودة!",
    reply_type: "random",
    custom_reply_text: null,
    random_replies: ["شكراً على اهتمامك! راسلنا للحصول على التفاصيل 🎉", "يسعدنا خدمتك! تواصل معنا على الخاص ✨"],
    send_dm: true,
    dm_condition: "always",
    dm_keywords: null,
    is_active: true,
    total_comments_received: 523,
    total_replies_sent: 498,
    total_dms_sent: 201,
    created_at: "2026-05-10T09:00:00Z",
  },
  {
    id: "camp-002",
    facebook_post_id: "post-222",
    page_id: "page-001",
    post_url: "https://facebook.com/post/222",
    post_preview: "📱 وصل حديثاً iPhone 16 Pro — الكميات محدودة",
    reply_type: "custom",
    custom_reply_text: "شكراً! سنتواصل معك قريباً بكل التفاصيل 😊",
    random_replies: null,
    send_dm: true,
    dm_condition: "keywords",
    dm_keywords: ["السعر", "كم", "بكم", "متوفر"],
    is_active: true,
    total_comments_received: 312,
    total_replies_sent: 298,
    total_dms_sent: 89,
    created_at: "2026-05-12T11:00:00Z",
  },
  {
    id: "camp-003",
    facebook_post_id: "post-333",
    page_id: "page-002",
    post_url: "https://facebook.com/post/333",
    post_preview: "🍽️ منيو رمضان الجديد — أطباق شرقية أصيلة",
    reply_type: "default",
    custom_reply_text: null,
    random_replies: null,
    send_dm: false,
    dm_condition: "always",
    dm_keywords: null,
    is_active: false,
    total_comments_received: 449,
    total_replies_sent: 405,
    total_dms_sent: 0,
    created_at: "2026-04-20T14:00:00Z",
  },
];

export const MOCK_SUBSCRIPTION: Subscription = {
  id: "sub-001",
  plan_type: "monthly",
  status: "active",
  started_at: "2026-05-01T00:00:00Z",
  expires_at: "2026-06-01T00:00:00Z",
  max_pages: 5,
  max_active_campaigns: 20,
  max_comments_per_month: 2000,
  comments_used_this_month: 1284,
};
