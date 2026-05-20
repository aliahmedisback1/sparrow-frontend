"use client";

/**
 * layout.tsx — هيكل الداشبورد المشترك
 * في وضع Mock: يتجاوز AuthGuard ويعرض الداشبورد مباشرة
 * في الإنتاج: يتحقق من التوكن الحقيقي
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { MOCK_USER } from "@/lib/mockData";
import { UserProfile } from "@/lib/api";

const USE_MOCK = true; // ← غيّرها false عند توفر الباكيند

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router  = useRouter();
  const [user,       setUser]       = useState<UserProfile | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (USE_MOCK) {
        // في وضع Mock: نستخدم المستخدم الوهمي مباشرة
        setUser(MOCK_USER);
        setIsChecking(false);
        return;
      }

      // في الإنتاج: نتحقق من التوكن الحقيقي
      const { isAuthenticated } = await import("@/lib/auth");
      if (!isAuthenticated()) {
        router.replace("/login");
        return;
      }
      const { userAPI } = await import("@/lib/api");
      const userData = await userAPI.getMe().catch(() => null);
      if (!userData) {
        router.replace("/login");
        return;
      }
      setUser(userData);
      setIsChecking(false);
    };

    check();
  }, [router]);

  if (isChecking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: 40, height: 40,
          border: "3px solid var(--color-border-light)",
          borderTopColor: "var(--color-primary)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <DashboardSidebar
        isAdmin={user?.role === "admin"}
        userName={user?.facebook_name}
        userPicture={user?.facebook_picture_url ?? undefined}
      />
      <main style={{ flex: 1, marginRight: 240, minHeight: "100vh", background: "var(--color-bg-base)" }}>
        {children}
      </main>
    </div>
  );
}
