import { useState } from "react";
import {
  Home,
  LayoutDashboard,
  Shield,
  FileText,
  Scale,
  Mail,
  Accessibility,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

/* =======================
   NAV ITEMS
======================= */
const mainItems = [
  { titleKey: "pages_home", title: "Inicio", url: "/", icon: Home },
  {
    titleKey: "pages_dashboard",
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    requireAuth: true,
  },
];

const infoItems = [
  { titleKey: "footer_privacy", title: "Privacidad", url: "/privacy", icon: FileText },
  { titleKey: "footer_terms", title: "Términos", url: "/terms", icon: Scale },
  { titleKey: "footer_contact", title: "Contacto", url: "/contact", icon: Mail },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [infoOpen, setInfoOpen] = useState(true);

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-primary text-primary-foreground"
        : "text-foreground hover:bg-muted"
    );

  return (
    <Sidebar collapsible="icon">
      {/* ================= HEADER ================= */}
      <SidebarHeader className="border-b px-4 py-3 relative">
        {state !== "collapsed" && (
          <>
            <div className="absolute right-2 top-2">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-2">
              <Accessibility className="h-5 w-5 text-primary" />
              <span className="font-semibold">EcoSense</span>
            </div>
          </>
        )}
      </SidebarHeader>

      {/* ================= CONTENT ================= */}
      <SidebarContent>
        {/* MAIN NAVIGATION */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {t("sidebar")?.navigation ?? "Navegación"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => {
                if (item.requireAuth && !user) return null;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} end className={getNavClassName}>
                        <item.icon className="h-4 w-4" />
                        <span>
                          {t("pages")?.find((p: any) => p.path === item.url)?.label ??
                            item.title}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/admin" className={getNavClassName}>
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* INFORMATION */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {t("sidebar")?.information ?? "Información"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => setInfoOpen((v) => !v)}>
                  <button className="flex w-full items-center justify-between px-2 py-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{t("sidebar")?.info ?? "Información"}</span>
                    </div>
                    {infoOpen ? (
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    ) : (
                      <ChevronRight className="h-4 w-4 opacity-70" />
                    )}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {infoOpen &&
                infoItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavClassName}>
                        <item.icon className="h-4 w-4" />
                        <span>
                          {t("footer")?.[
                            item.titleKey.replace("footer_", "") as any
                          ] ?? item.title}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
