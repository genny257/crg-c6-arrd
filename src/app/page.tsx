import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { HeartHandshake, BookOpenCheck, ShieldCheck, LifeBuoy } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-card shadow-sm z-10 sticky top-0">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 40C15.16 40 8 32.84 8 24C8 15.16 15.16 8 24 8C32.84 8 40 15.16 40 24C40 32.84 32.84 40 24 40ZM26 22V12H22V22H12V26H22V36H26V26H36V22H26Z"
              fill="currentColor"
            />
          </svg>
          <span className="sr-only">Gabon Relief Hub</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="#actions" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Nos Actions
          </Link>
          <Link href="#engagement" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            S'engager
          </Link>
          <Button asChild variant="ghost">
            <Link href="/login">Connexion</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Faire un Don</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full pt-12 md:pt-24 lg:pt-32">
          <div className="container px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
              <div>
                <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem] font-headline text-primary">
                  Gabon Relief Hub
                </h1>
                <h2 className="text-xl md:text-2xl font-headline text-foreground/80 mt-2">
                  La plateforme de la Croix-Rouge Gabonaise
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
                  Ensemble, pour un avenir plus sûr. Rejoignez-nous pour gérer les missions, coordonner les volontaires et amplifier notre impact.
                </p>
                <div className="space-x-4 mt-6">
                  <Button asChild size="lg">
                    <Link href="/login">Devenir Volontaire</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/dashboard/missions">Voir les Missions</Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <Image
                  src="https://firebasestudio.ai/api/files/GerejeZ/patched/gabon-red-cross-logo.png"
                  width={500}
                  height={300}
                  alt="Logo de la Croix-Rouge Gabonaise"
                  className="rounded-xl object-contain"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section id="actions" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Nos Actions</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Agir. Aider. Protéger.</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Découvrez comment nous intervenons sur le terrain pour apporter une aide concrète et un soutien essentiel aux communautés.
                </p>
              </div>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              <div className="grid gap-2 text-center p-4 rounded-lg hover:bg-background transition-colors">
                <ShieldCheck className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-lg font-bold font-headline mt-2">Urgences & Secourisme</h3>
                <p className="text-sm text-muted-foreground">
                  Intervention rapide lors de catastrophes naturelles et gestion des postes de secours pour les événements publics.
                </p>
              </div>
              <div className="grid gap-2 text-center p-4 rounded-lg hover:bg-background transition-colors">
                <LifeBuoy className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-lg font-bold font-headline mt-2">Aide Sociale & Sanitaire</h3>
                <p className="text-sm text-muted-foreground">
                  Soutien aux plus vulnérables avec des aides matérielles, financières, et un accompagnement médicosocial.
                </p>
              </div>
              <div className="grid gap-2 text-center p-4 rounded-lg hover:bg-background transition-colors">
                <BookOpenCheck className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-lg font-bold font-headline mt-2">Formations</h3>
                <p className="text-sm text-muted-foreground">
                  Apprenez les gestes qui sauvent et développez vos compétences avec nos formations certifiées.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="engagement" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Rejoignez le Mouvement</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Votre engagement peut changer des vies. Devenez volontaire ou faites un don dès aujourd'hui.
              </p>
            </div>
            <div className="mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                <div className="grid gap-2 text-center p-6 rounded-lg hover:bg-card transition-colors border w-full sm:w-auto">
                    <HeartHandshake className="h-10 w-10 mx-auto text-primary" />
                    <h3 className="text-lg font-bold font-headline mt-2">Devenir Volontaire</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        Donnez de votre temps et de vos compétences pour aider les autres.
                    </p>
                    <Button asChild className="mt-4">
                        <Link href="/login">S'inscrire</Link>
                    </Button>
                </div>
                <div className="grid gap-2 text-center p-6 rounded-lg hover:bg-card transition-colors border w-full sm:w-auto">
                    <HeartHandshake className="h-10 w-10 mx-auto text-primary" />
                    <h3 className="text-lg font-bold font-headline mt-2">Faire un Don</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        Soutenez financièrement nos actions pour amplifier notre impact.
                    </p>
                    <Button asChild variant="secondary" className="mt-4">
                        <Link href="/login">Contribuer</Link>
                    </Button>
                </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-card">
        <p className="text-xs text-muted-foreground">&copy; 2024 Croix-Rouge Gabonaise. Tous droits réservés.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Termes & Conditions
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Politique de confidentialité
          </Link>
        </nav>
      </footer>
    </div>
  )
}
