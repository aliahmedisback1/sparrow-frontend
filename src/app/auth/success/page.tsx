"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveTokens } from "@/lib/auth";

function AuthSuccessContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const errorParam = params.get("error");

    if (errorParam) {
      setError("فشل تسجيل الدخول — يرجى المحاولة مجدداً");
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    if (accessToken && refreshToken) {
      saveTokens(accessToken, refreshToken);
      router.replace("/dashboard");
    } else {
      setError("لم يتم استلام بيانات الدخول");
      setTimeout(() => router.push("/login"), 3000);
    }
  }, [params, router]);

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        {error ? (
          <>
            <div style={{ fontSize: 48, marginBottom: "1rem" }}>⚠️</div>
            <p style={{ color: "var(--color-error)" }}>{error}</p>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>جارٍ إعادة التوجيه...</p>
          </>
        ) : (
          <>
            <div style={{ width: 48, height: 48, border: "3px solid var(--color-border-light)", borderTopColor: "var(--color-primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--color-text-secondary)" }}>جارٍ تسجيل الدخول...</p>
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense>
      <AuthSuccessContent />
    </Suspense>
  );
}