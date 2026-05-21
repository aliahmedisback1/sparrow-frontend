"use client";

/**
 * useSubscriptionData — hook جلب بيانات الاشتراك
 */

import { useState, useEffect } from "react";
import { Subscription, subscriptionAPI } from "@/lib/api";
import { MOCK_SUBSCRIPTION } from "@/lib/mockData";

const USE_MOCK = false;

export function useSubscriptionData() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (USE_MOCK) {
          await new Promise(r => setTimeout(r, 500));
          setSubscription(MOCK_SUBSCRIPTION);
        } else {
          const data = await subscriptionAPI.getMe();
          setSubscription(data);
        }
      } catch {
        setError("تعذّر تحميل بيانات الاشتراك");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return { subscription, isLoading, error };
}
