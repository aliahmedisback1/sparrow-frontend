"use client";

/**
 * DashboardSidebar — القائمة الجانبية
 * تظهر في كل صفحات الداشبورد
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clearTokens } from "@/lib/auth";
import { useRouter } from "next/navigation";

// عناصر القائمة الجانبية
const NAV_ITEMS = [
  { href: "/dashboard",     icon: "⊞", label: "الرئيسية"    },
  { href: "/pages",         icon: "⚑", label: "صفحاتي"     },
  { href: "/campaigns",     icon: "◎", label: "الحملات"     },
  { href: "/subscription",  icon: "◈", label: "اشتراكي"     },
];

const ADMIN_ITEMS = [
  { href: "/admin",         icon: "◉", label: "لوحة الأدمن" },
  { href: "/admin/users",   icon: "◈", label: "المستخدمون"  },
];

interface DashboardSidebarProps {
  isAdmin?: boolean;
  userName?: string;
  userPicture?: string;
}

export default function DashboardSidebar({
  isAdmin = false,
  userName = "",
  userPicture,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();

  const handleLogout = () => {
    clearTokens();
    router.replace("/login");
  };

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <aside style={{
      width: 240,
      minHeight: "100vh",
      background: "var(--color-bg-surface)",
      borderLeft: "1px solid var(--color-border)",
      display: "flex",
      flexDirection: "column",
      padding: "1.5rem 0",
      position: "fixed",
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: 100,
    }}>

      {/* الشعار */}
      <div style={{ padding: "0 1.5rem 2rem", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, var(--color-primary), var(--color-royal))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>
            🐦
          </div>
          <span style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800, fontSize: "1.2rem",
          }} className="gradient-text">
            Sparrow
          </span>
        </div>
      </div>

      {/* روابط التنقل */}
      <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>

        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}

        {/* قسم الأدمن */}
        {isAdmin && (
          <>
            <div style={{
              margin: "1rem 0.75rem 0.5rem",
              fontSize: "0.7rem",
              color: "var(--color-text-muted)",
              fontWeight: 600,
              letterSpacing: "0.1em",
            }}>
              الإدارة
            </div>
            {ADMIN_ITEMS.map((item) => (
              <NavLink key={item.href} item={item} active={isActive(item.href)} />
            ))}
          </>
        )}
      </nav>

      {/* معلومات المستخدم وتسجيل الخروج */}
      <div style={{
        padding: "1rem 1.25rem",
        borderTop: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}>
        {/* صورة المستخدم */}
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--color-primary), var(--color-accent-blue))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, overflow: "hidden", flexShrink: 0,
        }}>
          {userPicture
            ? <img src={userPicture} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : "👤"
          }
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: "0.82rem", fontWeight: 600,
            color: "var(--color-text-primary)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {userName || "المستخدم"}
          </div>
        </div>

        {/* زر تسجيل الخروج */}
        <button
          onClick={handleLogout}
          title="تسجيل الخروج"
          style={{
            background: "none", border: "none",
            color: "var(--color-text-muted)",
            cursor: "pointer", fontSize: 16, padding: 4,
            borderRadius: 6, transition: "color 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--color-error)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          ⏻
        </button>
      </div>
    </aside>
  );
}

// مكون رابط التنقل
function NavLink({ item, active }: { item: typeof NAV_ITEMS[0]; active: boolean }) {
  return (
    <Link href={item.href} style={{ textDecoration: "none" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "0.75rem",
        padding: "0.6rem 0.75rem", borderRadius: "var(--radius-md)",
        background: active ? "rgba(13, 148, 136, 0.15)" : "transparent",
        color: active ? "var(--color-primary-light)" : "var(--color-text-secondary)",
        fontSize: "0.88rem", fontWeight: active ? 600 : 400,
        transition: "all 0.15s ease",
        borderRight: active ? "3px solid var(--color-primary)" : "3px solid transparent",
        cursor: "pointer",
      }}>
        <span style={{ fontSize: 16 }}>{item.icon}</span>
        {item.label}
      </div>
    </Link>
  );
}
