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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = React.useState<UserRole>('user');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ name: 'Utilisateur Simulé', role });
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
          <div className="flex justify-center mb-4 pt-8">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 40C15.16 40 8 32.84 8 24C8 15.16 15.16 8 24 8C32.84 8 40 15.16 40 24C40 32.84 32.84 40 24 40ZM26 22V12H22V22H12V26H22V36H26V26H36V22H26Z"
                fill="currentColor"
              />
            </svg>
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
                defaultValue="test@example.com"
              />
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

            <div className="grid gap-2">
                <Label>Simuler le rôle :</Label>
                 <RadioGroup defaultValue="user" onValueChange={(value: UserRole) => setRole(value)} className="grid grid-cols-3 gap-4">
                    <div>
                        <RadioGroupItem value="user" id="role-user" className="sr-only" />
                        <Label htmlFor="role-user" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">Utilisateur</Label>
                    </div>
                    <div>
                        <RadioGroupItem value="admin" id="role-admin" className="sr-only" />
                        <Label htmlFor="role-admin" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">Admin</Label>
                    </div>
                    <div>
                        <RadioGroupItem value="superadmin" id="role-superadmin" className="sr-only" />
                        <Label htmlFor="role-superadmin" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">Super Admin</Label>
                    </div>
                </RadioGroup>
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
