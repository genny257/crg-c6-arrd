
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Network, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Volunteer } from "@/types/volunteer";
import { Skeleton } from "@/components/ui/skeleton";

type Member = {
    name: string;
    role: string;
    avatar: string;
    hint: string;
};

const president: Member = {
    name: "Jean-Pierre Nkoume",
    role: "Président du Comité",
    avatar: "https://placehold.co/100x100.png",
    hint: "male portrait"
};

const vicePresident: Member = {
    name: "Aïcha Bongo",
    role: "Vice-Présidente",
    avatar: "https://placehold.co/100x100.png",
    hint: "female portrait"
};

const secretariat: Member[] = [
    { name: "Yves Moukagni", role: "Secrétaire Général", avatar: "https://placehold.co/100x100.png", hint: "male portrait" },
    { name: "Nadège Mboumba", role: "Secrétaire Adjointe", avatar: "https://placehold.co/100x100.png", hint: "female portrait" },
];

const treasury: Member[] = [
    { name: "Martin Okouyi", role: "Trésorier Général", avatar: "https://placehold.co/100x100.png", hint: "male portrait" },
    { name: "Fatima Diallo", role: "Trésorière Adjointe", avatar: "https://placehold.co/100x100.png", hint: "female portrait" },
];

const coordinators: Member[] = [
    { name: "Paul Abessolo", role: "Urgences & Secourisme", avatar: "https://placehold.co/80x80.png", hint: "male portrait" },
    { name: "Sophie Mavoungou", role: "Santé & Action Sociale", avatar: "https://placehold.co/80x80.png", hint: "female portrait" },
    { name: "Chantal Lendoye", role: "Formation & Développement", avatar: "https://placehold.co/80x80.png", hint: "female portrait" },
    { name: "Gaston Bouanga", role: "Jeunesse", avatar: "https://placehold.co/80x80.png", hint: "male portrait" },
    { name: "Alice Kengue", role: "Logistique & Communication", avatar: "https://placehold.co/80x80.png", hint: "female portrait" },
    { name: "Marc Tonda", role: "Gestion & Administration", avatar: "https://placehold.co/80x80.png", hint: "male portrait" },
];

const MemberCard = ({ member, size = 'default' }: { member: Member, size?: 'default' | 'small' }) => (
    <div className="flex flex-col items-center text-center">
        <Avatar className={size === 'default' ? "h-24 w-24 mb-2" : "h-16 w-16 mb-2"}>
            <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.hint} />
            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <p className="font-bold">{member.name}</p>
        <p className="text-sm text-muted-foreground">{member.role}</p>
    </div>
);

const VolunteerCard = ({ volunteer }: { volunteer: Volunteer }) => (
    <div className="flex flex-col items-center text-center">
        <Avatar className={"h-16 w-16 mb-2"}>
            <AvatarFallback>{volunteer.firstName?.[0]}{volunteer.lastName?.[0]}</AvatarFallback>
        </Avatar>
        <p className="font-semibold text-sm">{volunteer.firstName} {volunteer.lastName}</p>
    </div>
)

export default function TeamPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchVolunteers = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "volunteers"), where("status", "==", "Actif"));
                const querySnapshot = await getDocs(q);
                const volunteersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Volunteer));
                setVolunteers(volunteersData);
            } catch (error) {
                console.error("Error fetching active volunteers: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVolunteers();
    }, []);

    if (authLoading || !user) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-headline font-bold flex items-center gap-2">
                <Network className="w-8 h-8 text-primary"/>
                Organigramme du Comité
            </h1>
            <p className="text-muted-foreground -mt-6">Comité du Sixième Arrondissement de Libreville</p>

            <div className="space-y-12 flex flex-col items-center">
                {/* President */}
                <MemberCard member={president} />

                {/* Vice President */}
                <div className="flex justify-center w-full">
                    <div className="relative">
                        <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-border -translate-y-full"></div>
                        <MemberCard member={vicePresident} />
                    </div>
                </div>

                <Separator />

                {/* Secretariat & Treasury */}
                <div className="w-full grid md:grid-cols-2 gap-12">
                     <div className="flex justify-center">
                        <div className="relative grid grid-cols-2 gap-8">
                             <div className="absolute -top-8 left-1/4 w-3/4 h-0.5 bg-border"></div>
                             <div className="absolute -top-8 left-1/4 w-0.5 h-8 bg-border"></div>
                             <div className="absolute -top-8 right-1/4 w-0.5 h-8 bg-border"></div>
                             <div className="absolute -top-16 left-1/2 w-0.5 h-8 bg-border"></div>
                            {secretariat.map(member => <MemberCard key={member.name} member={member} />)}
                        </div>
                    </div>
                     <div className="flex justify-center">
                        <div className="relative grid grid-cols-2 gap-8">
                            <div className="absolute -top-8 left-1/4 w-3/4 h-0.5 bg-border"></div>
                             <div className="absolute -top-8 left-1/4 w-0.5 h-8 bg-border"></div>
                             <div className="absolute -top-8 right-1/4 w-0.5 h-8 bg-border"></div>
                             <div className="absolute -top-16 left-1/2 w-0.5 h-8 bg-border"></div>
                           {treasury.map(member => <MemberCard key={member.name} member={member} />)}
                        </div>
                    </div>
                </div>
                
                <Separator />

                {/* Coordinators */}
                <Card className="w-full max-w-5xl">
                    <CardHeader>
                        <CardTitle className="text-center font-headline text-xl">Coordinateurs des Cellules</CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-border"></div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-8">
                            {coordinators.map(member => <MemberCard key={member.name} member={member} size="small" />)}
                        </div>
                    </CardContent>
                </Card>

                 <Separator />

                {/* Active Volunteers */}
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-center font-headline text-xl flex items-center justify-center gap-2">
                           <Users className="w-6 h-6"/> Nos Volontaires Actifs
                        </CardTitle>
                        <CardDescription className="text-center">La force vive de notre comité.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-6">
                                {Array.from({ length: 16 }).map((_, i) => (
                                    <div key={i} className="flex flex-col items-center text-center">
                                        <Skeleton className="h-16 w-16 mb-2 rounded-full" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-6">
                                {volunteers.map(volunteer => (
                                    <VolunteerCard key={volunteer.id} volunteer={volunteer} />
                                ))}
                            </div>
                        )}
                         {!loading && volunteers.length === 0 && (
                            <p className="text-center text-muted-foreground">Aucun volontaire actif pour le moment.</p>
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
