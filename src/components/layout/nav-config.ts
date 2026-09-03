import {
  LayoutDashboard,
  Users,
  MessageSquare,
  ListChecks,
  Megaphone,
  Plug,
  Settings,
  Home,
  Inbox,
  BarChart3,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const sidebarNavItems: NavItem[] = [
  { label: "Overview", href: "/overview", icon: LayoutDashboard },
  { label: "Leads", href: "/inbox", icon: Users },
  { label: "Conversations", href: "/inbox", icon: MessageSquare },
  { label: "Qualification", href: "/qualification", icon: ListChecks },
  { label: "Campaigns", href: "/campaigns", icon: Megaphone },
  { label: "Integrations", href: "/integrations", icon: Plug },
];

export const settingsNavItem: NavItem = {
  label: "Settings",
  href: "/settings",
  icon: Settings,
};

export const bottomNavItems: NavItem[] = [
  { label: "Home", href: "/overview", icon: Home },
  { label: "Leads", href: "/inbox", icon: Users },
  { label: "Inbox", href: "/inbox", icon: Inbox },
  { label: "Analytics", href: "/overview", icon: BarChart3 },
  { label: "More", href: "/integrations", icon: MoreHorizontal },
];
