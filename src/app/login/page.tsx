
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth, UserRole } from "@/hooks/use-auth"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = React.useState("user@example.com");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let role: UserRole = 'user';
    let name = 'Utilisateur';

    if (email === 'admin@example.com') {
      role = 'admin';
      name = 'Admin';
    } else if (email === 'superadmin@example.com') {
      role = 'superadmin';
      name = 'Super Admin';
    }

    login({ name: name, role, email: email });
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="mx-auto max-w-sm w-full relative">
        <Link href="/" className="absolute top-4 left-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Retour à l'accueil</span>
        </Link>
        <CardHeader>
          <div className="flex flex-col items-center justify-center mb-4 pt-8">
            <Link href="/" className="flex items-center justify-center">
              <Image src="/logo.png" alt="Croix-Rouge Gabonaise Logo" width={64} height={64} />
            </Link>
            <span className="mt-2 font-bold text-center">Croix-Rouge Gabonaise</span>
          </div>
          <CardTitle className="text-2xl font-headline text-center">Connexion</CardTitle>
          <CardDescription className="text-center">
            Accédez à votre espace ou inscrivez-vous
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nom@exemple.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
               <p className="text-xs text-muted-foreground pt-1">
                Utilisez <code className="font-mono bg-muted p-1 rounded">admin@example.com</code> ou <code className="font-mono bg-muted p-1 rounded">superadmin@example.com</code> pour tester les différents rôles.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mot de passe</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input id="password" type="password" required defaultValue="password" />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Se connecter
            </Button>
            <Button variant="outline" className="w-full">
              Se connecter avec Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Pas encore de compte ?{" "}
            <Link href="/register" className="underline">
              S'inscrire
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
