
"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { HeartHandshake, BookOpenCheck, ShieldCheck, LifeBuoy, Users, CheckCircle2, Droplets, Siren, Soup, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import type { HomePageContent, AnnualStatData, ActionSection } from "@/types/homepage"
import { Skeleton } from "@/components/ui/skeleton"
import { PublicLayout } from "@/components/public-layout"
import type { Event } from "@/types/event"
import type { BlogPost } from "@/types/blog"
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


const initialContent: HomePageContent = {
    heroTitle: "Comité du 6ème Arrondissement",
    heroSubtitle: "Croix-Rouge Gabonaise",
    heroDescription: "Ensemble, pour un avenir plus sûr. Rejoignez-nous pour gérer les missions, coordonner les volontaires et amplifier notre impact.",
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


type CarouselItemData = {
    id: string;
    title: string;
    image: string;
    imageHint?: string;
    href: string;
    date: string;
};

const StatsSection = ({ statsData }: { statsData: AnnualStatData[] }) => {
    const [selectedYear, setSelectedYear] = React.useState<number>(new Date().getFullYear());

    const availableYears = statsData.map(s => s.year).sort((a, b) => b - a);

    React.useEffect(() => {
        if (availableYears.length > 0) {
            setSelectedYear(availableYears[0]);
        }
    }, [availableYears]);

    const currentStats = statsData.find(s => s.year === selectedYear);
    
    const statsItems = currentStats ? [
        { label: "Bases Communautaires Impliquées", value: currentStats.bases, goal: 20, color: "bg-accent" },
        { label: "Agents de Santé Communautaires Formés", value: currentStats.agents, goal: 100, color: "bg-primary" },
        { label: "Personnes Formées aux Soins de Premiers Secours", value: currentStats.firstAidGraduates, goal: 500, color: "bg-accent" },
        { label: "Ménages Sinistrés Assistés", value: currentStats.assistedHouseholds, goal: 50, color: "bg-accent" },
        { label: "Personnes Sensibilisées (VIH, SSR, VBG, COVID-19)", value: currentStats.sensitizedPeople, goal: 15000, color: "bg-primary" },
        { label: "Préservatifs distribués", value: currentStats.condomsDistributed, goal: 10000, color: "bg-primary" }
    ] : [];

    const StatItem = ({ label, value, goal, color }: { label: string, value: number, goal: number, color: string }) => (
        <div className="space-y-2">
            <p className="text-sm font-medium">{label}</p>
            <div className="flex items-center gap-2">
                <Progress value={(value / goal) * 100} className="h-2 [&>div]:bg-transparent" indicatorClassName={color} />
                <span className="font-bold text-lg">{value}</span>
            </div>
        </div>
    );

    return (
        <section id="stats" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Nos Résultats</div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Notre Impact en Chiffres</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Découvrez l'impact de nos actions sur le terrain. Votre soutien fait la différence.
                    </p>
                </div>

                <div className="mx-auto max-w-5xl mt-12">
                     <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-6 w-6 text-primary" />
                                Statistiques Annuelles
                            </CardTitle>
                             <Select onValueChange={(value) => setSelectedYear(Number(value))} value={String(selectedYear)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Choisir une année" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableYears.map(year => (
                                        <SelectItem key={year} value={String(year)}>Année {year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent>
                            {currentStats ? (
                                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                                    {statsItems.map(item => (
                                        <StatItem key={item.label} {...item} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">Aucune statistique disponible pour l'année sélectionnée.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};


export default function Home() {
  const [content, setContent] = React.useState<HomePageContent | null>(null);
  const [actions, setActions] = React.useState<ActionSection[]>([]);
  const [carouselItems, setCarouselItems] = React.useState<CarouselItemData[]>([]);
  const [annualStats, setAnnualStats] = React.useState<AnnualStatData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const [actionsRes, eventsRes, blogsRes, statsRes] = await Promise.all([
           fetch(`${process.env.NEXT_PUBLIC_API_URL}/actions`),
           fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/featured`),
           fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/featured`),
           fetch(`${process.env.NEXT_PUBLIC_API_URL}/annual-stats/public`),
        ]);

        setContent(initialContent);
        setActions(actionsRes.ok ? await actionsRes.json() : []);
        setAnnualStats(statsRes.ok ? await statsRes.json() : []);
        
        const eventsData = eventsRes.ok ? await eventsRes.json() : [];
        const blogsData = blogsRes.ok ? await blogsRes.json() : [];

        const formattedEvents: CarouselItemData[] = eventsData.map((event: Event) => ({
            id: `event-${event.id}`,
            title: event.title,
            image: event.image || "https://placehold.co/1200x800.png",
            imageHint: event.imageHint,
            href: `/events#${event.id}`, // Can be improved later
            date: event.date
        }));

        const formattedBlogs: CarouselItemData[] = blogsData.map((post: BlogPost) => ({
            id: `blog-${post.id}`,
            title: post.title,
            image: post.image || "https://placehold.co/1200x800.png",
            imageHint: post.imageHint,
            href: `/blog/${post.slug}`,
            date: post.createdAt
        }));
        
        const combinedItems = [...formattedEvents, ...formattedBlogs]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3); // Take the 3 most recent items overall

        setCarouselItems(combinedItems);

      } catch (error: any) {
        console.error("Error fetching home page content: ", error);
        setContent(initialContent); // Fallback to initial content on error
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);
  
  const finalCarouselItems = carouselItems.length > 0 ? carouselItems : [{
        id: 'placeholder-1',
        title: "Rejoignez nos actions",
        image: "https://placehold.co/1200x800.png",
        imageHint: "red cross volunteers",
        href: "/events",
        date: new Date().toISOString()
    }];

  const displayContent = content || initialContent;

  return (
    <PublicLayout>
      <main className="flex-1">
        <section className="w-full h-[60vh] md:h-[70vh] relative">
            <Carousel 
                className="w-full h-full" 
                plugins={[Autoplay({ delay: 5000 })]}
                opts={{ loop: true }}
            >
                <CarouselContent className="h-full">
                    {finalCarouselItems.map((item, index) => (
                        <CarouselItem key={item.id} className="h-full">
                            <Link href={item.href} className="w-full h-full block relative">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    data-ai-hint={item.imageHint}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                />
                                 <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-8 text-white">
                                    <h2 className="text-2xl md:text-4xl font-headline font-bold drop-shadow-lg">{item.title}</h2>
                                 </div>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
            </Carousel>
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white p-4 pointer-events-none">
                {loading ? (
                    <>
                        <Skeleton className="h-16 w-3/4 mb-4 bg-white/20" />
                        <Skeleton className="h-8 w-1/2 mb-6 bg-white/20" />
                        <Skeleton className="h-5 w-full max-w-2xl mb-2 bg-white/20" />
                        <Skeleton className="h-5 w-2/3 max-w-2xl mb-8 bg-white/20" />
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
                <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto">
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
            {actions.map((action, index) => {
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
        
        <StatsSection statsData={annualStats} />

        <section id="engagement" className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center">
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

        <section id="volunteers-of-month" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Nos Héros</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Volontaires du Mois</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Chaque mois, nous mettons en lumière des volontaires qui se sont distingués par leur dévouement exceptionnel.
              </p>
            </div>
            <div className="mx-auto grid grid-cols-1 gap-6 pt-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4 border-4 border-primary/20">
                  <AvatarImage src="https://placehold.co/200x200.png" alt="Volontaire 1" data-ai-hint="female portrait" />
                  <AvatarFallback>AV1</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold font-headline">Marie-Claire Dupont</h3>
                <p className="text-muted-foreground">Pôle Secourisme</p>
              </div>
              <div className="flex flex-col items-center text-center">
                 <Avatar className="h-32 w-32 mb-4 border-4 border-primary/20">
                  <AvatarImage src="https://placehold.co/200x200.png" alt="Volontaire 2" data-ai-hint="male portrait" />
                  <AvatarFallback>AV2</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold font-headline">Jean-Pierre Okoro</h3>
                <p className="text-muted-foreground">Pôle Aide Sociale</p>
              </div>
              <div className="flex flex-col items-center text-center">
                 <Avatar className="h-32 w-32 mb-4 border-4 border-primary/20">
                  <AvatarImage src="https://placehold.co/200x200.png" alt="Volontaire 3" data-ai-hint="female portrait" />
                  <AvatarFallback>AV3</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold font-headline">Aïcha Bongo</h3>
                <p className="text-muted-foreground">Pôle Jeunesse</p>
              </div>
            </div>
          </div>
        </section>

        <section id="partners" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Nos Partenaires</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Ils nous font confiance</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Nous remercions nos partenaires institutionnels et privés pour leur soutien indéfectible à notre mission humanitaire.
              </p>
            </div>
            <div className="divide-y divide-border rounded-lg border mt-12">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 place-items-center">
                <div className="flex w-full items-center justify-center p-8">
                  <Image src="https://placehold.co/150x60.png" alt="Partner Logo" width={140} height={70} data-ai-hint="government logo" className="grayscale transition-all duration-300 hover:grayscale-0" />
                </div>
                <div className="flex w-full items-center justify-center p-8">
                  <Image src="https://placehold.co/150x60.png" alt="Partner Logo" width={140} height={70} data-ai-hint="unicef logo" className="grayscale transition-all duration-300 hover:grayscale-0" />
                </div>
                <div className="flex w-full items-center justify-center p-8">
                  <Image src="https://placehold.co/150x60.png" alt="Partner Logo" width={140} height={70} data-ai-hint="who logo" className="grayscale transition-all duration-300 hover:grayscale-0" />
                </div>
                <div className="flex w-full items-center justify-center p-8">
                  <Image src="https://placehold.co/150x60.png" alt="Partner Logo" width={140} height={70} data-ai-hint="corporate logo" className="grayscale transition-all duration-300 hover:grayscale-0" />
                </div>
                <div className="flex w-full items-center justify-center p-8">
                  <Image src="https://placehold.co/150x60.png" alt="Partner Logo" width={140} height={70} data-ai-hint="bank logo" className="grayscale transition-all duration-300 hover:grayscale-0" />
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </PublicLayout>
  )
}
