
"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Check, Upload, X, ChevronsUpDown, CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const totalSteps = 5

const skillsList = [
    { group: "Compétences médicales & paramédicales", skills: ["Prise de tension artérielle", "Injection intramusculaire", "Désinfection des plaies", "Réalisation de pansements", "Suivi de patients diabétiques", "Réalisation de glycémie capillaire", "Connaissance des premiers soins", "Lecture d’une ordonnance", "Prise de température", "Gestion des constantes vitales", "Accompagnement de patients en fin de vie", "Éducation thérapeutique du patient", "Notions de pharmacologie", "Prévention des infections nosocomiales", "Suivi de femmes enceintes", "Santé maternelle et infantile", "Promotion de la santé", "Sensibilisation au VIH/SIDA", "Hygiène hospitalière", "Prise en charge en urgence médicale"] },
    { group: "Secourisme & gestes d’urgence", skills: ["Gestes de premiers secours (PSC1)", "Réanimation cardio-pulmonaire (RCP)", "Utilisation d’un défibrillateur (DAE)", "Position latérale de sécurité (PLS)", "Arrêt des hémorragies", "Désobstruction des voies aériennes", "Transport d’un blessé", "Prévention des accidents domestiques", "Évacuation d’urgence", "Organisation d’un poste de secours", "Évaluation des risques immédiats", "Soins de base aux brûlures", "Soutien lors de catastrophes naturelles", "Simulation de catastrophe", "Secourisme en équipe (PSE1, PSE2)", "Secours aquatique (BNSSA)", "Aide à la population sinistrée", "Gestion de l’afflux massif de victimes", "Secours en zones difficiles", "Coordination sur zone d’intervention"] },
    { group: "Logistique & gestion de matériel", skills: ["Conduite de véhicule utilitaire", "Manutention de matériel médical", "Gestion des stocks", "Installation de tentes/habitats d’urgence", "Distribution de vivres", "Organisation de la chaîne d’approvisionnement", "Conduite d’un chariot élévateur", "Préparation de kits d’urgence", "Tri des dons matériels", "Répartition équitable des ressources", "Soudure de base", "Réparation de générateur", "Installation de panneaux solaires", "Maintenance de groupe électrogène", "Approvisionnement en eau potable", "Transport de matériel lourd", "Mise en place de points d’eau", "Logistique de convoi humanitaire", "Entretien de véhicule humanitaire", "Suivi des consommables médicaux"] },
    { group: "Communication & sensibilisation", skills: ["Animation de séances de sensibilisation", "Communication non-violente", "Prise de parole en public", "Conception d’affiches de prévention", "Utilisation de réseaux sociaux", "Réalisation de campagnes de communication", "Montage vidéo simple", "Photographie de terrain", "Journalisme humanitaire", "Traduction de messages clés", "Création de supports pédagogiques", "Facilitation de débats", "Communication interculturelle", "Animation de groupes communautaires", "Création de podcasts/émissions radio", "Interview de bénéficiaires", "Organisation de conférences", "Rédaction de communiqués de presse", "Coordination avec les médias", "Élaboration de bulletins d'information"] },
    { group: "Psychosocial & accompagnement", skills: ["Écoute active", "Soutien psychologique de base", "Gestion du stress post-traumatique", "Animation de groupes de parole", "Intervention auprès de victimes", "Médiation sociale", "Prise en charge de personnes vulnérables", "Animation d’ateliers de résilience", "Orientation sociale", "Évaluation de la détresse psychique", "Psychologie interculturelle", "Prévention du suicide", "Gestion des conflits", "Techniques d’apaisement", "Prise en charge d’enfants traumatisés", "Soutien aux personnes endeuillées", "Médiation familiale", "Travail en binôme psychologue/infirmier", "Détection de violences domestiques", "Accompagnement des réfugiés"] },
    { group: "Santé publique & hygiène communautaire", skills: ["Sensibilisation à l’hygiène des mains", "Lutte contre le paludisme", "Prévention du choléra", "Éducation à la santé sexuelle et reproductive", "Vaccination communautaire", "Prévention des maladies transmissibles", "Identification des cas suspects", "Suivi épidémiologique", "Mobilisation communautaire", "Utilisation d’un thermomètre infrarouge", "Organisation d’une campagne de prévention", "Désinfection de surfaces à risque", "Promotion de l’eau potable", "Contrôle sanitaire des vivres", "Affichage sanitaire dans un campement", "Sensibilisation à la tuberculose", "Surveillance post-catastrophe sanitaire", "Prévention des zoonoses", "Lutte contre la malnutrition infantile", "Gestion de l’hygiène menstruelle"] },
    { group: "Compétences informatiques & numériques", skills: ["Saisie de données sur Excel", "Réalisation de graphiques statistiques", "Utilisation de Word pour rapports", "Gestion de base de données", "Utilisation de Google Drive", "Canva (design de supports visuels)", "Notions de HTML / WordPress", "Création de formulaire en ligne", "Rédaction de newsletters", "Montage photo avec Canva ou Photoshop", "Utilisation de PowerPoint pour sensibilisation", "Collecte numérique de données (Kobo, ODK)", "Création de QR codes", "Gestion de page Facebook associative", "Sécurisation de fichiers sensibles", "Installation de logiciels open source", "Participation à une visio Zoom / Teams", "Communication via WhatsApp pro", "Bureautique open source (LibreOffice)", "Archivage numérique"] },
    { group: "Langues & traduction", skills: ["Français parlé/écrit", "Anglais conversationnel", "Traduction orale de messages sanitaires", "Lecture de documents médicaux en anglais", "Interprétation simultanée sur le terrain", "Langue des signes (niveau de base)", "Traduction en langues locales (fang, myènè…)", "Traduction de fiches de soins", "Communication multilingue", "Médiation interculturelle", "Traduction de documents juridiques", "Compétences en langues pour les missions internationales", "Correction de textes pour le terrain", "Apprentissage rapide d’une langue locale", "Anglais humanitaire", "Traduction de supports de formation", "Communication en contexte multilingue", "Traduction de consignes de sécurité", "Lecture de notices médicales en anglais", "Adaptation linguistique des messages"] },
    { group: "Éducation & animation", skills: ["Conception d’ateliers pédagogiques", "Animation d’un groupe d’enfants", "Encadrement de jeunes bénévoles", "Formation à la citoyenneté", "Élaboration de quiz pédagogiques", "Accompagnement scolaire", "Animation d’ateliers d’alphabétisation", "Organisation de jeux éducatifs", "Création de supports éducatifs visuels", "Animation de clubs santé en milieu scolaire", "Sensibilisation sur le climat", "Utilisation de méthodes participatives", "Éducation à la non-violence", "Préparation de matériel scolaire", "Formation par les pairs", "Organisation de concours pédagogiques", "Alphabétisation des adultes", "Méthodologie d’enseignement alternatif", "Éducation à la paix", "Pédagogie active"] },
    { group: "Intervention humanitaire & terrain", skills: ["Préparation d’une mission de terrain", "Analyse des besoins humanitaires", "Évaluation rapide de zone sinistrée", "Coordination avec ONG partenaires", "Planification d’intervention d’urgence", "Distribution de kits humanitaires", "Mise en place de campements", "Organisation de files de distribution", "Prise en compte du genre dans l’aide", "Inclusion des personnes handicapées", "Cartographie des zones d’action", "Définition des critères de vulnérabilité", "Débriefing post-mission", "Évaluation de la satisfaction des bénéficiaires", "Communication avec les autorités locales", "Respect des principes humanitaires", "Suivi post-catastrophe", "Mise en œuvre d’un plan de réponse rapide", "Utilisation de checklists d’urgence", "Tenue d’un journal de terrain"] },
    { group: "Gestion de projet humanitaire", skills: ["Rédaction de projet simple", "Élaboration de chronogrammes", "Définition d’indicateurs de performance", "Gestion budgétaire de base", "Évaluation de projet (suivi/impact)", "Gestion des ressources humaines bénévoles", "Rapport narratif d’activités", "Coordination d’équipe terrain", "Animation de réunions de suivi", "Rédaction de fiches de mission", "Organisation d’ateliers participatifs", "Élaboration d’un arbre à problèmes", "Méthodes participatives (SWOT, PDCA…)", "Tableau de bord de suivi", "Mobilisation communautaire autour d’un projet", "Dossier de financement simple", "Collecte de données terrain", "Analyse de contexte local", "Analyse de parties prenantes", "Reporting vers le siège ou les bailleurs"] },
    { group: "Sécurité et protection", skills: ["Gestion de la sécurité personnelle en mission", "Règles de sécurité en zone instable", "Plan d’évacuation d’urgence", "Prévention des violences sexuelles", "Application de règles de sécurité", "Connaissance des signaux de détresse", "Analyse de risques sécuritaires", "Connaissance du code humanitaire Croix-Rouge", "Utilisation d’équipements de sécurité", "Règles de neutralité et impartialité", "Tenue d’un journal de sécurité", "Sécurité lors de manifestations", "Planification de postes de secours", "Gestion de tension sur le terrain", "Accueil sécurisé des bénéficiaires", "Identification de comportements à risque", "Application de procédures de check-in", "Sécurisation des données sensibles", "Formation aux incidents critiques", "Préparation aux situations de panique"] },
    { group: "Nutrition & alimentation", skills: ["Dépistage de la malnutrition", "Préparation de bouillie nutritionnelle", "Sensibilisation à la nutrition infantile", "Promotion de l’allaitement exclusif", "Calcul de ration alimentaire", "Suivi de croissance infantile", "Lutte contre les carences", "Campagnes de distribution alimentaire", "Sélection des bénéficiaires vulnérables", "Promotion de l’agriculture familiale", "Cuisine en situation de crise", "Repas adaptés aux personnes âgées", "Éducation nutritionnelle", "Préparation de menus équilibrés", "Sécurité alimentaire", "Tri et conservation des denrées", "Prévention de l’obésité infantile", "Diagnostic nutritionnel communautaire", "Partage de recettes locales saines", "Soutien aux cantines scolaires"] },
    { group: "Administration & gestion financière", skills: ["Tenue de caisse simple", "Rédaction de reçus/dépenses", "Gestion de budget associatif", "Justificatifs de dépenses", "Gestion des pièces comptables", "Classement de documents", "Gestion administrative d’un site", "Suivi de feuilles de présence", "Appui logistique à une réunion", "Rédaction de comptes-rendus", "Traitement des remboursements", "Connaissances de base en comptabilité", "Organisation d’un planning d’activités", "Archivage physique ou numérique", "Suivi de contrats de bénévoles", "Rédaction de rapports financiers", "Utilisation d’un petit logiciel de gestion", "Établissement de budgets prévisionnels", "Réconciliation de dépenses", "Préparation de documents pour audit"] },
    { group: "Artisanat & activités pratiques", skills: ["Couture de base", "Fabrication de masques/barrières", "Tricotage de vêtements pour bébés", "Teinture naturelle", "Réparation de vêtements", "Fabrication de savon", "Création d’objets artisanaux à vendre", "Broderie communautaire", "Activités manuelles pour enfants", "Réalisation de sacs à dos recyclés", "Travail du bois (niveau simple)", "Montage de meubles simples", "Conception de supports éducatifs faits main", "Fabrication de jeux éducatifs", "Cuisiner avec peu de ressources", "Décoration communautaire", "Création de kits hygiène faits main", "Réutilisation de matériaux recyclés", "Organisation d’ateliers artisanaux", "Réparation de chaussures/sandales"] },
    { group: "Leadership & coordination associative", skills: ["Organisation d’un planning d’équipe", "Motivation de bénévoles", "Résolution de conflits", "Coordination d’activités solidaires", "Leadership positif", "Prise de décision en groupe", "Esprit d’équipe", "Accompagnement de nouveaux volontaires", "Transmission de savoirs", "Gestion d’un comité local", "Animation d’une assemblée associative", "Communication intergénérationnelle", "Gestion de ressources humaines locales", "Organisation de réunions efficaces", "Gestion des dynamiques de groupe", "Autonomie dans la mission", "Gestion de la pression terrain", "Sens de l’organisation", "Éthique du leadership", "Travail collaboratif"] },
    { group: "Mobilisation & plaidoyer", skills: ["Organisation de campagnes de don", "Mobilisation communautaire", "Préparation d’événements solidaires", "Collecte de signatures/pétitions", "Coordination de groupes de jeunes", "Animation de stands", "Communication avec les élus", "Participation à des forums locaux", "Mise en réseau avec d’autres ONG", "Élaboration de messages clés", "Préparation d’un dossier de plaidoyer", "Relais des besoins des populations", "Communication avec les partenaires techniques", "Animation de campagnes de sensibilisation", "Soutien à la mobilisation humanitaire", "Coordination de volontaires terrain", "Représentation associative", "Diffusion d’alertes", "Organisation de marches solidaires", "Création d’un mouvement local de soutien"] },
];

