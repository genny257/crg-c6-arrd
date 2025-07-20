
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
import Image from "next/image"

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
    if (pathname.includes('/blog') || pathname.includes('/reports') || pathname.includes('/events') || pathname.includes('/dashboard/events') || pathname.includes('/dashboard/blog') || pathname.includes('/dashboard/reports')) {
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
        <Link href="/" className="flex items-center gap-2 p-2">
            <Image src="/logo.png" alt="Croix-Rouge Gabonaise Logo" width={32} height={32} />
            <span className="font-headline text-lg group-data-[collapsible=icon]:hidden">
                CRG-6-Arrond.
            </span>
        </Link>
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
                 <Link href="/blog" className={cn("block text-sm p-2 rounded-md hover:bg-sidebar-accent", (pathname.includes('/blog') || pathname.includes('/dashboard/blog')) && 'bg-sidebar-accent')}>
                    Blog
                  </Link>
                  <Link href="/dashboard/reports" className={cn("block text-sm p-2 rounded-md hover:bg-sidebar-accent", (pathname.includes('/reports') || pathname.includes('/dashboard/reports')) && 'bg-sidebar-accent')}>
                    Rapports
                  </Link>
                   <Link href="/events" className={cn("block text-sm p-2 rounded-md hover:bg-sidebar-accent", (pathname.includes('/events') || pathname.includes('/dashboard/events')) && 'bg-sidebar-accent')}>
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
