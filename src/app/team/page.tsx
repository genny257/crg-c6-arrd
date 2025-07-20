
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Network, Users, Briefcase, Search, ArrowDownUp } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Volunteer } from "@/types/volunteer";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Member = {
    name: string;
    role: string;
    avatar: string;
    hint: string;
};

type Pool = {
    name: string;
    mission: string;
    coordinator: Member;
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

const focalPoints: Member[] = [
    { name: "Marc Ona Essang", role: "Point Focal 1", avatar: "https://placehold.co/100x100.png", hint: "male portrait" },
    { name: "Juliette Bivigou", role: "Point Focal 2", avatar: "https://placehold.co/100x100.png", hint: "female portrait" },
];

const secretariat: Member[] = [
    { name: "Yves Moukagni", role: "Secrétaire Général", avatar: "https://placehold.co/100x100.png", hint: "male portrait" },
    { name: "Nadège Mboumba", role: "Secrétaire Adjointe", avatar: "https://placehold.co/100x100.png", hint: "female portrait" },
];

const treasury: Member[] = [
    { name: "Martin Okouyi", role: "Trésorier Général", avatar: "https://placehold.co/100x100.png", hint: "male portrait" },
    { name: "Fatima Diallo", role: "Trésorière Adjointe", avatar: "https://placehold.co/100x100.png", hint: "female portrait" },
];

const coordinators: Member[] = [
    { name: "Paul Abessolo", role: "Nzeng-Ayong Lac", avatar: "https://placehold.co/80x80.png", hint: "male portrait" },
    { name: "Sophie Mavoungou", role: "Nzeng-Ayong Village", avatar: "https://placehold.co/80x80.png", hint: "female portrait" },
    { name: "Chantal Lendoye", role: "Ondogo", avatar: "https://placehold.co/80x80.png", hint: "female portrait" },
    { name: "Gaston Bouanga", role: "PK6-PK9", avatar: "https://placehold.co/80x80.png", hint: "male portrait" },
    { name: "Alice Kengue", role: "PK9-Bikélé", avatar: "https://placehold.co/80x80.png", hint: "female portrait" },
];

const allCells = coordinators.map(c => c.role);

const pools: Pool[] = [
  { name: "Secrétariat", mission: "Gestion administrative et coordination.", coordinator: { name: "Hélène Obiang", role: "Coordinatrice", avatar: "https://placehold.co/80x80.png", hint: "female portrait"} },
  { name: "Logistique", mission: "Gestion du matériel et des ressources.", coordinator: { name: "Christian N'Goma", role: "Coordinateur", avatar: "https://placehold.co/80x80.png", hint: "male portrait"} },
  { name: "Trésorerie", mission: "Gestion financière.", coordinator: { name: "Sylvie Mbadu", role: "Coordinatrice", avatar: "https://placehold.co/80x80.png", hint: "female portrait"} },
  { name: "Santé", mission: "Promotion de la santé communautaire.", coordinator: { name: "Dr. Moussa Traoré", role: "Coordinateur", avatar: "https://placehold.co/80x80.png", hint: "male portrait"} },
  { name: "Jeunesse et Volontariat", mission: "Mobilisation des jeunes et des volontaires.", coordinator: { name: "Kevin Essono", role: "Coordinateur", avatar: "https://placehold.co/80x80.png", hint: "male portrait"} },
  { name: "Étude de Projet", mission: "Conception et évaluation des projets.", coordinator: { name: "Carine Ibinga", role: "Coordinatrice", avatar: "https://placehold.co/80x80.png", hint: "female portrait"} },
  { name: "Secours", mission: "Interventions d'urgence.", coordinator: { name: "Gérard Lema", role: "Coordinateur", avatar: "https://placehold.co/80x80.png", hint: "male portrait"} },
  { name: "Action Sociale", mission: "Soutien aux populations vulnérables.", coordinator: { name: "Estelle Koumba", role: "Coordinatrice", avatar: "https://placehold.co/80x80.png", hint: "female portrait"} },
  { name: "Assainissement et Hygiène", mission: "Promotion de l'hygiène.", coordinator: { name: "Thierry Ndong", role: "Coordinateur", avatar: "https://placehold.co/80x80.png", hint: "male portrait"} },
  { name: "Discipline", mission: "Renforcement de l'organisation interne.", coordinator: { name: "Serge Moussavou", role: "Coordinateur", avatar: "https://placehold.co/80x80.png", hint: "male portrait"} },
  { name: "Formation", mission: "Développement des compétences.", coordinator: { name: "Nathalie Ngouma", role: "Coordinatrice", avatar: "https://placehold.co/80x80.png", hint: "female portrait"} },
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
             <AvatarImage src={volunteer.photo} alt={`${volunteer.firstName} ${volunteer.lastName}`} />
            <AvatarFallback>{volunteer.firstName?.[0]}{volunteer.lastName?.[0]}</AvatarFallback>
        </Avatar>
        <p className="font-semibold text-sm">{volunteer.firstName} {volunteer.lastName}</p>
    </div>
);

const PoolCard = ({ pool }: { pool: Pool }) => (
    <Card className="flex flex-col">
        <CardHeader>
            <CardTitle className="text-base font-headline flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                {pool.name}
            </CardTitle>
            <Separator />
            <div className="flex items-center gap-3 pt-2">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={pool.coordinator.avatar} alt={pool.coordinator.name} data-ai-hint={pool.coordinator.hint} />
                    <AvatarFallback>{pool.coordinator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-sm">{pool.coordinator.name}</p>
                    <p className="text-xs text-muted-foreground">{pool.coordinator.role}</p>
                </div>
            </div>
        </CardHeader>
        <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground">{pool.mission}</p>
        </CardContent>
    </Card>
);

export default function TeamPage() {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [cellFilter, setCellFilter] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'date'; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });
    
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

    const filteredAndSortedVolunteers = useMemo(() => {
        let sortedVolunteers = [...volunteers];
        
        if (cellFilter) {
            sortedVolunteers = sortedVolunteers.filter(v => v.assignedCell === cellFilter);
        }

        if (searchTerm) {
            sortedVolunteers = sortedVolunteers.filter(v =>
                `${v.firstName} ${v.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        sortedVolunteers.sort((a, b) => {
            if (sortConfig.key === 'name') {
                const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
                const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
                if (nameA < nameB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (nameA > nameB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            } else { // sort by date
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            }
        });

        return sortedVolunteers;
    }, [volunteers, searchTerm, sortConfig, cellFilter]);

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

                {/* Focal Points */}
                <div className="w-full flex justify-center">
                    <div className="relative grid grid-cols-2 gap-8">
                        <div className="absolute -top-8 left-1/4 w-3/4 h-0.5 bg-border"></div>
                        <div className="absolute -top-8 left-1/4 w-0.5 h-8 bg-border"></div>
                        <div className="absolute -top-8 right-1/4 w-0.5 h-8 bg-border"></div>
                        <div className="absolute -top-16 left-1/2 w-0.5 h-8 bg-border"></div>
                        {focalPoints.map(member => <MemberCard key={member.name} member={member} />)}
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
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8">
                            {coordinators.map(member => <MemberCard key={member.name} member={member} size="small" />)}
                        </div>
                    </CardContent>
                </Card>

                 <Separator />

                {/* Pools */}
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-center font-headline text-xl flex items-center justify-center gap-2">
                           <Briefcase className="w-6 h-6"/> Nos Pools
                        </CardTitle>
                        <CardDescription className="text-center">Les pôles de compétences du comité et leurs coordinateurs.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pools.map(pool => <PoolCard key={pool.name} pool={pool} />)}
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
                        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
                            <div className="relative w-full lg:col-span-2">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Rechercher par nom..." 
                                    className="pl-8 w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Select onValueChange={(value) => setCellFilter(value === 'all' ? null : value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filtrer par cellule" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes les cellules</SelectItem>
                                        {allCells.map(cell => (
                                            <SelectItem key={cell} value={cell}>{cell}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full">
                                            <ArrowDownUp className="mr-2 h-4 w-4" />
                                            Trier par
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setSortConfig({ key: 'date', direction: 'desc' })}>Plus récent</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSortConfig({ key: 'date', direction: 'asc' })}>Plus ancien</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSortConfig({ key: 'name', direction: 'asc' })}>Nom (A-Z)</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSortConfig({ key: 'name', direction: 'desc' })}>Nom (Z-A)</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
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
                                {filteredAndSortedVolunteers.map(volunteer => (
                                    <VolunteerCard key={volunteer.id} volunteer={volunteer} />
                                ))}
                            </div>
                        )}
                         {!loading && filteredAndSortedVolunteers.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                                {searchTerm || cellFilter ? "Aucun volontaire ne correspond à votre recherche." : "Aucun volontaire actif pour le moment."}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
