"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const principles = [
  {
    name: "Humanité",
    description: "Les volontaires doivent intervenir avec compassion, respect et dignité envers toutes les personnes, sans distinction de leurs opinions politiques. Cela garantit que l'aide humanitaire est délivrée de manière égalitaire."
  },
  {
    name: "Impartialité",
    description: "L'assistance doit être fournie sans discrimination, sur la base des besoins des individus et non de leur appartenance politique, ethnique ou sociale. Les volontaires doivent veiller à ne favoriser aucune partie prenante au cours des élections."
  },
  {
    name: "Neutralité",
    description: "En période électorale, il est crucial que les volontaires s'abstiennent de toute prise de position sur les partis ou candidats en lice. Ils doivent se concentrer uniquement sur leur mission humanitaire, en évitant d'influencer le processus électoral de quelque manière que ce soit."
  },
  {
    name: "Indépendance",
    description: "La Croix-Rouge Gabonaise doit pouvoir fonctionner de manière autonome, en toute indépendance par rapport aux partis politiques, et éviter toute interférence politique qui pourrait compromettre son action humanitaire."
  },
  {
    name: "Volontariat",
    description: "En période électorale, les volontaires doivent être libres de toute pression extérieure, en choisissant d'offrir leur aide de manière désintéressée. Ils doivent être sensibilisés sur leur rôle et la manière dont ils peuvent servir les populations sans se laisser influencer."
  },
  {
    name: "Unité",
    description: "L'unité de l'organisation garantit que les volontaires travaillent ensemble pour une cause commune, en mettant de côté leurs divergences politiques, pour assurer un accès équitable aux services humanitaires."
  },
  {
    name: "Universalité",
    description: "La Croix-Rouge doit être présente pour tous, sans distinction. Lors de la gestion des élections, les volontaires doivent être formés pour fournir des services aux personnes vulnérables, peu importe leur affiliation politique."
  }
];

export default function PrincipesPage() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">Nos Principes Fondamentaux</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Les 7 principes fondamentaux de la Croix-Rouge doivent être scrupuleusement respectés, en particulier en période électorale, où la situation politique peut engendrer des tensions.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {principles.map((principle, index) => (
          <Card key={principle.name} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                <span className="text-primary mr-2">{(index + 1)}.</span>{principle.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground">{principle.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
