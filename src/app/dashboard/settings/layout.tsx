// src/app/dashboard/settings/layout.tsx
import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "./sidebar-nav"

const sidebarNavItems = [
  {
    title: "Page d'accueil",
    href: "/dashboard/settings/actions",
  },
  {
    title: "Partenaires",
    href: "/dashboard/settings/partners",
  },
  {
    title: "Paiements",
    href: "/dashboard/settings/payments",
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
          Gérez les paramètres et le contenu de votre site.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-5xl">{children}</div>
      </div>
    </div>
  )
}
