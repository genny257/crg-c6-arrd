
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { addDoc, collection } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";

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

export default function NewBlogPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      slug: "",
      content: "",
      image: "",
      imageHint: "",
      visible: true,
    },
  });

  const onSubmit = async (data: BlogPostFormValues) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "blogPosts"), {
        ...data,
        date: new Date().toISOString(),
      });
      toast({
        title: "Article créé",
        description: "Le nouvel article de blog a été ajouté avec succès.",
      });
      router.push("/blog");
    } catch (error) {
      console.error("Error creating blog post: ", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'article.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return <div>Chargement...</div>
  }
  
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
     router.push('/login');
     return null;
  }

  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
             <Button asChild variant="outline" size="icon">
                <Link href="/blog">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </Button>
            <h1 className="text-3xl font-headline font-bold">Nouvel Article de Blog</h1>
        </div>
      
        <Card>
            <CardHeader>
                <CardTitle>Rédiger un nouvel article</CardTitle>
                <CardDescription>Remplissez les champs ci-dessous pour publier un nouvel article.</CardDescription>
            </CardHeader>
            <CardContent>
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
                            Rendre cet article visible publiquement dès sa création.
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

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Publication..." : "Publier l'article"}
                </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
    </div>
  );
}
