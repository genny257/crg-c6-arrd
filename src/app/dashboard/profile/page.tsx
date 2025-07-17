import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function ProfilePage() {
    const skills = ["Premiers secours", "Logistique", "Conduite", "Communication"];
    
    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-headline font-bold">Mon Profil</h1>
            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations Personnelles</CardTitle>
                            <CardDescription>Mettez à jour vos informations de contact.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="firstName">Prénom</Label>
                                    <Input id="firstName" defaultValue="Admin" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">Nom</Label>
                                    <Input id="lastName" defaultValue="User" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue="admin@example.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input id="phone" type="tel" defaultValue="+241 01 23 45 67" />
                            </div>
                            <Button className="w-fit">Enregistrer les modifications</Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profil Volontaire</CardTitle>
                            <CardDescription>Gérez vos compétences et disponibilités.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-2">
                                <Label>Compétences</Label>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map(skill => (
                                        <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                                            {skill}
                                            <button className="rounded-full hover:bg-muted-foreground/20 p-0.5">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                <Input placeholder="Ajouter une nouvelle compétence..." />
                            </div>
                            <div className="grid gap-2">
                                <Label>Disponibilités</Label>
                                <div className="grid gap-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="lundi" />
                                        <label htmlFor="lundi" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Lundi</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="mardi" />
                                        <label htmlFor="mardi" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Mardi</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="mercredi" defaultChecked />
                                        <label htmlFor="mercredi" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Mercredi</label>
                                    </div>
                                    {/* ... other days */}
                                </div>
                            </div>
                            <Button className="w-fit">Mettre à jour le profil volontaire</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