const allSkills = skillsList.flatMap(group => group.skills);

export default function RegisterPage() {
  const [step, setStep] = React.useState(1)
  const [formData, setFormData] = React.useState({})

  const [open, setOpen] = React.useState(false)
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([])

  const handleNext = () => setStep((prev) => Math.min(prev + 1, totalSteps))
  const handlePrevious = () => setStep((prev) => Math.max(prev - 1, 1))

  const progress = (step / totalSteps) * 100
  
  const handleUnselect = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl relative">
         <Link href="/" className="absolute top-4 left-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Retour à l'accueil</span>
        </Link>
        <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline pt-8">Devenir Volontaire</CardTitle>
            <CardDescription>Rejoignez nos équipes en quelques étapes.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-6">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2 text-center">Étape {step} sur {totalSteps}</p>
            </div>

            {step === 1 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informations personnelles</h3>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="grid gap-2">
                                <Label htmlFor="firstName">Prénom</Label>
                                <Input id="firstName" placeholder="Votre prénom" className="capitalize" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">Nom</Label>
                                <Input id="lastName" placeholder="Votre nom" className="uppercase" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="birthDate">Date de naissance</Label>
                                <Input id="birthDate" type="date" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Numéro de téléphone</Label>
                                <Input id="phone" type="tel" placeholder="+241 XX XX XX XX" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                             <Label htmlFor="email">Adresse e-mail</Label>
                             <Input id="email" type="email" placeholder="nom@exemple.com" />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="address">Adresse complète</Label>
                            <Textarea id="address" placeholder="Votre adresse complète..." className="capitalize" />
                        </div>
                    </div>
                </div>
            )}
            
            {step === 2 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Profil & compétences</h3>
                     <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="educationLevel">Niveau d’études / profession actuelle</Label>
                            <Input id="educationLevel" placeholder="Ex: Étudiant en droit, Infirmier, etc." />
                        </div>
                        <div className="grid gap-2">
                             <Label>Compétences spécifiques utiles</Label>
                             <p className="text-sm text-muted-foreground">Sélectionnez vos compétences dans la liste.</p>
                             <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between h-auto"
                                    >
                                    <div className="flex gap-1 flex-wrap">
                                        {selectedSkills.length > 0 ? (
                                            selectedSkills.map((skill) => (
                                                <Badge
                                                    variant="secondary"
                                                    key={skill}
                                                    className="mr-1 mb-1"
                                                    onClick={() => handleUnselect(skill)}
                                                >
                                                    {skill}
                                                    <button
                                                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                handleUnselect(skill);
                                                            }
                                                        }}
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        }}
                                                        onClick={() => handleUnselect(skill)}
                                                    >
                                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                                    </button>
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-muted-foreground">Sélectionner des compétences...</span>
                                        )}
                                    </div>
                                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                                    <Command>
                                    <CommandInput placeholder="Rechercher une compétence..." />
                                    <CommandList>
                                        <CommandEmpty>Aucune compétence trouvée.</CommandEmpty>
                                        {skillsList.map((group) => (
                                            <CommandGroup key={group.group} heading={group.group}>
                                                {group.skills.map((skill) => (
                                                <CommandItem
                                                    key={skill}
                                                    onSelect={() => {
                                                        setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
                                                        setOpen(true);
                                                    }}
                                                >
                                                    <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedSkills.includes(skill) ? "opacity-100" : "opacity-0"
                                                    )}
                                                    />
                                                    {skill}
                                                </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        ))}
                                    </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="experience">Expérience bénévole ou associative (facultative)</Label>
                            <Textarea id="experience" placeholder="Décrivez brièvement vos expériences passées..." />
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Disponibilité & zone d’action</h3>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                             <Label>Disponibilité</Label>
                             <p className="text-sm text-muted-foreground">Quand êtes-vous généralement disponible ?</p>
                            <div className="grid grid-cols-2 gap-4">
                                {["Jour (semaine)", "Soir (semaine)", "Week-end", "Missions longues"].map(avail => (
                                    <div className="flex items-center space-x-2" key={avail}>
                                        <Checkbox id={avail} />
                                        <label htmlFor={avail} className="text-sm font-medium leading-none">{avail}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="location">Lieu de résidence ou secteur d’intervention souhaité</Label>
                             <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez une province" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="estuaire">Estuaire (Libreville)</SelectItem>
                                    <SelectItem value="haut-ogooue">Haut-Ogooué (Franceville)</SelectItem>
                                    <SelectItem value="moyen-ogooue">Moyen-Ogooué (Lambaréné)</SelectItem>
                                    <SelectItem value="ngounie">Ngounié (Mouila)</SelectItem>
                                    <SelectItem value="nyanga">Nyanga (Tchibanga)</SelectItem>
                                    <SelectItem value="ogooue-ivindo">Ogooué-Ivindo (Makokou)</SelectItem>
                                    <SelectItem value="ogooue-lolo">Ogooué-Lolo (Koulamoutou)</SelectItem>
                                    <SelectItem value="ogooue-maritime">Ogooué-Maritime (Port-Gentil)</SelectItem>
                                    <SelectItem value="woleu-ntem">Woleu-Ntem (Oyem)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            )}

             {step === 4 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Motivation</h3>
                     <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="motivationLetter">Pourquoi souhaitez-vous devenir volontaire ?</Label>
                            <Textarea id="motivationLetter" placeholder="Expliquez brièvement vos motivations..." rows={5} />
                        </div>
                        <div className="grid gap-2">
                             <Label>Quelles causes vous tiennent particulièrement à cœur ?</Label>
                            <div className="grid grid-cols-2 gap-4">
                                {["Urgences", "Aide alimentaire", "Santé", "Jeunesse", "Soutien social", "Formation"].map(cause => (
                                    <div className="flex items-center space-x-2" key={cause}>
                                        <Checkbox id={cause} />
                                        <label htmlFor={cause} className="text-sm font-medium leading-none">{cause}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 5 && (
                <div className="space-y-6 text-center">
                    <h3 className="text-lg font-semibold">Pièces à joindre</h3>
                    <div className="grid gap-4 md:w-2/3 mx-auto">
                         <div className="grid gap-2 text-left">
                            <Label htmlFor="idCard">Pièce d’identité (Recto)</Label>
                            <Button variant="outline" asChild className="cursor-pointer">
                                <div><Upload className="mr-2" /> Télécharger un fichier</div>
                            </Button>
                            <Input id="idCard" type="file" className="hidden"/>
                        </div>
                         <div className="grid gap-2 text-left">
                            <Label htmlFor="idCardBack">Pièce d’identité (Verso)</Label>
                            <Button variant="outline" asChild className="cursor-pointer">
                                <div><Upload className="mr-2" /> Télécharger un fichier</div>
                            </Button>
                            <Input id="idCardBack" type="file" className="hidden"/>
                        </div>
                    </div>
                     <div className="flex items-start space-x-2 pt-4 md:w-2/3 mx-auto">
                        <Checkbox id="terms" />
                        <label htmlFor="terms" className="text-sm font-medium leading-none text-left">
                            Je certifie l'exactitude des informations fournies et j'accepte les termes et conditions de l'engagement volontaire au sein de la Croix-Rouge Gabonaise.
                        </label>
                    </div>
                </div>
            )}
            
            {step === totalSteps + 1 && (
                 <div className="text-center space-y-4 flex flex-col items-center">
                    <div className="p-4 bg-green-100 rounded-full">
                        <Check className="h-12 w-12 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold font-headline">Inscription terminée !</h3>
                    <p className="text-muted-foreground max-w-md">
                        Merci pour votre engagement. Votre candidature a été soumise avec succès. Nous l'examinerons attentivement et vous contacterons très prochainement.
                    </p>
                    <Button asChild>
                        <Link href="/dashboard">Accéder à mon espace</Link>
                    </Button>
                 </div>
            )}


            {step <= totalSteps && (
                <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
                        Précédent
                    </Button>
                    
                    {step < totalSteps && (
                        <Button onClick={handleNext}>
                            Suivant
                        </Button>
                    )}

                    {step === totalSteps && (
                        <Button onClick={handleNext}>
                            Soumettre ma candidature
                        </Button>
                    )}
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  )
}

    