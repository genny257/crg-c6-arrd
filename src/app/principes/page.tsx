
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const principles = [
  {
    name: "Humanité",
    description: "Née du souci de porter secours sans discrimination aux blessés des champs de bataille, la Croix-Rouge, sous son aspect international et national, s'efforce de prévenir et d'alléger en toutes circonstances les souffrances humaines. Elle tend à protéger la vie et la santé, ainsi qu'à faire respecter la personne humaine. Elle favorise l'intercompréhension, l'amitié, la coopération et une paix durable entre tous les peuples."
  },
  {
    name: "Impartialité",
    description: "Elle ne fait aucune distinction de nationalité, de race, de religion, de condition sociale et d'appartenance politique. Elle s'applique seulement à secourir les individus à la mesure de leurs souffrances et à subvenir par priorité aux détresses les plus urgentes."
  },
  {
    name: "Neutralité",
    description: "Afin de garder la confiance de tous, la Croix-Rouge s'abstient de prendre part aux hostilités et, en tout temps, aux controverses d'ordre politique, racial, religieux et idéologique."
  },
  {
    name: "Indépendance",
    description: "La Croix-Rouge est indépendante. Auxiliaires des pouvoirs publics dans leurs activités humanitaires et soumises aux lois qui régissent leurs pays respectifs, les Sociétés Nationales doivent pourtant conserver une autonomie qui leur permette d'agir toujours selon les principes du Mouvement."
  },
  {
    name: "Volontariat",
    description: "La Croix-Rouge est une institution de secours volontaire et désintéressée."
  },
  {
    name: "Unité",
    description: "Il ne peut y avoir qu'une seule Société de la Croix-Rouge dans un même pays. Elle doit être ouverte à tous et étendre son action humanitaire au territoire entier."
  },
  {
    name: "Universalité",
    description: "La Croix-Rouge est une institution universelle, au sein de laquelle toutes les Sociétés ont des droits égaux et le devoir de s'entraider."
  }
];

export default function PrincipesPage() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">Nos Principes Fondamentaux</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Le Mouvement international de la Croix-Rouge et du Croissant-Rouge est guidé par sept principes fondamentaux qui garantissent la cohérence et l&apos;efficacité de son action humanitaire à travers le monde.
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
