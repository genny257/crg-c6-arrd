
"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { HeartHandshake, BookOpenCheck, ShieldCheck, LifeBuoy, Users, Menu, X, HandHeart, ChevronDown, CheckCircle2, Droplets } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-card shadow-sm z-20 sticky top-0">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
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
          <span className="sr-only">Croix-Rouge Gabonaise</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
          <Link href="#actions" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Nos Actions
          </Link>
          <Link href="/team" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Équipe
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Contact
          </Link>
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium hover:underline underline-offset-4 px-0">
                  Média <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/media/blog">Blog</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/media/reports">Rapports</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="#">Évènements Avenir</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          <Link href="#engagement" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            S'engager
          </Link>
          <Button asChild variant="ghost">
            <Link href="/login">Connexion</Link>
          </Button>
          <Button asChild>
            <Link href="/donations">Faire un Don</Link>
          </Button>
        </nav>
        <div className="ml-auto md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                <span className="sr-only">Ouvrir le menu</span>
            </Button>
        </div>
      </header>

       {isMenuOpen && (
          <div className="fixed top-14 left-0 w-full md:hidden bg-background shadow-md z-50">
              <nav className="flex flex-col items-center gap-4 p-4">
                  <Link href="#actions" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>
                      Nos Actions
                  </Link>
                  <Link href="/team" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>
                      Équipe
                  </Link>
                  <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>
                      Contact
                  </Link>
                   <Link href="/dashboard/media/blog" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>
                      Blog
                  </Link>
                   <Link href="/dashboard/media/reports" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>
                      Rapports
                  </Link>
                  <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>
                      Évènements Avenir
                  </Link>
                  <Link href="#engagement" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>
                      S'engager
                  </Link>
                   <div className="flex flex-col gap-4 w-full items-center mt-4 border-t pt-4">
                        <Button asChild variant="ghost" className="w-full">
                            <Link href="/login" onClick={() => setIsMenuOpen(false)}>Connexion</Link>
                        </Button>
                        <Button asChild className="w-full">
                            <Link href="/donations" onClick={() => setIsMenuOpen(false)}>Faire un Don</Link>
                        </Button>
                   </div>
              </nav>
          </div>
      )}

      <main className="flex-1">
        <section className="w-full h-[60vh] md:h-[70vh] relative">
            <Image
                src="https://placehold.co/1200x800.png"
                alt="Volontaires de la Croix-Rouge"
                data-ai-hint="red cross volunteers"
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold drop-shadow-lg">
                    Croix-Rouge Gabonaise
                </h1>
                <h2 className="text-xl md:text-2xl font-headline mt-2 mb-6 drop-shadow-md">
                    Comité Sixième Arrondissement
                </h2>
                <p className="max-w-2xl text-lg md:text-xl text-neutral-200 mb-8">
                    Ensemble, pour un avenir plus sûr. Rejoignez-nous pour gérer les missions, coordonner les volontaires et amplifier notre impact.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg">
                        <Link href="/register">Devenir Volontaire</Link>
                    </Button>
                    <Button asChild size="lg" variant="secondary">
                        <Link href="/donations">Faire un Don</Link>
                    </Button>
                </div>
            </div>
        </section>
        
        <section id="actions" className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center">
          <div className="container space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Nos Actions</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Agir. Aider. Protéger.</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Découvrez comment nous intervenons sur le terrain pour apporter une aide concrète et un soutien essentiel aux communautés.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <Image
                src="https://placehold.co/600x400.png"
                width={600}
                height={400}
                alt="Urgence & Secourisme"
                data-ai-hint="emergency rescue"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <h3 className="text-2xl font-bold font-headline">Urgences & Secourisme</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Intervention rapide lors de catastrophes naturelles, gestion des postes de secours pour les événements publics et assistance immédiate aux victimes.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="px-0">En savoir plus</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle className="font-headline text-2xl flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-primary" /> Secourisme et Gestion de Catastrophes</DialogTitle>
                        <DialogDescription className="pt-2 text-left">
                          Afin d'améliorer la résilience des communautés, nous menons des actions de préparation et de gestion des catastrophes à travers :
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>La formation aux gestes de premiers secours.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>La sensibilisation sur les changements climatiques.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>La formation sur la sécurité et la santé au travail.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>Le déploiement des équipes de secouristes en situation d'urgence ou de catastrophe.</span>
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <Image
                src="https://placehold.co/600x400.png"
                width={600}
                height={400}
                alt="Aide Sociale & Sanitaire"
                data-ai-hint="social support"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <LifeBuoy className="h-6 w-6 text-primary" />
                    <h3 className="text-2xl font-bold font-headline">Aide Sociale & Sanitaire</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Soutien aux plus vulnérables avec des aides matérielles, financières, et un accompagnement médicosocial pour garantir dignité et bien-être.
                  </p>
                   <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="px-0">En savoir plus</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle className="font-headline text-2xl flex items-center gap-2"><LifeBuoy className="h-6 w-6 text-primary" /> Santé et Action Sociale</DialogTitle>
                        <DialogDescription className="pt-2 text-left">
                          Nous contribuons à l'amélioration des contitions de vie et de santé des populations à travers:
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>La médecine itinérante et de proximité en milieu rurale.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>Les sensibilisations au VIH-SIDA, le dépistage, formation des paires éducateurs et la distribution des contraceptifs.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>Les sensibilisations au paludisme, dépistage, distribution des moustiquaires imprégnées et formation d'agent de santé communautaire.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>Les sensibilisations sur le tabac, l'alcool, la drogue et les maladies chroniques.</span>
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
             <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <Image
                src="https://placehold.co/600x400.png"
                width={600}
                height={400}
                alt="Formations"
                data-ai-hint="first aid training"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <BookOpenCheck className="h-6 w-6 text-primary" />
                        <h3 className="text-2xl font-bold font-headline">Formations</h3>
                    </div>
                  <p className="text-muted-foreground">
                    Apprenez les gestes qui sauvent et développez vos compétences avec nos formations certifiées pour devenir un maillon essentiel de la chaîne de secours.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="px-0">En savoir plus</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle className="font-headline text-2xl flex items-center gap-2"><BookOpenCheck className="h-6 w-6 text-primary" /> Nos Formations Certifiantes</DialogTitle>
                        <DialogDescription className="pt-2 text-left">
                          Devenez un acteur de la chaîne de secours. Nous proposons des formations pour le grand public et les professionnels.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <ul className="space-y-3">
                           <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>Premiers Secours Civiques (PSC1) : Apprenez les gestes essentiels pour réagir face à un accident.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>Initiation aux Premiers Secours (IPS) : Une formation courte pour acquérir les bases.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>Formations pour entreprises : Des modules adaptés pour la sécurité au travail (SST).</span>
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
             <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <Image
                src="https://placehold.co/600x400.png"
                width={600}
                height={400}
                alt="Hygiène, Eau et Assainissement"
                data-ai-hint="clean water community"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-6 w-6 text-primary" />
                    <h3 className="text-2xl font-bold font-headline">Hygiène, Eau, Assainissement</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Promouvoir l'accès à l'eau potable et aux bonnes pratiques d'hygiène pour prévenir les maladies et améliorer la santé communautaire.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="px-0">En savoir plus</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle className="font-headline text-2xl flex items-center gap-2"><Droplets className="h-6 w-6 text-primary" /> Hygiène, Eau et Assainissement</DialogTitle>
                        <DialogDescription className="pt-2 text-left">
                          Nos interventions visent à garantir un environnement sain pour tous à travers :
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>La sensibilisation aux bonnes pratiques d'hygiène (lavage des mains, etc.).</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>La construction et la réhabilitation de points d'eau potable.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>La promotion de l'assainissement de base (latrines, gestion des déchets).</span>
                          </li>
                           <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>La distribution de kits d'hygiène en situation d'urgence.</span>
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
             <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <Image
                src="https://placehold.co/600x400.png"
                width={600}
                height={400}
                alt="Jeunesse"
                data-ai-hint="youth volunteers group"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    <h3 className="text-2xl font-bold font-headline">Jeunesse</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Engager et former les jeunes pour en faire des leaders responsables et des acteurs du changement au sein de leurs communautés.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="px-0">En savoir plus</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle className="font-headline text-2xl flex items-center gap-2"><Users className="h-6 w-6 text-primary" /> Engagement de la Jeunesse</DialogTitle>
                        <DialogDescription className="pt-2 text-left">
                          Nous investissons dans la jeunesse comme moteur de l'action humanitaire future :
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>Création et animation de clubs de jeunes de la Croix-Rouge dans les écoles.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>Formation des jeunes au leadership, au civisme et aux principes humanitaires.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>Organisation de camps de vacances et d'activités socio-éducatives.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>Implication des jeunes dans des projets communautaires (reboisement, nettoyage, etc.).</span>
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="engagement" className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Rejoignez le Mouvement</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Votre engagement peut changer des vies. Devenez volontaire ou faites un don dès aujourd'hui.
              </p>
            </div>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <div className="grid w-full max-w-sm gap-2 rounded-lg border p-6 text-center transition-colors hover:bg-card">
                    <Users className="mx-auto h-10 w-10 text-primary" />
                    <h3 className="mt-2 text-lg font-bold font-headline">Devenir Volontaire</h3>
                    <p className="max-w-xs text-sm text-muted-foreground">
                        Donnez de votre temps et de vos compétences pour aider les autres.
                    </p>
                    <Button asChild className="mt-4">
                        <Link href="/register">S'inscrire</Link>
                    </Button>
                </div>
                <div className="grid w-full max-w-sm gap-2 rounded-lg border p-6 text-center transition-colors hover:bg-card">
                    <HeartHandshake className="mx-auto h-10 w-10 text-primary" />
                    <h3 className="mt-2 text-lg font-bold font-headline">Faire un Don</h3>
                    <p className="max-w-xs text-sm text-muted-foreground">
                        Soutenez financièrement nos actions pour amplifier notre impact.
                    </p>
                    <Button asChild variant="secondary" className="mt-4">
                        <Link href="/donations">Contribuer</Link>
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

    