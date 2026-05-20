"use client";

/**
 * usePagesData — hook إدارة صفحات فيسبوك
 * يعمل الآن بالبيانات الوهمية
 * عند توفر المفاتيح: غيّر useMock إلى false
 */

import { useState, useEffect } from "react";
import { Page, pagesAPI } from "@/lib/api";
import { MOCK_PAGES } from "@/lib/mockData";

const USE_MOCK = true; // ← غيّرها false عند توفر الباكيند

export function usePagesData() {
  const [pages,     setPages]     = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      if (USE_MOCK) {
        // تأخير وهمي لمحاكاة الشبكة
        await new Promise(r => setTimeout(r, 600));
        setPages(MOCK_PAGES);
      } else {
        const data = await pagesAPI.getAll();
        setPages(data);
      }
    } catch {
      setError("تعذّر تحميل الصفحات");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPages(); }, []);

  const disconnectPage = async (pageId: string) => {
    if (USE_MOCK) {
      setPages(prev => prev.filter(p => p.id !== pageId));
      return;
    }
    await pagesAPI.disconnect(pageId);
    await fetchPages();
  };

  const retryWebhook = async (pageId: string) => {
    if (USE_MOCK) {
      setPages(prev => prev.map(p =>
        p.id === pageId ? { ...p, webhook_subscribed: true } : p
      ));
      return;
    }
    await pagesAPI.retryWebhook(pageId);
    await fetchPages();
  };

  return { pages, isLoading, error, disconnectPage, retryWebhook, refetch: fetchPages };
}
