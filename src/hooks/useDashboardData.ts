"use client";

/**
 * useDashboardData — hook يجلب بيانات الداشبورد
 * يدعم وضع Mock للتطوير بدون باكيند
 */

import { useEffect, useState } from "react";
import { userAPI, UserProfile, UserStats } from "@/lib/api";
import { MOCK_USER, MOCK_STATS } from "@/lib/mockData";

const USE_MOCK = true; // ← غيّرها false عند توفر الباكيند

interface DashboardData {
  user:      UserProfile | null;
  stats:     UserStats | null;
  isLoading: boolean;
  error:     string | null;
}

export function useDashboardData(): DashboardData {
  const [user,      setUser]      = useState<UserProfile | null>(null);
  const [stats,     setStats]     = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        if (USE_MOCK) {
          await new Promise(r => setTimeout(r, 600));
          setUser(MOCK_USER);
          setStats(MOCK_STATS);
        } else {
          const [userData, statsData] = await Promise.all([
            userAPI.getMe(),
            userAPI.getStats(),
          ]);
          setUser(userData);
          setStats(statsData);
        }
      } catch {
        setError("تعذّر تحميل البيانات — تحقق من اتصالك");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  return { user, stats, isLoading, error };
}
