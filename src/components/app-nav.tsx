
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  HeartHandshake,
  User,
  LogOut,
  Settings,
  LineChart,
  Calendar,
  Network,
  ChevronDown,
  Newspaper,
  CalendarClock,
  CalendarDays,
  Archive,
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

const mainNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/dashboard/missions", icon: Briefcase, label: "Missions" },
  { href: "/dashboard/volunteers", icon: Users, label: "Volontaires" },
  { href: "/dashboard/team", icon: Network, label: "Équipe", adminOnly: true },
  { href: "/dashboard/calendar", icon: Calendar, label: "Calendrier" },
  { href: "/dashboard/archive", icon: Archive, label: "Archives", adminOnly: true },
]

const reportsNavItems = [
    { href: "/dashboard/donations", icon: HeartHandshake, label: "Dons" },
    { href: "/dashboard/analytics", icon: LineChart, label: "Statistiques" },
]

export function AppNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth();
  const [isMediaOpen, setIsMediaOpen] = React.useState(false);

  React.useEffect(() => {
    if (pathname.startsWith('/blog') || pathname.startsWith('/reports') || pathname.startsWith('/events') || pathname.startsWith('/dashboard/events') || pathname.startsWith('/dashboard/blog')) {
      setIsMediaOpen(true);
    }
  }, [pathname]);

  const filteredMainNav = mainNavItems.filter(item => {
    if (!item.adminOnly) return true;
    return user?.role === 'admin' || user?.role === 'superadmin';
  });

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
            <svg
                width="32"
                height="32"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary w-8 h-8"
            >
                <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 40C15.16 40 8 32.84 8 24C8 15.16 15.16 8 24 8C32.84 8 40 15.16 40 24C40 32.84 32.84 40 24 40ZM26 22V12H22V22H12V26H22V36H26V26H36V22H26Z"
                fill="currentColor"
                />
            </svg>
            <span className="font-headline text-lg group-data-[collapsible=icon]:hidden">
                Gabon Relief Hub
            </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {filteredMainNav.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
           <SidebarMenuItem>
            <Collapsible open={isMediaOpen} onOpenChange={setIsMediaOpen}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  variant="ghost"
                  className="w-full justify-start"
                  isActive={isMediaOpen}
                  tooltip="Média"
                >
                  <Newspaper className="h-4 w-4" />
                  <span>Média</span>
                  <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", isMediaOpen && "rotate-180")} />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-8 py-1 space-y-1">
                 <Link href="/blog" className={cn("block text-sm p-2 rounded-md hover:bg-sidebar-accent", (pathname === '/blog' || pathname.startsWith('/dashboard/blog')) && 'bg-sidebar-accent')}>
                    Blog
                  </Link>
                  <Link href="/reports" className={cn("block text-sm p-2 rounded-md hover:bg-sidebar-accent", (pathname === '/reports' || pathname.startsWith('/dashboard/reports')) && 'bg-sidebar-accent')}>
                    Rapports
                  </Link>
                   <Link href="/events" className={cn("block text-sm p-2 rounded-md hover:bg-sidebar-accent", (pathname === '/events' || pathname.startsWith('/dashboard/events')) && 'bg-sidebar-accent')}>
                    Évènements
                  </Link>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
         <SidebarMenu>
            <SidebarMenuItem>
                <span className="px-2 text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">Rapports</span>
            </SidebarMenuItem>
          {reportsNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/profile')} tooltip="Profil">
                    <Link href="/dashboard/profile">
                        <User className="h-4 w-4" />
                        <span>Profil</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Paramètres" asChild>
                    <Link href="#">
                        <Settings className="h-4 w-4" />
                        <span>Paramètres</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarSeparator />
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Déconnexion" asChild onClick={logout}>
                    <Link href="/">
                        <LogOut className="h-4 w-4" />
                        <span>Déconnexion</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}
