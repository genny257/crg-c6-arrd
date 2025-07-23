
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music } from "lucide-react";

const hymneLyrics = `
Inter
Couplet 1
Dans la détresse et dans les pleurs
Quand la nature est en fureur
Quand le sang coule et rougit la terre
Partout s’élève la même prière

Refrain
D’un bout à l’autre de la terre
Un seul emblème, une seule bannière
Un seul amour, celui de nos frères
C’est l’humanité en marche
En marche vers la lumière

Couplet 2
Quand la misère frappe à nos portes
Quand la maladie est la plus forte
Dans la famine ou dans la guerre
Partout s’élève la même prière

Refrain
D’un bout à l’autre de la terre
Un seul emblème, une seule bannière
Un seul amour, celui de nos frères
C’est l’humanité en marche
En marche vers la lumière

Pont
Quand il faudra donner sa vie
Pour que l’espoir jamais ne meure
Nous resterons unis
Car telle est la loi de nos pères

Refrain
D’un bout à l’autre de la terre
Un seul emblème, une seule bannière
Un seul amour, celui de nos frères
C’est l’humanité en marche
En marche vers la lumière
`;

export default function HymnePage() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">Hymne de la Croix-Rouge</h1>
        <p className="text-lg text-muted-foreground mb-8">
          &quot;L&apos;humanité en marche&quot;
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
           <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2">
                        <Music className="w-6 h-6 text-primary"/>
                        Paroles de l&apos;Hymne
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
                    <CardTitle className="font-headline text-xl">Écouter l&apos;hymne</CardTitle>
                </CardHeader>
                <CardContent>
                    <audio controls className="w-full">
                        <source src="/hymne-crg.mp3" type="audio/mpeg" />
                        Votre navigateur ne supporte pas l&apos;élément audio.
                    </audio>
                    <p className="text-sm text-muted-foreground mt-4">
                        Écoutez &quot;L&apos;humanité en marche&quot;, un chant qui incarne nos valeurs et notre engagement.
                    </p>
                </CardContent>
            </Card>
        </aside>
      </div>
    </main>
  );
}
