import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sitemap } from "lucide-react";

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
    { name: "Paul Abessolo", role: "Coordinateur Urgences", avatar: "https://placehold.co/80x80.png", hint: "male portrait" },
    { name: "Sophie Mavoungou", role: "Coordinatrice Santé", avatar: "https://placehold.co/80x80.png", hint: "female portrait" },
    { name: "Gaston Bouanga", role: "Coordinateur Jeunesse", avatar: "https://placehold.co/80x80.png", hint: "male portrait" },
    { name: "Chantal Lendoye", role: "Coordinatrice Formation", avatar: "https://placehold.co/80x80.png", hint: "female portrait" },
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

export default function TeamPage() {
    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-headline font-bold flex items-center gap-2">
                <Sitemap className="w-8 h-8 text-primary"/>
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
                <Card className="w-full max-w-4xl">
                    <CardHeader>
                        <CardTitle className="text-center font-headline text-xl">Coordinateurs des Commissions</CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-border"></div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                            {coordinators.map(member => <MemberCard key={member.name} member={member} size="small" />)}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
