
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { Volunteer } from "@/types/volunteer";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Edit, Mail, Phone, MapPin, BadgeInfo, GraduationCap, Briefcase, Heart, CheckCircle, Clock, Shield, Sparkles, Calendar, User, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateDocx } from "@/lib/docx-generator";
import { useAuth } from "@/hooks/use-auth";

const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
        case 'Actif': return 'default';
        case 'En attente': return 'secondary';
        case 'Inactif': return 'outline';
        case 'Rejeté': return 'destructive';
        default: return 'secondary';
    }
};

export default function VolunteerProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const { token } = useAuth();
    const [volunteer, setVolunteer] = React.useState<Volunteer | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchVolunteer = async () => {
            if (typeof id !== 'string' || !token) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/volunteers/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error('Volunteer not found');
                }
                const volunteerData = await response.json();
                
                if (volunteerData) {
                     setVolunteer(volunteerData);
                } else {
                     toast({ title: "Erreur", description: "Volontaire non trouvé.", variant: "destructive" });
                     router.push('/dashboard/volunteers');
                }

            } catch (error) {
                console.error("Error fetching volunteer: ", error);
                toast({ title: "Erreur", description: "Impossible de charger le profil du volontaire.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchVolunteer();
        }
    }, [id, router, toast, token]);
    
    const handleExport = () => {
        if (volunteer) {
            generateDocx(volunteer);
        }
    };


    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48" />
                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-1">
                        <CardContent className="pt-6 flex flex-col items-center gap-4">
                            <Skeleton className="h-32 w-32 rounded-full" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-8 w-24 rounded-full" />
                        </CardContent>
                    </Card>
                    <div className="lg:col-span-2 space-y-6">
                         <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
                         <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
                    </div>
                </div>
            </div>
        )
    }

    if (!volunteer) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                 <Button asChild variant="outline" size="icon">
                    <Link href="/dashboard/volunteers">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold font-headline flex-1 truncate">
                    Profil de {volunteer.firstName} {volunteer.lastName}
                </h1>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                    </Button>
                     <Button onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Exporter la fiche
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Profile Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                            <Avatar className="h-32 w-32 mb-4 border-4 border-primary/20">
                                <AvatarImage src={volunteer.photo} alt={`${volunteer.firstName} ${volunteer.lastName}`} />
                                <AvatarFallback className="text-4xl">
                                    {volunteer.firstName?.[0]}{volunteer.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-bold font-headline">{volunteer.firstName} {volunteer.lastName}</h2>
                            <p className="text-muted-foreground">{volunteer.profession || "Non spécifié"}</p>
                            <Badge variant={getStatusBadgeVariant(volunteer.status)} className="mt-2">{volunteer.status}</Badge>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle className="text-lg font-headline flex items-center gap-2"><User className="h-5 w-5 text-primary" />Identité</CardTitle></CardHeader>
                        <CardContent className="space-y-3 text-sm">
                           <div className="flex items-center gap-2">
                                <BadgeInfo className="h-4 w-4 text-muted-foreground"/>
                                <strong>Matricule :</strong> {volunteer.matricule || 'N/A'}
                            </div>
                             <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground"/>
                                <strong>Né(e) le :</strong> {volunteer.birthDate ? new Date(volunteer.birthDate).toLocaleDateString('fr-FR') : 'N/A'}
                            </div>
                             <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground"/>
                                <strong>À :</strong> {volunteer.birthPlace || 'N/A'}
                            </div>
                             <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground"/>
                                <strong>Pièce :</strong> {volunteer.idCardNumber || 'N/A'}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="text-lg font-headline flex items-center gap-2"><Mail className="h-5 w-5 text-primary" />Coordonnées</CardTitle></CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground"/><span>{volunteer.phone}</span></div>
                            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground"/><span>{volunteer.email}</span></div>
                            <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-muted-foreground mt-1"/><span>{volunteer.address}</span></div>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Right Column - Detailed Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle className="text-lg font-headline flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />Profil Volontaire</CardTitle></CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                             <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2"><GraduationCap className="h-4 w-4 text-muted-foreground"/> Niveau d&apos;études</h4>
                                <p>{volunteer.educationLevel || "Non spécifié"}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2"><Briefcase className="h-4 w-4 text-muted-foreground"/> Profession</h4>
                                <p>{volunteer.profession || "Non spécifié"}</p>
                            </div>
                            <div className="md:col-span-2">
                                <h4 className="font-semibold mb-2 flex items-center gap-2"><Heart className="h-4 w-4 text-muted-foreground"/> Domaines d&apos;intérêt</h4>
                                {volunteer.causes?.length ? (
                                    <div className="flex flex-wrap gap-2">
                                        {volunteer.causes.map(cause => <Badge key={cause} variant="secondary">{cause}</Badge>)}
                                    </div>
                                ) : <p>Non spécifié</p>}
                            </div>
                             <div className="md:col-span-2">
                                <h4 className="font-semibold mb-2 flex items-center gap-2"><Shield className="h-4 w-4 text-muted-foreground"/> Cellule souhaitée</h4>
                                {volunteer.assignedCell ? <Badge>{volunteer.assignedCell}</Badge> : <p>Non spécifiée</p>}
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle className="text-lg font-headline flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />Compétences & Disponibilité</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Compétences</h4>
                                {volunteer.skills?.length ? (
                                    <div className="flex flex-wrap gap-2">
                                        {volunteer.skills.map(skill => <Badge key={skill} variant="outline">{skill}</Badge>)}
                                    </div>
                                ) : <p className="text-sm text-muted-foreground">Aucune compétence spécifiée</p>}
                            </div>
                             <div>
                                <h4 className="font-semibold mb-2">Disponibilité</h4>
                                 {volunteer.availability?.length ? (
                                    <div className="flex flex-wrap gap-2">
                                        {volunteer.availability.map(item => <Badge key={item} variant="outline">{item}</Badge>)}
                                    </div>
                                ) : <p className="text-sm text-muted-foreground">Aucune disponibilité spécifiée</p>}
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Expérience de volontariat</h4>
                                <p className="text-sm text-muted-foreground italic">{volunteer.volunteerExperience || "Aucune expérience antérieure déclarée."}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
