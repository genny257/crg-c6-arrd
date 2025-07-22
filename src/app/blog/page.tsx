
"use client"

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost } from "@/types/blog";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
  const [blogPosts, setBlogPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchPosts = React.useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let postsData: BlogPost[] = await response.json();
            
            // On the public page, we only show visible posts, even for admins.
            // Management is done in the dashboard.
            postsData = postsData.filter(p => p.visible);
            
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
    }, [toast]);

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
                  <p className="text-sm text-muted-foreground mb-1">{new Date(post.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <CardTitle className="font-headline text-xl mb-2 group-hover:underline">{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardContent>
              </Link>
              <CardFooter className="p-6 pt-0 flex justify-between items-center">
                <Button asChild variant="secondary">
                  <Link href={`/blog/${post.slug}`}>Lire la suite</Link>
                </Button>
                 {isAdmin && (
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/blog/${post.id}/edit`}>
                            <Eye className="mr-2 h-4 w-4"/>
                            Gérer
                        </Link>
                    </Button>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
