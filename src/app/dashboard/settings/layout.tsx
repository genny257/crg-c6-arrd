// src/app/dashboard/settings/layout.tsx
import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "./sidebar-nav"

const sidebarNavItems = [
  {
    title: "Général",
    href: "/dashboard/settings",
  },
  {
    title: "Paiements",
    href: "/dashboard/settings/payments",
  },
  {
    title: "Apparence",
    href: "/dashboard/settings/appearance",
  },
  {
    title: "Notifications",
    href: "/dashboard/settings/notifications",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6 lg:p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Paramètres</h2>
        <p className="text-muted-foreground">
          Gérez les paramètres de votre compte et du site.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-4xl">{children}</div>
      </div>
    </div>
  )
}
