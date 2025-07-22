
"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { HeartHandshake, BookOpenCheck, ShieldCheck, LifeBuoy, Users, CheckCircle2, Droplets, Siren, Soup } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import type { HomePageContent } from "@/types/homepage"
import { Skeleton } from "@/components/ui/skeleton"
import { PublicLayout } from "@/components/public-layout"

const initialContent: HomePageContent = {
    heroTitle: "Comité du 6ème Arrondissement",
    heroSubtitle: "Croix-Rouge Gabonaise",
    heroDescription: "Ensemble, pour un avenir plus sûr. Rejoignez-nous pour gérer les missions, coordonner les volontaires et amplifier notre impact.",
    actions: [
        { title: "Urgences & Secourisme", description: "Intervention rapide lors de catastrophes naturelles, gestion des postes de secours pour les événements publics et assistance immédiate aux victimes.", image: "https://placehold.co/600x400.png", imageHint: "emergency rescue", dialogTitle: "Secourisme et Gestion de Catastrophes", dialogDescription: "Afin d'améliorer la résilience des communautés, nous menons des actions de préparation et de gestion des catastrophes à travers :", dialogList: ["La formation aux gestes de premiers secours.", "La sensibilisation sur les changements climatiques.", "La formation sur la sécurité et la santé au travail.", "Le déploiement des équipes de secouristes en situation d'urgence ou de catastrophe."] },
        { title: "Aide Sociale & Sanitaire", description: "Soutien aux plus vulnérables avec des aides matérielles, financières, et un accompagnement médicosocial pour garantir dignité et bien-être.", image: "https://placehold.co/600x400.png", imageHint: "social support", dialogTitle: "Santé et Action Sociale", dialogDescription: "Nous contribuons à l'amélioration des contitions de vie et de santé des populations à travers:", dialogList: ["La médecine itinérante et de proximité en milieu rurale.", "Les sensibilisations au VIH-SIDA, le dépistage, formation des paires éducateurs et la distribution des contraceptifs.", "Les sensibilisations au paludisme, dépistage, distribution des moustiquaires imprégnées et formation d'agent de santé communautaire.", "Les sensibilisations sur le tabac, l'alcool, la drogue et les maladies chroniques."] },
        { title: "Formations", description: "Apprenez les gestes qui sauvent et développez vos compétences avec nos formations certifiées pour devenir un maillon essentiel de la chaîne de secours.", image: "https://placehold.co/600x400.png", imageHint: "first aid training", dialogTitle: "Nos Formations Certifiantes", dialogDescription: "Devenez un acteur de la chaîne de secours. Nous proposons des formations pour le grand public et les professionnels.", dialogList: ["Premiers Secours Civiques (PSC1) : Apprenez les gestes essentiels pour réagir face à un accident.", "Premiers Secours en Équipe (PSE1 & PSE2) : Pour les interventions en équipe avec matériel.", "Initiation aux Premiers Secours (IPS) : Une formation courte pour acquérir les bases.", "Formations pour entreprises : Des modules adaptés pour la sécurité au travail (SST)."] },
        { title: "Hygiène, Eau, Assainissement", description: "Promouvoir l'accès à l'eau potable et aux bonnes pratiques d'hygiène pour prévenir les maladies et améliorer la santé communautaire.", image: "https://placehold.co/600x400.png", imageHint: "clean water community", dialogTitle: "Hygiène, Eau, Assainissement et développement", dialogDescription: "En vue de garantir un envirronement sain et sûr, nos actions d'assainissement du milieu et de développement durable s'articulent autour :", dialogList: ["Du Curage des caniveaux, des cours d'eau et des bassins versants.", "Du Désherbage dans les zones ciblées.", "Du Ramassage des déchets plastiques.", "Du Lavage des mains dans les établissements scolaires.", "Du Nettoyage des plages.", "De La sensibilisation des communautés."] },
        { title: "Jeunesse", description: "Engager et former les jeunes pour en faire des leaders responsables et des acteurs du changement au sein de leurs communautés.", image: "https://placehold.co/600x400.png", imageHint: "youth volunteers group", dialogTitle: "Jeunesse", dialogDescription: "Soucieux de du rôle fondamental des jeunes, nous investissons dans le renforcement de leurs capacités à travers:", dialogList: ["La formation sur la sécurité routière en milieu scolaire.", "la mise en place des clubs Croix-Rouge dans les lycées et collèges.", "L'organisation des \"Camps de Jeunesse\".", "Les formations diverses."] }
    ],
    engagement: {
        title: "Rejoignez le Mouvement",
        description: "Votre engagement peut changer des vies. Devenez volontaire ou faites un don dès aujourd'hui.",
        volunteerTitle: "Devenir Volontaire",
        volunteerDescription: "Donnez de votre temps et de vos compétences pour aider les autres.",
        donationTitle: "Faire un Don",
        donationDescription: "Soutenez financièrement nos actions pour amplifier notre impact."
    }
};

const actionIcons: { [key: string]: React.ElementType } = {
  "Urgences & Secourisme": ShieldCheck,
  "Aide Sociale & Sanitaire": LifeBuoy,
  "Formations": BookOpenCheck,
  "Hygiène, Eau, Assainissement": Droplets,
  "Jeunesse": Users,
};


