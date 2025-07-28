import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
            <h1 className="text-4xl font-headline font-bold text-primary mb-2">Politique de Confidentialité</h1>
            <p className="text-muted-foreground">Dernière mise à jour : 25 Octobre 2025</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <p>La Croix-Rouge Gabonaise, Comité du 6ème Arrondissement ("nous", "notre", "nos"), s'engage à protéger la vie privée des utilisateurs de sa plateforme. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre site web.</p>
                <p>En utilisant cette plateforme, vous consentez à la collecte et à l'utilisation de vos informations conformément à cette politique.</p>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Collecte de vos informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <p>Nous pouvons collecter des informations vous concernant de différentes manières :</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        <strong>Données personnelles identifiables :</strong> Telles que votre nom, prénom, adresse e-mail, numéro de téléphone, date de naissance, et autres informations que vous nous fournissez volontairement lors de votre inscription en tant que volontaire, en faisant un don, ou en remplissant un formulaire de contact.
                    </li>
                    <li>
                        <strong>Données financières :</strong> Lors d'un don, nous collectons les informations nécessaires au traitement du paiement via nos partenaires sécurisés (ex: numéro de téléphone pour le paiement mobile). Nous ne stockons pas vos informations de paiement complètes sur nos serveurs.
                    </li>
                     <li>
                        <strong>Données de journal et d'utilisation :</strong> Nous collectons automatiquement des informations que votre navigateur envoie lorsque vous visitez notre site, telles que votre adresse IP, le type de navigateur, les pages visitées et l'heure de votre visite.
                    </li>
                </ul>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Utilisation de vos informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                 <p>Avoir des informations précises sur vous nous permet de vous offrir une expérience fluide, efficace et personnalisée. Spécifiquement, nous pouvons utiliser les informations collectées pour :</p>
                 <ul className="list-disc pl-6 space-y-2">
                    <li>Créer et gérer votre compte de volontaire.</li>
                    <li>Traiter les dons et les transactions.</li>
                    <li>Vous contacter concernant votre compte ou nos activités.</li>
                    <li>Améliorer l'efficacité et le fonctionnement de la plateforme.</li>
                    <li>Surveiller et analyser l'utilisation et les tendances pour améliorer votre expérience.</li>
                     <li>Assurer la sécurité de notre plateforme et prévenir la fraude.</li>
                </ul>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Partage de vos informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <p>Nous ne partageons pas les informations que nous avons collectées à votre sujet avec des tiers, sauf dans les situations suivantes :</p>
                 <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Par obligation légale :</strong> Si la divulgation est nécessaire pour répondre à une procédure légale, enquêter sur des violations potentielles de nos politiques, ou protéger les droits, la propriété et la sécurité d'autrui.</li>
                    <li><strong>Fournisseurs de services tiers :</strong> Nous pouvons partager vos informations avec des tiers qui effectuent des services pour nous ou en notre nom, y compris le traitement des paiements et l'envoi d'e-mails.</li>
                </ul>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Sécurité de vos informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <p>Nous utilisons des mesures de sécurité administratives, techniques et physiques pour aider à protéger vos informations personnelles. Bien que nous ayons pris des mesures raisonnables pour sécuriser les informations personnelles que vous nous fournissez, veuillez être conscient qu'aucun système de sécurité n'est parfait ou impénétrable.</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Vos droits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <p>Vous avez le droit de consulter, de modifier ou de supprimer vos informations personnelles à tout moment. Vous pouvez le faire en vous connectant à votre espace personnel ou en nous contactant directement.</p>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Nous contacter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <p>Si vous avez des questions ou des commentaires sur cette politique de confidentialité, veuillez nous contacter via notre <a href="/contact" className="text-primary underline">formulaire de contact</a>.</p>
            </CardContent>
        </Card>

      </div>
    </main>
  );
}
