
"use client"

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import type { Volunteer } from "@/types/volunteer";
import { Skeleton } from "@/components/ui/skeleton";

// Mock Data
const mockProfile: Volunteer = {
    id: 'user1',
    firstName: "Jean",
    lastName: "Volontaire",
    email: "user@example.com",
    phone: "061234567",
    skills: ["Secourisme", "Logistique"],
    availability: ["Week-end"],
    status: 'Actif',
    profession: 'Comptable',
    address: '123 Rue de la Paix',
    birthDate: '1990-01-15T00:00:00Z',
    createdAt: '2023-01-10T00:00:00Z',
    termsAccepted: true,
};

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const [profile, setProfile] = React.useState<Volunteer | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);
    const [newSkill, setNewSkill] = React.useState("");

    React.useEffect(() => {
        const fetchProfile = async () => {
            if (user?.email) {
                 // TODO: Replace with API call to /api/volunteers/me or /api/volunteers?email={user.email}
                 setProfile(mockProfile);
            }
            setLoading(false);
        };

        if (!authLoading && user) {
            fetchProfile();
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }, [user, authLoading]);

    const handleFieldChange = (field: keyof Volunteer, value: any) => {
        if (profile) {
            setProfile({ ...profile, [field]: value });
        }
    };
    
    const handleAddSkill = () => {
        if (newSkill && profile && !profile.skills?.includes(newSkill)) {
            const updatedSkills = [...(profile.skills || []), newSkill];
            handleFieldChange('skills', updatedSkills);
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        if (profile) {
            const updatedSkills = profile.skills?.filter(skill => skill !== skillToRemove);
            handleFieldChange('skills', updatedSkills);
        }
    };

    const handleAvailabilityChange = (day: string, checked: boolean) => {
        if(profile) {
            const currentAvailability = profile.availability || [];
            const newAvailability = checked
                ? [...currentAvailability, day]
                : currentAvailability.filter(d => d !== day);
            handleFieldChange('availability', newAvailability);
        }
    };

    const handleSaveChanges = async () => {
        if (!profile?.id) return;
        setIsSaving(true);
        try {
            // TODO: Replace with API call to PUT /api/volunteers/{id}
            console.log("Saving profile data:", profile);
            toast({
                title: "Succès",
                description: "Votre profil a été mis à jour (simulation).",
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                title: "Erreur",
                description: "La mise à jour de votre profil a échoué.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };


    if (authLoading || loading) {
        return (
             <div className="flex flex-col gap-8">
                <Skeleton className="h-8 w-48" />
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-1/4" />
                            </CardContent>
                        </Card>
                    </div>
                     <div className="md:col-span-1">
                        <Card>
                            <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!profile) {
        return <Card><CardHeader><CardTitle>Profil non trouvé</CardTitle><CardDescription>Impossible de charger les informations de votre profil. Veuillez contacter un administrateur.</CardDescription></CardHeader></Card>;
    }

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-headline font-bold">Mon Profil</h1>
            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations Personnelles</CardTitle>
                            <CardDescription>Mettez à jour vos informations de contact. Certaines informations ne peuvent être modifiées que par un administrateur.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="firstName">Prénom</Label>
                                    <Input id="firstName" value={profile.firstName} readOnly disabled />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">Nom</Label>
                                    <Input id="lastName" value={profile.lastName} readOnly disabled />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={profile.email} readOnly disabled />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input id="phone" type="tel" value={profile.phone} onChange={e => handleFieldChange('phone', e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1 row-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profil Volontaire</CardTitle>
                            <CardDescription>Gérez vos compétences et disponibilités.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-2">
                                <Label>Compétences</Label>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills?.map(skill => (
                                        <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                                            {skill}
                                            <button className="rounded-full hover:bg-muted-foreground/20 p-0.5" onClick={() => handleRemoveSkill(skill)}>
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                    {profile.skills?.length === 0 && <p className="text-xs text-muted-foreground">Aucune compétence ajoutée.</p>}
                                </div>
                                 <div className="flex gap-2">
                                    <Input 
                                        placeholder="Ajouter une compétence..." 
                                        value={newSkill}
                                        onChange={e => setNewSkill(e.target.value)}
                                        onKeyDown={e => {if(e.key === 'Enter'){ e.preventDefault(); handleAddSkill();}}}
                                    />
                                    <Button onClick={(e) => {e.preventDefault(); handleAddSkill()}} variant="outline" size="sm">Ajouter</Button>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Disponibilités</Label>
                                <div className="grid gap-2">
                                    {["Jour (semaine)", "Soir (semaine)", "Week-end", "Missions longues"].map(day => (
                                        <div key={day} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={day} 
                                                checked={profile.availability?.includes(day)}
                                                onCheckedChange={(checked) => handleAvailabilityChange(day, !!checked)}
                                            />
                                            <label htmlFor={day} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {day}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                 <div className="md:col-span-2 flex justify-end">
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Enregistrer les modifications
                    </Button>
                </div>
            </div>
        </div>
    );
}
