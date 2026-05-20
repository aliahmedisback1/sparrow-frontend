"use client";

/**
 * AuthGuard — حارس المسارات المحمية
 * يتحقق من وجود التوكن قبل عرض أي صفحة في الداشبورد
 * إذا لم يكن المستخدم مسجلاً يوجّهه لصفحة الدخول فوراً
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // احذفه لاحقاً
    // if (typeof window !== "undefined") localStorage.setItem("sparrow_access_token", "mock_token");
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setIsChecking(false);
  }, [router]);

  // شاشة تحميل بينما يتحقق من التوكن
  if (isChecking) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: "3px solid var(--color-border-light)",
          borderTopColor: "var(--color-primary)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
