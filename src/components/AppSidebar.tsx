import { Train, AlertTriangle, Wrench, BarChart3, Settings, Home, FileText, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

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

const navigationItems = [
  { title: "nav.dashboard", url: "/", icon: Home },
  { title: "nav.assets", url: "/assets", icon: Train },
  { title: "nav.faults", url: "/faults", icon: AlertTriangle },
  { title: "nav.maintenance", url: "/maintenance", icon: Wrench },
  { title: "nav.analytics", url: "/analytics", icon: BarChart3 },
  { title: "nav.personnel", url: "/personnel", icon: Users },
  { title: "nav.reports", url: "/reports", icon: FileText },
  { title: "nav.settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { t } = useLanguage();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-metro-blue">
            <Train className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">KMRL</h2>
            <p className="text-xs text-muted-foreground">Metro Management</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('nav.navigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                          isActive 
                            ? "bg-metro-blue text-white" 
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{t(item.title)}</span>
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