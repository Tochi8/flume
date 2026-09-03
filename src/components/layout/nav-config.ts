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
  CreditCard,
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
  { label: "Conversations", href: "/inbox/lead_1", icon: MessageSquare },
  { label: "Qualification", href: "/qualification", icon: ListChecks },
  { label: "Campaigns", href: "/campaigns", icon: Megaphone },
  { label: "Integrations", href: "/integrations", icon: Plug },
];

export const settingsNavItem: NavItem = {
  label: "Settings",
  href: "/settings",
  icon: Settings,
};

export const moreMenuItems: NavItem[] = [
  { label: "Qualification", href: "/qualification", icon: ListChecks },
  { label: "Campaigns", href: "/campaigns", icon: Megaphone },
  { label: "Integrations", href: "/integrations", icon: Plug },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];