export default function Home() {
  const [content, setContent] = React.useState<HomePageContent | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        // Here you would fetch from your API:
        // const response = await fetch('http://localhost:3001/api/content/home');
        // const data = await response.json();
        // setContent(data);
        
        // For now, we continue using initial static content
        setContent(initialContent);
      } catch (error) {
        console.error("Error fetching home page content: ", error);
        setContent(initialContent); // Fallback to initial content on error
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const displayContent = content || initialContent;

  return (
    <PublicLayout>
      <main className="flex-1">
        <section className="w-full h-[60vh] md:h-[70vh] relative">
            <Image
                src="https://placehold.co/1200x800.png"
                alt="Volontaires de la Croix-Rouge"
                data-ai-hint="red cross volunteers"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
                {loading ? (
                    <>
                        <Skeleton className="h-16 w-3/4 mb-4" />
                        <Skeleton className="h-8 w-1/2 mb-6" />
                        <Skeleton className="h-5 w-full max-w-2xl mb-2" />
                        <Skeleton className="h-5 w-2/3 max-w-2xl mb-8" />
                    </>
                ) : (
                    <>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-bold drop-shadow-lg">
                            {displayContent.heroTitle}
                        </h1>
                        <h2 className="text-xl md:text-2xl font-headline mt-2 mb-6 drop-shadow-md">
                            {displayContent.heroSubtitle}
                        </h2>
                        <p className="max-w-2xl text-lg md:text-xl text-neutral-200 mb-8">
                            {displayContent.heroDescription}
                        </p>
                    </>
                )}
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
            {displayContent.actions.map((action, index) => {
                const Icon = actionIcons[action.title] || ShieldCheck;
                return (
                    <div key={index} className={`mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12`}>
                      <Image
                        src={action.image}
                        width={600}
                        height={400}
                        alt={action.title}
                        data-ai-hint={action.imageHint}
                        className={cn("mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full", index % 2 !== 0 && "lg:order-last")}
                      />
                      <div className="flex flex-col justify-center space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Icon className="h-6 w-6 text-primary" />
                            {loading ? <Skeleton className="h-8 w-48" /> : <h3 className="text-2xl font-bold font-headline">{action.title}</h3>}
                          </div>
                          {loading ? <> <Skeleton className="h-4 w-full" /> <Skeleton className="h-4 w-5/6" /> </> : <p className="text-muted-foreground">{action.description}</p>}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="link" className="px-0">En savoir plus</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[525px]">
                              <DialogHeader>
                                <DialogTitle className="font-headline text-2xl flex items-center gap-2">
                                    <Icon className="h-6 w-6 text-primary" /> {action.dialogTitle}
                                </DialogTitle>
                                <DialogDescription className="pt-2 text-left">
                                  {action.dialogDescription}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <ul className="space-y-3">
                                  {action.dialogList.map((item, i) => (
                                      <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                        <span>{item}</span>
                                      </li>
                                  ))}
                                </ul>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                )
            })}
          </div>
        </section>
        
        <section id="engagement" className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              {loading ? (
                <>
                  <Skeleton className="h-10 w-64 mb-2" />
                  <Skeleton className="h-5 w-full max-w-xl" />
                  <Skeleton className="h-5 w-3/4 max-w-xl" />
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">{displayContent.engagement.title}</h2>
                  <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    {displayContent.engagement.description}
                  </p>
                </>
              )}
            </div>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <div className="grid w-full max-w-sm gap-2 rounded-lg border bg-card p-6 text-center transition-colors hover:bg-card/90">
                    <Users className="mx-auto h-10 w-10 text-primary" />
                    {loading ? (
                      <>
                        <Skeleton className="h-6 w-3/4 mx-auto mt-2" />
                        <Skeleton className="h-4 w-full mx-auto mt-1" />
                        <Skeleton className="h-4 w-5/6 mx-auto mt-1" />
                        <Skeleton className="h-10 w-24 mx-auto mt-4" />
                      </>
                    ) : (
                        <>
                        <h3 className="mt-2 text-lg font-bold font-headline">{displayContent.engagement.volunteerTitle}</h3>
                        <p className="max-w-xs text-sm text-muted-foreground">
                            {displayContent.engagement.volunteerDescription}
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/register">S'inscrire</Link>
                        </Button>
                        </>
                    )}
                </div>
                <div className="grid w-full max-w-sm gap-2 rounded-lg border bg-card p-6 text-center transition-colors hover:bg-card/90">
                    <HeartHandshake className="mx-auto h-10 w-10 text-primary" />
                    {loading ? (
                      <>
                        <Skeleton className="h-6 w-3/4 mx-auto mt-2" />
                        <Skeleton className="h-4 w-full mx-auto mt-1" />
                        <Skeleton className="h-4 w-5/6 mx-auto mt-1" />
                        <Skeleton className="h-10 w-24 mx-auto mt-4" />
                      </>
                    ) : (
                        <>
                            <h3 className="mt-2 text-lg font-bold font-headline">{displayContent.engagement.donationTitle}</h3>
                            <p className="max-w-xs text-sm text-muted-foreground">
                                {displayContent.engagement.donationDescription}
                            </p>
                            <Button asChild variant="secondary" className="mt-4">
                                <Link href="/donations">Contribuer</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  )
}
