
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music } from "lucide-react";

const hymneLyrics = `
Couplet 1:
Croix rouge en avant pour la paix du monde
Sans souci ni mal ne regretterons pas,
Car l'univers haut nous regardera et la paix nous sera rendue.

Refrain:
Soleil !
Soleil du ciel ou la tempête noir,
C'est la voix de Jean Henri Dunant
Solférino !
Solférino fut la base de cette histoire, Genève établit les conventions.

Couplet 2:
Nuit jour, sang ou plaie, toujours a servir,
Sans souci ni mal ne regretterons pas,
Croix rouge du Congo nous la garderons,
Même l'ennuie du monde entier.

Refrain:
Soleil !
Soleil du ciel ou la tempête noir,
C'est la voix de Jean Henri Dunant,
Solférino :
Solférino fut la base de cette histoire, Genève établit les conventions.
`;

export default function HymnePage() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">Hymne de la Croix-Rouge</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Un chant qui incarne nos valeurs et notre engagement.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
           <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2">
                        <Music className="w-6 h-6 text-primary"/>
                        Paroles de l'Hymne
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="whitespace-pre-wrap font-body text-left leading-relaxed">
                        {hymneLyrics.trim()}
                    </pre>
                </CardContent>
            </Card>
        </div>
        <aside className="md:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl">Écouter l'hymne</CardTitle>
                </CardHeader>
                <CardContent>
                    <audio controls className="w-full">
                        <source src="https://upload.wikimedia.org/wikipedia/commons/e/e4/The_Hymn_of_the_Red_Cross.ogg" type="audio/ogg" />
                        Votre navigateur ne supporte pas l'élément audio.
                    </audio>
                    <p className="text-sm text-muted-foreground mt-4">
                        Écoutez un chant qui incarne nos valeurs et notre engagement.
                    </p>
                </CardContent>
            </Card>
        </aside>
      </div>
    </main>
  );
}
