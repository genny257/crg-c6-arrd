
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const blogPosts = [
    {
        title: "Notre engagement lors des dernières inondations",
        date: "12 Juillet 2024",
        excerpt: "Retour sur nos actions à Libreville pour venir en aide aux sinistrés. Mobilisation, distribution de kits et soutien psychologique...",
        image: "https://placehold.co/600x400.png",
        imageHint: "flood relief",
        slug: "/dashboard/media/blog/inondations-libreville"
    },
    {
        title: "La jeunesse de la Croix-Rouge, un engagement qui a du sens",
        date: "28 Juin 2024",
        excerpt: "Portrait de Marie, jeune volontaire de 19 ans, qui nous partage son expérience et ses motivations au sein de notre comité.",
        image: "https://placehold.co/600x400.png",
        imageHint: "young volunteer",
        slug: "/dashboard/media/blog/portrait-jeune-volontaire"
    },
    {
        title: "Conseils de prévention : se protéger contre le paludisme",
        date: "15 Juin 2024",
        excerpt: "Le paludisme reste une menace. Découvrez les gestes simples et les bonnes pratiques pour vous protéger et protéger votre entourage.",
        image: "https://placehold.co/600x400.png",
        imageHint: "malaria prevention",
        slug: "/dashboard/media/blog/prevention-paludisme"
    }
];

export default function BlogPage() {
  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-headline font-bold">Blog</h2>
                <p className="text-muted-foreground">Les dernières nouvelles et articles de la Croix-Rouge Gabonaise.</p>
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nouvel article
            </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
                <Card key={post.title} className="flex flex-col">
                    <CardHeader className="p-0">
                         <Image
                            src={post.image}
                            alt={post.title}
                            data-ai-hint={post.imageHint}
                            width={600}
                            height={400}
                            className="rounded-t-lg object-cover aspect-video"
                         />
                    </CardHeader>
                    <CardContent className="p-6 flex-1">
                        <p className="text-sm text-muted-foreground mb-1">{post.date}</p>
                        <CardTitle className="font-headline text-xl mb-2">{post.title}</CardTitle>
                        <CardDescription>{post.excerpt}</CardDescription>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                        <Button asChild variant="secondary">
                            <Link href={post.slug}>Lire la suite</Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    </div>
  )
}
