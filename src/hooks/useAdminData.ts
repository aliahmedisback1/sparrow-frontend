"use client";

/**
 * useAdminData — hook جلب إحصائيات وبيانات الأدمن
 */

import { useState, useEffect } from "react";
import { AdminStats, UserAdminView, adminAPI } from "@/lib/api";

const USE_MOCK = true;

// بيانات وهمية للأدمن
const MOCK_ADMIN_STATS: AdminStats = {
  users: {
    total: 1247,
    active: 1189,
    banned: 12,
    new_this_week: 83,
  },
  subscriptions: {
    active_total: 934,
    by_plan: {
      free_trial: 210,
      monthly: 512,
      semi_annual: 156,
      annual: 56,
    },
  },
  pages: { total: 2341 },
  campaigns: { total: 8920, active: 3412 },
  activity: {
    total_replies_sent: 1284920,
    total_dms_sent: 342100,
    failed_replies_this_month: 234,
  },
};

const MOCK_USERS: UserAdminView[] = [
  {
    id: "u001", facebook_id: "111", facebook_name: "أحمد محمد",
    facebook_email: "ahmed@example.com", facebook_picture_url: null,
    role: "user", status: "active", admin_notes: null, frozen_until: null,
    created_at: "2026-03-15T10:00:00Z", last_login_at: "2026-05-16T08:00:00Z",
  },
  {
    id: "u002", facebook_id: "222", facebook_name: "سارة علي",
    facebook_email: "sara@example.com", facebook_picture_url: null,
    role: "user", status: "suspended", admin_notes: "تجاوز سياسة الاستخدام", frozen_until: null,
    created_at: "2026-04-01T12:00:00Z", last_login_at: "2026-05-10T14:00:00Z",
  },
  {
    id: "u003", facebook_id: "333", facebook_name: "خالد إبراهيم",
    facebook_email: "khalid@example.com", facebook_picture_url: null,
    role: "user", status: "active", admin_notes: null, frozen_until: null,
    created_at: "2026-05-01T09:00:00Z", last_login_at: "2026-05-17T07:00:00Z",
  },
  {
    id: "u004", facebook_id: "444", facebook_name: "منى حسن",
    facebook_email: "mona@example.com", facebook_picture_url: null,
    role: "user", status: "banned", admin_notes: "انتهاك متكرر", frozen_until: null,
    created_at: "2026-02-20T11:00:00Z", last_login_at: "2026-04-01T10:00:00Z",
  },
];

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (USE_MOCK) {
          await new Promise(r => setTimeout(r, 600));
          setStats(MOCK_ADMIN_STATS);
        } else {
          setStats(await adminAPI.getStats());
        }
      } catch { setError("تعذّر تحميل الإحصائيات"); }
      finally { setIsLoading(false); }
    };
    fetch();
  }, []);

  return { stats, isLoading, error };
}

export function useAdminUsers() {
  const [users, setUsers] = useState<UserAdminView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (search?: string) => {
    setIsLoading(true);
    try {
      if (USE_MOCK) {
        await new Promise(r => setTimeout(r, 400));
        const filtered = search
          ? MOCK_USERS.filter(u =>
            u.facebook_name.includes(search) ||
            u.facebook_email?.includes(search) ||
            u.facebook_id.includes(search)
          )
          : MOCK_USERS;
        setUsers(filtered);
      } else {
        setUsers(await adminAPI.getUsers({ search }));
      }
    } catch { setError("تعذّر تحميل المستخدمين"); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateStatus = async (id: string, status: string, notes?: string) => {
    if (USE_MOCK) {
      setUsers(prev => prev.map(u =>
        u.id === id ? { ...u, status: status as UserAdminView["status"], admin_notes: notes || u.admin_notes } : u
      ));
      return;
    }
    await adminAPI.updateUserStatus(id, { status: status as UserAdminView["status"], admin_notes: notes });
    await fetchUsers();
  };

  const grantSubscription = async (id: string, plan: string, days?: number) => {
    if (!USE_MOCK) await adminAPI.grantSubscription(id, plan, days);
  };

  const cancelSubscription = async (id: string) => {
    if (!USE_MOCK) await adminAPI.cancelSubscription(id);
  };

  return { users, isLoading, error, fetchUsers, updateStatus, grantSubscription, cancelSubscription };
}
