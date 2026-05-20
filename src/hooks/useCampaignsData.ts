"use client";

/**
 * useCampaignsData — hook إدارة الحملات
 * يعمل الآن بالبيانات الوهمية
 */

import { useState, useEffect } from "react";
import { Campaign, campaignsAPI } from "@/lib/api";
import { MOCK_CAMPAIGNS } from "@/lib/mockData";

const USE_MOCK = true;

export function useCampaignsData(pageId?: string) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      if (USE_MOCK) {
        await new Promise(r => setTimeout(r, 500));
        const filtered = pageId
          ? MOCK_CAMPAIGNS.filter(c => c.page_id === pageId)
          : MOCK_CAMPAIGNS;
        setCampaigns(filtered);
      } else {
        const data = await campaignsAPI.getAll(pageId);
        setCampaigns(data);
      }
    } catch {
      setError("تعذّر تحميل الحملات");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCampaigns(); }, [pageId]);

  const toggleCampaign = async (campaignId: string) => {
    if (USE_MOCK) {
      setCampaigns(prev => prev.map(c =>
        c.id === campaignId ? { ...c, is_active: !c.is_active } : c
      ));
      return;
    }
    await campaignsAPI.toggle(campaignId);
    await fetchCampaigns();
  };

  const deleteCampaign = async (campaignId: string) => {
    if (USE_MOCK) {
      setCampaigns(prev => prev.filter(c => c.id !== campaignId));
      return;
    }
    await campaignsAPI.delete(campaignId);
    await fetchCampaigns();
  };

  return { campaigns, isLoading, error, toggleCampaign, deleteCampaign, refetch: fetchCampaigns };
}
