
"use client"

import * as React from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, MoreVertical, Pencil, PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase/client";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost } from "@/types/blog";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const [blogPosts, setBlogPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchPosts = React.useCallback(async () => {
    setLoading(true);
    try {
      const q = isAdmin 
        ? query(collection(db, "blogPosts"), orderBy("date", "desc"))
        : query(collection(db, "blogPosts"), where("visible", "==", true), orderBy("date", "desc"));
      
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
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
    try {
      await deleteDoc(doc(db, "blogPosts", id));
      setBlogPosts(blogPosts.filter(p => p.id !== id));
      toast({ title: "Succès", description: "L'article a été supprimé." });
    } catch (error) {
      console.error("Error deleting post: ", error);
      toast({ title: "Erreur", description: "La suppression de l'article a échoué.", variant: "destructive" });
    }
  };

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
     if (!id) return;
    try {
      const postRef = doc(db, "blogPosts", id);
      await updateDoc(postRef, { visible: !currentVisibility });
      setBlogPosts(blogPosts.map(p => p.id === id ? { ...p, visible: !p.visible } : p));
      toast({ title: "Succès", description: `L'article est maintenant ${!currentVisibility ? 'visible' : 'masqué'}.` });
    } catch (error) {
      console.error("Error toggling visibility: ", error);
      toast({ title: "Erreur", description: "Le changement de visibilité a échoué.", variant: "destructive" });
    }
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
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Modifier</span>
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
                <CardTitle className="font-headline text-xl mb-2">{post.title}</CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardContent>
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
