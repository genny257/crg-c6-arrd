
"use client"

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, MoreVertical, Pencil, PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost } from "@/types/blog";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data, to be replaced by API call
const mockPosts: BlogPost[] = [
    { id: '1', title: 'Première mission de sensibilisation', date: '2024-07-10T10:00:00Z', excerpt: 'Retour sur notre première mission de sensibilisation dans les écoles.', image: 'https://placehold.co/600x400.png', imageHint: 'school children', slug: 'premiere-mission-sensibilisation', visible: true, content: 'Le contenu complet de l\'article sur la **première mission**.' },
    { id: '2', title: 'Collecte de dons pour les sinistrés', date: '2024-07-09T10:00:00Z', excerpt: 'Un grand merci à tous les donateurs pour leur générosité.', image: 'https://placehold.co/600x400.png', imageHint: 'donation box', slug: 'collecte-de-dons', visible: true, content: 'Le contenu complet de l\'article sur la **collecte de dons**.' },
    { id: '3', title: 'Article masqué pour les admins', date: '2024-07-08T10:00:00Z', excerpt: 'Cet article n\'est visible que par les administrateurs.', image: 'https://placehold.co/600x400.png', imageHint: 'private content', slug: 'article-masque', visible: false, content: 'Contenu de l\'article masqué.' },
];

export default function BlogPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const [blogPosts, setBlogPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchPosts = React.useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/blog');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let postsData: BlogPost[] = await response.json();
            if (!isAdmin) {
                postsData = postsData.filter(p => p.visible);
            }
            setBlogPosts(postsData);
        } catch (error) {
            console.error("Error fetching blog posts: ", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger les articles.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [isAdmin, toast]);

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: string) => {
    if (!id) return;
    // TODO: Replace with API call to DELETE /api/blog/{id}
    setBlogPosts(blogPosts.filter(p => p.id !== id));
    toast({ title: "Succès", description: "L'article a été supprimé." });
  };

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
     if (!id) return;
    // TODO: Replace with API call to PATCH /api/blog/{id}
    setBlogPosts(blogPosts.map(p => p.id === id ? { ...p, visible: !p.visible } : p));
    toast({ title: "Succès", description: `L'article est maintenant ${!currentVisibility ? 'visible' : 'masqué'}.` });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-headline font-bold">Blog</h2>
          <p className="text-muted-foreground">Les dernières nouvelles et articles de la Croix-Rouge Gabonaise.</p>
        </div>
        {isAdmin && (
          <Button asChild>
            <Link href="/dashboard/blog/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouvel article
            </Link>
          </Button>
        )}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="p-0">
                <Skeleton className="rounded-t-lg aspect-video" />
              </CardHeader>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-1" />
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))
        ) : (
          blogPosts.map((post) => (
            <Card key={post.id} className="flex flex-col relative">
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 bg-black/20 hover:bg-black/50 text-white hover:text-white">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/blog/${post.id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Modifier</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleVisibility(post.id, post.visible)}>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>{post.visible ? 'Masquer' : 'Afficher'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Supprimer</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Link href={`/blog/${post.slug}`} className="contents">
                <CardHeader className="p-0">
                  <Image
                    src={post.image || "https://placehold.co/600x400.png"}
                    alt={post.title}
                    data-ai-hint={post.imageHint}
                    width={600}
                    height={400}
                    className="rounded-t-lg object-cover aspect-video"
                  />
                </CardHeader>
                <CardContent className="p-6 flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{new Date(post.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <CardTitle className="font-headline text-xl mb-2 group-hover:underline">{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardContent>
              </Link>
              <CardFooter className="p-6 pt-0 flex justify-between items-center">
                <Button asChild variant="secondary">
                  <Link href={`/blog/${post.slug}`}>Lire la suite</Link>
                </Button>
                {!post.visible && isAdmin && <span className="text-xs font-semibold text-amber-600">Masqué</span>}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
