
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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useToast } from "@/hooks/use-toast";
import type { Volunteer } from "@/types/volunteer";
import { Skeleton } from "@/components/ui/skeleton";

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
                // In a real app, you'd likely use user.uid, but we use email for this simulation
                // Assuming the volunteer doc id is the user's email for simplicity. 
                // This is not a good practice for production.
                // A better approach would be to have a 'users' collection linking auth uid to volunteer doc id.
                // For now, let's find the volunteer by email. This is inefficient but works for the demo.
                 const { getDocs, query, collection, where } = await import("firebase/firestore");
                 const q = query(collection(db, "volunteers"), where("email", "==", user.email));
                 const querySnapshot = await getDocs(q);
                 
                 if (!querySnapshot.empty) {
                     const userDoc = querySnapshot.docs[0];
                     setProfile({ id: userDoc.id, ...userDoc.data() } as Volunteer);
                 } else {
                     console.log("No profile found for email:", user.email);
                 }
            }
            setLoading(false);
        };

        if (!authLoading) {
            fetchProfile();
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
        if (!profile) return;
        setIsSaving(true);
        try {
            const profileRef = doc(db, "volunteers", profile.id);
            await updateDoc(profileRef, {
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                phone: profile.phone,
                skills: profile.skills,
                availability: profile.availability
            });
            toast({
                title: "Succès",
                description: "Votre profil a été mis à jour.",
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
                <h1 className="text-3xl font-headline font-bold">Mon Profil</h1>
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
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
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-10 w-1/3" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!profile) {
        return <div>Profil non trouvé. Veuillez contacter un administrateur.</div>;
    }

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
                                    <Input id="firstName" value={profile.firstName} onChange={e => handleFieldChange('firstName', e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">Nom</Label>
                                    <Input id="lastName" value={profile.lastName} onChange={e => handleFieldChange('lastName', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={profile.email} onChange={e => handleFieldChange('email', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input id="phone" type="tel" value={profile.phone} onChange={e => handleFieldChange('phone', e.target.value)} />
                            </div>
                            <Button className="w-fit" onClick={handleSaveChanges} disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Enregistrer les modifications
                            </Button>
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
                                    {profile.skills?.map(skill => (
                                        <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                                            {skill}
                                            <button className="rounded-full hover:bg-muted-foreground/20 p-0.5" onClick={() => handleRemoveSkill(skill)}>
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                 <div className="flex gap-2">
                                    <Input 
                                        placeholder="Ajouter une compétence..." 
                                        value={newSkill}
                                        onChange={e => setNewSkill(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                                    />
                                    <Button onClick={handleAddSkill} variant="outline" size="sm">Ajouter</Button>
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
                            <Button className="w-fit" onClick={handleSaveChanges} disabled={isSaving}>
                                 {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Mettre à jour le profil volontaire
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

