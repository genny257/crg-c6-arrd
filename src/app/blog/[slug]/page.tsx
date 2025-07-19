
"use client";

import * as React from "react";
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { notFound } from "next/navigation";
import { db } from "@/lib/firebase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { BlogPost } from "@/types/blog";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = React.useState<BlogPost | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchPost = async () => {
      if (!params.slug) return notFound();
      setLoading(true);
      try {
        const q = query(
          collection(db, "blogPosts"),
          where("slug", "==", params.slug)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          notFound();
        } else {
          const postData = querySnapshot.docs[0].data() as BlogPost;
           if (!postData.visible) {
             // In a real app, you might check for admin role here to allow preview
             notFound();
           }
          setPost(postData);
        }
      } catch (error) {
        console.error("Error fetching post: ", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'article.",
          variant: "destructive",
        });
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.slug, toast]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/4 mb-8" />
        <Skeleton className="aspect-video w-full rounded-lg mb-8" />
        <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    return notFound();
  }

  return (
    <article className="max-w-4xl mx-auto">
        <div className="mb-8">
             <Button asChild variant="outline" size="sm">
                <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour au blog
                </Link>
            </Button>
        </div>
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">
          {post.title}
        </h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </header>

      <Image
        src={post.image || "https://placehold.co/1200x600.png"}
        alt={post.title}
        width={1200}
        height={600}
        className="w-full h-auto rounded-lg object-cover aspect-video mb-8"
        priority
      />

      <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-headline prose-headings:text-primary">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}

    