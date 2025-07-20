
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Network, Users, Briefcase, Search, ArrowDownUp, Archive, Truck, Banknote, HeartPulse, LifeBuoy, HandHeart, Droplets, Shield, GraduationCap, ClipboardCheck, Siren, Soup } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Volunteer } from "@/types/volunteer";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Icon } from "lucide-react";
import { professionsList, skillsList as allSkillsGroups } from "@/lib/locations";

type Member = {
    name: string;
    role: string;
    avatar: string;
    hint: string;
};

type Pool = {
    name: string;
    mission: string;
    coordinators: Member[];
    icon: Icon;
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

const coordinators: Member[] = [
    { name: "Paul Abessolo", role: "Nzeng-Ayong Lac", avatar: "https://placehold.co/80x80.png", hint: "male portrait" },
    { name: "Sophie Mavoungou", role: "Nzeng-Ayong Village", avatar: "https://placehold.co/80x80.png", hint: "female portrait" },
    { name: "Chantal Lendoye", role: "Ondogo", avatar: "https://placehold.co/80x80.png", hint: "female portrait" },
    { name: "Gaston Bouanga", role: "PK6-PK9", avatar: "https://placehold.co/80x80.png", hint: "male portrait" },
    { name: "Alice Kengue", role: "PK9-Bikélé", avatar: "https://placehold.co/80x80.png", hint: "female portrait" },
];

const allCells = coordinators.map(c => c.role);

const pools: Pool[] = [
  { name: "Secrétariat", mission: "Gestion administrative et coordination.", coordinators: [{ name: "Yves Moukagni", role: "Secrétaire Général", avatar: "https://placehold.co/80x80.png", hint: "male portrait"}, { name: "Nadège Mboumba", role: "Secrétaire Adjointe", avatar: "https://placehold.co/80x80.png", hint: "female portrait" }], icon: Archive },
  { name: "Trésorerie", mission: "Gestion financière.", coordinators: [{ name: "Martin Okouyi", role: "Trésorier Général", avatar: "https://placehold.co/80x80.png", hint: "male portrait" }, { name: "Fatima Diallo", role: "Trésorière Adjointe", avatar: "https://placehold.co/80x80.png", hint: "female portrait" }], icon: Banknote },
  { name: "Logistique", mission: "Gestion du matériel et des ressources.", coordinators: [{ name: "Christian N'Goma", role: "Coordinateur", avatar: "https://placehold.co/80x80.png", hint: "male portrait"}], icon: Truck },
  { name: "Santé", mission: "Promotion de la santé communautaire.", coordinators: [{ name: "Dr. Moussa Traoré", role: "Coordinateur", avatar: "https://placehold.co/80x80.png", hint: "male portrait"}], icon: HeartPulse },
  { name: "Jeunesse et Volontariat", mission: "Mobilisation des jeunes et des volontaires.", coordinators: [{ name: "Kevin Essono", role: "Coordinateur", avatar: "https://placehold.co/80x80.png", hint: "male portrait"}], icon: Users },
  { name: "Étude de Projet", mission: "Conception et évaluation des projets.", coordinators: [{ name: "Carine Ibinga", role: "Coordinatrice", avatar: "https://placehold.co/80x80.png", hint: "female portrait"}], icon: ClipboardCheck },
  { name: "Secours", mission: "Interventions d'urgence.", coordinators: [{ name: "Gérard Lema", role: "Coordinateur", avatar: "https://placehold.co/80x80.png", hint: "male portrait"}], icon: Siren },
  { name: "Action Sociale", mission: "Soutien aux populations vulnérables.", coordinators: [{ name: "Estelle Koumba", role: "Coordinatrice", avatar: "https://placehold.co/80x80.png", hint: "female portrait"}], icon: HandHeart },
  { name: "Assainissement et Hygiène", mission: "Promotion de l'hygiène.", coordinators: [{ name: "Thierry Ndong", role: "Coordinateur", avatar: "https://placehold.co/80x80.png", hint: "male portrait"}], icon: Soup },
  { name: "Discipline", mission: "Renforcement de l'organisation interne.", coordinators: [{ name: "Serge Moussavou", role: "Coordinateur", avatar: "https://placehold.co/80x80.png", hint: "male portrait"}], icon: Shield },
  { name: "Formation", mission: "Développement des compétences.", coordinators: [{ name: "Nathalie Ngouma", role: "Coordinatrice", avatar: "https://placehold.co/80x80.png", hint: "female portrait"}], icon: GraduationCap },
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
                <pool.icon className="w-5 h-5 text-primary" />
                {pool.name}
            </CardTitle>
            <Separator />
            {pool.coordinators.map(coordinator => (
                <div key={coordinator.name} className="flex items-center gap-3 pt-2">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={coordinator.avatar} alt={coordinator.name} data-ai-hint={coordinator.hint} />
                        <AvatarFallback>{coordinator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">{coordinator.name}</p>
                        <p className="text-xs text-muted-foreground">{coordinator.role}</p>
                    </div>
                </div>
            ))}
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
    const [skillFilter, setSkillFilter] = React.useState<string | null>(null);
    const [professionFilter, setProfessionFilter] = React.useState<string | null>(null);

    const [allSkills, setAllSkills] = React.useState<string[]>([]);
    const [allProfessions, setAllProfessions] = React.useState<string[]>([]);
    
    useEffect(() => {
        const fetchVolunteers = async () => {
             if (!db) {
                console.error("Firestore is not initialized");
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const q = query(collection(db, "volunteers"), where("status", "==", "Actif"));
                const querySnapshot = await getDocs(q);
                const volunteersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Volunteer));
                setVolunteers(volunteersData);

                 const skills = new Set<string>();
                const professions = new Set<string>();
                volunteersData.forEach(v => {
                    v.skills?.forEach(skill => skills.add(skill));
                    if (v.profession) professions.add(v.profession);
                });
                setAllSkills(Array.from(skills).sort());
                setAllProfessions(Array.from(professions).sort());

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

        if (skillFilter) {
            sortedVolunteers = sortedVolunteers.filter(v => v.skills?.includes(skillFilter));
        }
        
        if (professionFilter) {
            sortedVolunteers = sortedVolunteers.filter(v => v.profession === professionFilter);
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
                if (!a.createdAt || !b.createdAt) return 0;
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            }
        });

        return sortedVolunteers;
    }, [volunteers, searchTerm, sortConfig, cellFilter, skillFilter, professionFilter]);

    return (
        <div className="flex flex-col gap-12">
            <div className="space-y-2">
                <h1 className="text-3xl font-headline font-bold flex items-center gap-2">
                    <Network className="w-8 h-8 text-primary"/>
                    Notre Équipe
                </h1>
                <p className="text-muted-foreground">Découvrez l'organisation et les membres du Comité du Sixième Arrondissement.</p>
            </div>
            

             <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-center font-headline text-2xl flex items-center justify-center gap-2">
                        <Network className="w-7 h-7"/>
                        Organigramme du Comité
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-12 flex flex-col items-center pt-8">
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

                    {/* Pools */}
                    <div className="w-full">
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pools.map(pool => <PoolCard key={pool.name} pool={pool} />)}
                        </div>
                    </div>

                    <Separator />

                    {/* Coordinators */}
                    <div className="w-full max-w-5xl">
                        <CardHeader className="p-0 mb-4">
                            <CardTitle className="text-center font-headline text-xl">Coordinateurs des Cellules</CardTitle>
                        </CardHeader>
                        <CardContent className="relative p-0">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-border"></div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8">
                                {coordinators.map(member => <MemberCard key={member.name} member={member} size="small" />)}
                            </div>
                        </CardContent>
                    </div>
                 </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-center font-headline text-xl flex items-center justify-center gap-2">
                        <Users className="w-6 h-6"/> Nos Volontaires Actifs
                    </CardTitle>
                    <CardDescription className="text-center">La force vive de notre comité.</CardDescription>
                     <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative lg:col-span-4">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Rechercher par nom, prénom, email..." 
                                className="pl-8 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
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
                        <Select onValueChange={(value) => setSkillFilter(value === 'all' ? null : value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrer par compétence" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les compétences</SelectItem>
                                {allSkills.map(skill => (
                                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select onValueChange={(value) => setProfessionFilter(value === 'all' ? null : value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrer par profession" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les professions</SelectItem>
                                {allProfessions.map(profession => (
                                    <SelectItem key={profession} value={profession}>{profession}</SelectItem>
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
                            {searchTerm || cellFilter || skillFilter || professionFilter ? "Aucun volontaire ne correspond à votre recherche." : "Aucun volontaire actif pour le moment."}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
