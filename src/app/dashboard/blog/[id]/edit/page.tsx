
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/hooks/use-auth";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost } from "@/types/blog";
import { generateBlogPost } from "@/ai/flows/generate-blog-post-flow";
import { Label } from "@/components/ui/label";

const blogPostSchema = z.object({
  title: z.string().min(1, "Le titre est requis."),
  excerpt: z.string().min(1, "L'extrait est requis."),
  slug: z.string().min(1, "Le slug est requis.").regex(/^[a-z0-9-]+$/, "Le slug ne peut contenir que des lettres minuscules, des chiffres et des tirets."),
  content: z.string().optional(),
  image: z.string().url("L'URL de l'image n'est pas valide.").optional().or(z.literal('')),
  imageHint: z.string().optional(),
  visible: z.boolean().default(true),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [pageLoading, setPageLoading] = React.useState(true);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationTopic, setGenerationTopic] = React.useState("");

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
  });

  React.useEffect(() => {
    if (typeof id !== 'string') return;
    const fetchPost = async () => {
        setPageLoading(true);
        const postRef = doc(db, "blogPosts", id);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
            const postData = postSnap.data() as BlogPost;
            form.reset(postData);
            setGenerationTopic(postData.title);
        } else {
            toast({ title: "Erreur", description: "Article non trouvé.", variant: "destructive" });
            router.push('/blog');
        }
        setPageLoading(false);
    };
    fetchPost();
  }, [id, form, router, toast]);
  
  const handleGenerateContent = async () => {
    if (!generationTopic) {
      toast({ title: "Sujet manquant", description: "Veuillez entrer un sujet pour la génération.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateBlogPost(generationTopic);
      form.setValue("title", result.title);
      form.setValue("slug", result.slug);
      form.setValue("excerpt", result.excerpt);
      form.setValue("content", result.content);
      toast({ title: "Contenu généré !", description: "Les champs ont été remplis avec la suggestion de l'IA." });
    } catch (error) {
      console.error("Error generating blog post:", error);
      toast({ title: "Erreur de génération", description: "Impossible de générer le contenu.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };


  const onSubmit = async (data: BlogPostFormValues) => {
    if(typeof id !== 'string') return;
    setIsSubmitting(true);
    try {
      const postRef = doc(db, "blogPosts", id);
      await updateDoc(postRef, data);
      toast({
        title: "Article modifié",
        description: "L'article a été mis à jour avec succès.",
      });
      router.push(`/blog`);
    } catch (error) {
      console.error("Error updating blog post: ", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification de l'article.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (authLoading) return <div>Chargement...</div>;
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
     router.push('/login');
     return null;
  }

  if (pageLoading) {
      return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-8 w-1/3" />
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-32" />
                </CardContent>
            </Card>
          </div>
      )
  }

  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
             <Button asChild variant="outline" size="icon">
                <Link href="/blog">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </Button>
            <h1 className="text-3xl font-headline font-bold">Modifier l'Article</h1>
        </div>
      
        <Card>
            <CardHeader>
                <CardTitle>Détails de l'article</CardTitle>
                <CardDescription>Mettez à jour les informations de l'article ci-dessous. Vous pouvez utiliser l'IA pour vous aider.</CardDescription>
            </CardHeader>
            <CardContent>
             <div className="space-y-2 mb-6 p-4 border bg-muted/50 rounded-lg">
                <Label htmlFor="generation-topic">Sujet pour l'IA</Label>
                <div className="flex gap-2">
                  <Input
                    id="generation-topic"
                    placeholder="Ex: L'importance du secourisme en milieu scolaire"
                    value={generationTopic}
                    onChange={(e) => setGenerationTopic(e.target.value)}
                    disabled={isGenerating}
                  />
                  <Button onClick={handleGenerateContent} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Générer
                  </Button>
                </div>
              </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Titre</FormLabel>
                        <FormControl>
                        <Input placeholder="Titre de l'article" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                        <Input placeholder="titre-de-l-article-sans-espaces" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Extrait</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Un court résumé de l'article visible sur la page du blog." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contenu complet (Markdown)</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Le contenu complet de l'article, vous pouvez utiliser la syntaxe Markdown." rows={10} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>URL de l'image de couverture</FormLabel>
                        <FormControl>
                        <Input type="url" placeholder="https://exemple.com/image.png" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="imageHint"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Indice pour l'image (IA)</FormLabel>
                        <FormControl>
                        <Input placeholder="Ex: 'aide humanitaire'" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="visible"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Visibilité</FormLabel>
                         <p className="text-sm text-muted-foreground">
                            Rendre cet article visible publiquement.
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting || isGenerating}>
                    {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
    </div>
  );
}
