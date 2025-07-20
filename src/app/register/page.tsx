
"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Check, Upload, X, ChevronsUpDown, UserSquare2 } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { locations } from "@/lib/locations"
import { useToast } from "@/hooks/use-toast"
import { registerUser } from "@/ai/flows/register-flow"
import { RegisterUserInputSchema } from "@/ai/schemas/register-user-schema"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const totalSteps = 5

const cells = [
    "Nzeng-Ayong Lac",
    "Nzeng-Ayong Village",
    "Ondogo",
    "PK6-PK9",
    "PK9-Bikélé",
];

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
    { group: "Leadership & coordination associative", skills: ["Organisation d’un planning d’équipe", "Motivation de bénévoles", "Résolution de conflits", "Coordination d’activités solidaires", "Leadership positif", "Prise de décision en groupe", "Esprit d’équipe", "Accompagnement de nouveaux volontaires", "Transmission de savoirs", "Gestion d’un comité local", "Animation d’une assemblée associative", "Communication intergénérationnelle", "Gestion de ressources humaines locales", "Organisation d’un planning d’activités efficaces", "Gestion de dynamiques de groupe", "Autonomie dans la mission", "Gestion de la pression terrain", "Sens de l’organisation", "Éthique du leadership", "Travail collaboratif"] },
    { group: "Mobilisation & plaidoyer", skills: ["Organisation de campagnes de don", "Mobilisation communautaire", "Préparation d’événements solidaires", "Collecte de signatures/pétitions", "Coordination de groupes de jeunes", "Animation de stands", "Communication avec les élus", "Participation à des forums locaux", "Mise en réseau avec d’autres ONG", "Élaboration de messages clés", "Préparation d’un dossier de plaidoyer", "Relais des besoins des populations", "Communication avec les partenaires techniques", "Animation de campagnes de sensibilisation", "Soutien à la mobilisation humanitaire", "Coordination de volontaires terrain", "Représentation associative", "Diffusion d’alertes", "Organisation de marches solidaires", "Création d’un mouvement local de soutien"] },
];

const educationLevels = [
    { group: "Niveaux hors système scolaire", levels: ["Jamais allé(e) à l’école", "Analphabète (ne sait ni lire ni écrire)", "Alpha-niveau 1 (début de l’alphabétisation)", "Alpha-niveau 2 (alphabétisation fonctionnelle)", "Alpha-niveau 3 (lecture, écriture et calculs simples)", "Apprentissage traditionnel / coutumier (transmission orale)", "Savoir-faire autodidacte (sans scolarisation)", "Formation religieuse de base uniquement (Coranique, Biblique...)", "Éducation communautaire informelle", "Enseignement domestique / à domicile (non déclaré)"] },
    { group: "Enseignement préscolaire / maternelle", levels: ["Petite section (PS)", "Moyenne section (MS)", "Grande section (GS)", "Éducation préscolaire informelle / garderie"] },
    { group: "Enseignement primaire", levels: ["Cours préparatoire 1 (CP1)", "Cours préparatoire 2 (CP2)", "Cours élémentaire 1 (CE1)", "Cours élémentaire 2 (CE2)", "Cours moyen 1 (CM1)", "Cours moyen 2 (CM2)", "Certificat d’Études Primaires (CEP / CEPE / CPE)", "Fin du primaire sans diplôme"] },
    { group: "Enseignement secondaire – 1er cycle (collège)", levels: ["6e (sixième)", "5e (cinquième)", "4e (quatrième)", "3e (troisième)", "Brevet d’Études du Premier Cycle (BEPC / DNB)", "Fin du collège sans diplôme"] },
    { group: "Enseignement secondaire – 2nd cycle (lycée)", levels: ["2nde (seconde)", "1ère (première)", "Terminale", "Baccalauréat général (BAC A, B, C, D…)", "Baccalauréat technique / professionnel", "Fin du lycée sans le Bac"] },
    { group: "Formation technique & professionnelle", levels: ["CAP (Certificat d'Aptitude Professionnelle)", "BEP (Brevet d'Études Professionnelles)", "BT (Brevet de Technicien)", "Baccalauréat professionnel / technique", "BAC +1 en formation pro (type BTS 1ère année)", "BTS (Brevet de Technicien Supérieur)", "DUT (Diplôme Universitaire de Technologie)", "Diplôme de Qualification Professionnelle (DQP)", "Diplôme d’État d’aide-soignant(e)", "Certificat de Formation aux Métiers (CFM)", "Attestation de qualification professionnelle", "Formation courte certifiante (1-6 mois)", "Apprentissage en entreprise (avec ou sans diplôme)", "Artisan formé sur le tas (non diplômé)"] },
    { group: "Enseignement supérieur", levels: ["BAC +1 (Licence 1 / L1)", "BAC +2 (Licence 2 / L2)", "DEUG / DUT / BTS", "BAC +3 (Licence / Licence professionnelle / L3)", "BAC +4 (Master 1 / M1)", "BAC +5 (Master / Ingénieur / M2)", "Diplôme d’école supérieure (BBA, MBA, etc.)", "Diplôme de Grandes Écoles (HEC, ENA, etc.)", "BAC +6 et + (DEA, DESS, spécialisation)", "Doctorat (PhD)", "Doctorat d’État / Post-doc", "Habilitation à Diriger des Recherches (HDR)"] },
    { group: "Autres cas particuliers", levels: ["Éducation non diplômante (auditeur libre)", "Études inachevées (niveau arrêté)", "Formation en ligne / e-learning sans diplôme", "Diplôme étranger non reconnu", "Équivalence de diplôme en cours", "Formation continue d’adulte", "Réorientation en cours de cycle"] }
];

const allEducationLevels = educationLevels.flatMap(group => group.levels);

const professionsList = [
    { group: "Santé & médical", professions: ["Médecin généraliste", "Chirurgien", "Infirmier•ère", "Sage-femme", "Kinésithérapeute", "Pharmacien•ne", "Dentiste", "Opticien•ne", "Psychologue", "Psychiatre", "Technicien•ne de laboratoire", "Radiologue", "Aide-soignant•e", "Diététicien•ne", "Orthophoniste", "Ergothérapeute", "Podologue", "Auxiliaire de puériculture", "Paramedic", "Ambulancier•ère"] },
    { group: "Urgence & secours", professions: ["Sapeur-pompier•ère", "Agent de sécurité", "Médecin urgentiste", "Secouriste bénévole", "Technicien•ne de sauvetage aquatique", "Coordinateur de secours", "Chef de poste de secours", "Opérateur radio secours", "Responsable DPS", "Formateur secourisme", "Technicien•ne de désastre", "Plongeur de secours", "Médecin du SAMU", "Psychologue de crise", "Logistien de gestion des urgences", "Conducteur d’ambulance", "Sauveteur en mer", "Secouriste événementiel", "Chef d’équipe secours", "Agent de désinfection post-catastrophe"] },
    { group: "Ingénierie & technique", professions: ["Ingénieur civil", "Ingénieur mécanique", "Ingénieur électricien", "Ingénieur environnement", "Ingénieur agroalimentaire", "Ingénieur géotechnicien", "Ingénieur télécommunications", "Ingénieur énergie renouvelable", "Ingénieur informatique", "Ingénieur sécurité", "Technicien de maintenance", "Technicien environnement", "Technicien réseau", "Electricien", "Plombier", "Mécanicien auto", "Soudeur", "Charpentier", "Serrurier", "Conducteur de travaux"] },
    { group: "Construction & bâti", professions: ["Architecte", "Maçon•ne", "Carreleur•euse", "Plâtrier•ère", "Peintre en bâtiment", "Couvreur•euse", "Menuisier•ère", "Plombier•ère chauffagiste", "Chef de chantier", "Préfabriqué traitement", "Conducteur•trice d’engins (grue, pelleteuse…)", "Géomètre-topographe", "Expert bâtiment", "Monteur en échafaudage", "Encadre spécialiste école", "Projeteur en bâtiment", "Urbaniste", "Ingénieur structure", "Technicien béton", "Contrôleur technique"] },
    { group: "Informatique & numérique", professions: ["Développeur•euse web", "Développeur•euse mobile", "Data analyst", "Data scientist", "Administrateur•trice systèmes", "Administrateur•trice réseaux", "Ingénieur•e sécurité informatique", "Webmaster", "UX designer", "UI designer", "Chef de projet IT", "Développeur•euse full-stack", "Testeur qualité logiciel", "Architecte logiciel", "Analyste fonctionnel", "DevOps", "Consultant•e ERP", "Technicien•ne informatique", "Formateur•trice numérique", "Technicien•ne helpdesk"] },
    { group: "Finance & comptabilité", professions: ["Comptable", "Expert-comptable", "Auditeur•trice financier", "Contrôleur de gestion", "Analyste financier", "Trader", "Consultant•e en finance", "Gestionnaire de paie", "Directeur financier", "Assistant•e juridique", "Fiscaliste", "Conseiller•ère en gestion privée", "Banque d’affaires", "Chargé•e de recouvrement", "Agent de guichet bancaire", "Agent de crédit", "Gestionnaire de portefeuille", "Risk manager", "Analyste crédit", "Trésorier•ère"] },
    { group: "Métiers informels & vie quotidienne", professions: ["Ménagère / Femme au foyer", "Homme au foyer", "Cuisinière de rue (restauration informelle)", "Coiffeur de quartier", "Couturière à domicile", "Vendeur ambulant", "Marchande de vivres frais", "Brocanteur", "Débrouillard urbain", "Revendeur de friperie", "Laveur de voitures", "Manœuvre journalier", "Portefaix (transporteur manuel)", "Recycleur informel / récupérateur", "Tôlier de rue", "Réparateur de chaussures", "Cordonnier ambulant", "Mécanicien de quartier", "Soudeur de fortune", "Technicien téléphone / smartphone (rue)"] },
    { group: "Commerce & auto-emploi", professions: ["Vendeuse de marché", "Vendeur de recharge téléphonique", "Boutique de quartier (tenancier)", "Gérant de kiosque", "Livreur informel", "Fripier", "Vendeur de poisson", "Vendeur de bois / charbon", "Pâtissière artisanale", "Fabricant de jus locaux", "Réparateur électroménager", "Revendeur de pièces détachées", "Vendeur de cartes SIM", "Propriétaire de buvette", "Conducteur de moto-taxi", "Chauffeur particulier", "Préparateur de gari / manioc", "Tresseuse", "Tailleur", "Vendeur de tissu africain"] },
    { group: "Métiers traditionnels, artisanaux & ruraux", professions: ["Forgeron", "Potière", "Tisserand•e", "Apiculteur traditionnel", "Chasseur", "Cultivateur traditionnel", "Éleveur de village", "Pêcheur artisanal", "Herboriste", "Devin / guérisseur traditionnel", "Praticien de médecine douce", "Marabout / spiritualiste", "Fabricant de tam-tams", "Sculpteur sur bois", "Fabricant de paniers", "Vannier", "Artisan bijoutier traditionnel", "Peintre muraliste", "Tapissier traditionnel", "Chanteur griot"] },
    { group: "Autres statuts sociaux importants", professions: ["Étudiant•e", "Élève", "Apprenti•e", "Stagiaire", "Boursier•ère", "Personne sans emploi", "Personne handicapée sans activité", "Personne retraitée", "Bénévole", "Volontaire non rémunéré", "Femme veuve avec enfants à charge", "Tuteur•rice familial•e", "Ex-combattant", "Orphelin•e majeur•e", "Personne déplacée", "Réfugié•e", "Demandeur•euse d’asile", "Prisonnier•ère (en réinsertion)", "En réinsertion sociale", "Travailleurs saisonniers"] },
    { group: "Professions émergentes & numériques", professions: ["Influenceur•se digital", "Créateur•rice de contenu", "Gestionnaire de communauté (TikTok, Insta)", "Designer d’interface vocale", "Spécialiste IA éthique", "Développeur blockchain", "Mineur de cryptomonnaie", "Coach de vie en ligne", "Animateur de webinaires", "Télétravailleur freelance", "Spécialiste dropshipping", "Vendeur e-commerce local", "Monteur vidéo YouTube", "Gamer professionnel", "Modérateur de contenu web", "Consultant en sobriété numérique", "Développeur de jeux", "Designer NFT", "Assistant virtuel", "Professeur particulier en ligne"] }
];
const allProfessions = professionsList.flatMap(group => group.professions);


const LocationSelector = ({ form, title, fieldPrefix }: { form: any, title: string, fieldPrefix: string }) => {
    const selectedProvince = form.watch(`${fieldPrefix}.province`);
    const selectedDepartement = form.watch(`${fieldPrefix}.departement`);
    const selectedCommuneCanton = form.watch(`${fieldPrefix}.communeCanton`);
    const selectedArrondissement = form.watch(`${fieldPrefix}.arrondissement`);

    const departements = selectedProvince ? Object.keys(locations[selectedProvince as keyof typeof locations] || {}) : [];

    const communes = selectedDepartement
        ? Object.keys(locations[selectedProvince as keyof typeof locations]?.[selectedDepartement as keyof typeof locations[keyof typeof locations]]?.['communes'] || {})
        : [];

    const cantons = selectedDepartement
        ? Object.keys(locations[selectedProvince as keyof typeof locations]?.[selectedDepartement as keyof typeof locations[keyof typeof locations]]?.['cantons'] || {})
        : [];

    const communesEtCantons = [...communes, ...cantons];

    const arrondissements = selectedCommuneCanton && selectedDepartement && communes.includes(selectedCommuneCanton)
        ? Object.keys(locations[selectedProvince as keyof typeof locations]?.[selectedDepartement as keyof typeof locations[keyof typeof locations]]?.communes?.[selectedCommuneCanton as keyof typeof locations[keyof typeof locations]['communes']]?.arrondissements || {})
        : [];

    const quartiers = selectedArrondissement && selectedDepartement && communes.includes(selectedCommuneCanton)
        ? locations[selectedProvince as keyof typeof locations]?.[selectedDepartement as keyof typeof locations[keyof typeof locations]]?.communes?.[selectedCommuneCanton as keyof typeof locations[keyof typeof locations]['communes']]?.arrondissements?.[selectedArrondissement as keyof any] || []
        : (selectedCommuneCanton && selectedDepartement && communes.includes(selectedCommuneCanton))
            ? locations[selectedProvince as keyof typeof locations]?.[selectedDepartement as keyof typeof locations[keyof typeof locations]]?.communes?.[selectedCommuneCanton as keyof any]?.quartiers || []
            : [];

    const villages = selectedCommuneCanton && selectedDepartement && cantons.includes(selectedCommuneCanton)
        ? locations[selectedProvince as keyof typeof locations]?.[selectedDepartement as keyof typeof locations[keyof typeof locations]]?.cantons?.[selectedCommuneCanton as keyof any] || []
        : [];

    const localitesFinales = [...quartiers, ...villages];


    return (
        <div className="grid gap-2 p-4 border rounded-lg">
            <h4 className="font-semibold">{title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name={`${fieldPrefix}.province`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Province</FormLabel>
                            <Select onValueChange={(value) => { field.onChange(value); form.setValue(`${fieldPrefix}.departement`, ""); form.setValue(`${fieldPrefix}.communeCanton`, ""); form.setValue(`${fieldPrefix}.arrondissement`, ""); form.setValue(`${fieldPrefix}.quartierVillage`, ""); }} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner une province" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.keys(locations).map(province => <SelectItem key={province} value={province}>{province}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`${fieldPrefix}.departement`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Département</FormLabel>
                            <Select disabled={!selectedProvince} onValueChange={(value) => { field.onChange(value); form.setValue(`${fieldPrefix}.communeCanton`, ""); form.setValue(`${fieldPrefix}.arrondissement`, ""); form.setValue(`${fieldPrefix}.quartierVillage`, ""); }} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner un département" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {departements.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`${fieldPrefix}.communeCanton`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Commune ou Canton</FormLabel>
                            <Select disabled={!selectedDepartement} onValueChange={(value) => { field.onChange(value); form.setValue(`${fieldPrefix}.arrondissement`, ""); form.setValue(`${fieldPrefix}.quartierVillage`, ""); }} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner une commune/canton" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {communesEtCantons.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`${fieldPrefix}.arrondissement`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Arrondissement</FormLabel>
                            <Select disabled={!selectedCommuneCanton || !communes.includes(selectedCommuneCanton)} onValueChange={(value) => { field.onChange(value); form.setValue(`${fieldPrefix}.quartierVillage`, ""); }} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner un arrondissement" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {arrondissements.map(arr => <SelectItem key={arr} value={arr}>{arr}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`${fieldPrefix}.quartierVillage`}
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Quartier ou Village</FormLabel>
                            <Select disabled={!selectedCommuneCanton} onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner un quartier/village" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {localitesFinales.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
};


export default function RegisterPage() {
    const [step, setStep] = React.useState(1)
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const form = useForm<z.infer<typeof RegisterUserInputSchema>>({
        resolver: zodResolver(RegisterUserInputSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            birthDate: "",
            birthPlace: "",
            sex: "masculin",
            maritalStatus: "célibataire",
            idCardNumber: "",
            phone: "",
            email: "",
            address: "",
            educationLevel: "",
            profession: "",
            skills: [],
            volunteerExperience: "",
            availability: [],
            causes: [],
            assignedCell: "",
            residence: { province: "", departement: "", communeCanton: "", arrondissement: "", quartierVillage: "" },
            photo: "",
            idCardFront: "",
            idCardBack: "",
            termsAccepted: false,
        },
    });

    const [skillsPopoverOpen, setSkillsPopoverOpen] = React.useState(false)
    const [skillsInputValue, setSkillsInputValue] = React.useState("")

    const [educationPopoverOpen, setEducationPopoverOpen] = React.useState(false)
    const [educationInputValue, setEducationInputValue] = React.useState("")

    const [professionPopoverOpen, setProfessionPopoverOpen] = React.useState(false);
    const [professionInputValue, setProfessionInputValue] = React.useState("");

    const handleNext = () => setStep((prev) => Math.min(prev + 1, totalSteps))
    const handlePrevious = () => setStep((prev) => Math.max(prev - 1, 1))

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: "photo" | "idCardFront" | "idCardBack") => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                form.setValue(fieldName, loadEvent.target?.result as string);
                toast({
                    title: "Fichier sélectionné",
                    description: file.name,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: z.infer<typeof RegisterUserInputSchema>) => {
        setIsSubmitting(true);
        try {
            await registerUser(data);
            toast({
                title: "Candidature Soumise",
                description: "Votre inscription a été envoyée avec succès.",
            });
            setStep((prev) => prev + 1);
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la soumission. Veuillez réessayer.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = (step / totalSteps) * 100

    const handleUnselectSkill = (skill: string) => {
        const currentSkills = form.getValues("skills") || [];
        form.setValue("skills", currentSkills.filter((s) => s !== skill));
    };

    const handleSelectSkill = (skill: string) => {
        const currentSkills = form.getValues("skills") || [];
        if (!currentSkills.includes(skill)) {
            form.setValue("skills", [...currentSkills, skill]);
        }
        setSkillsInputValue("");
        setSkillsPopoverOpen(true);
    }
    
    const photoPreview = form.watch("photo");

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

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {step === 1 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Informations personnelles</h3>
                                    <div className="grid gap-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField control={form.control} name="firstName" render={({ field }) => (
                                                <FormItem><FormLabel>Prénom</FormLabel><FormControl><Input placeholder="Votre prénom" {...field} className="capitalize" /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name="lastName" render={({ field }) => (
                                                <FormItem><FormLabel>Nom</FormLabel><FormControl><Input placeholder="Votre nom" {...field} className="uppercase" /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField control={form.control} name="birthDate" render={({ field }) => (
                                                <FormItem><FormLabel>Date de naissance</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name="birthPlace" render={({ field }) => (
                                                <FormItem><FormLabel>Lieu de naissance</FormLabel><FormControl><Input placeholder="Lieu de naissance" {...field} className="capitalize" /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             <FormField control={form.control} name="sex" render={({ field }) => (
                                                <FormItem><FormLabel>Sexe</FormLabel>
                                                <FormControl>
                                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4">
                                                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="masculin" /></FormControl><FormLabel className="font-normal">Masculin</FormLabel></FormItem>
                                                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="féminin" /></FormControl><FormLabel className="font-normal">Féminin</FormLabel></FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage /></FormItem>
                                            )} />
                                             <FormField control={form.control} name="maritalStatus" render={({ field }) => (
                                                <FormItem><FormLabel>Situation de famille</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="célibataire">Célibataire</SelectItem>
                                                        <SelectItem value="marié(e)">Marié(e)</SelectItem>
                                                        <SelectItem value="divorcé(e)">Divorcé(e)</SelectItem>
                                                        <SelectItem value="veuf(ve)">Veuf(ve)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage /></FormItem>
                                            )} />
                                        </div>
                                        <FormField control={form.control} name="idCardNumber" render={({ field }) => (
                                            <FormItem><FormLabel>N° de la carte d'identité</FormLabel><FormControl><Input placeholder="Numéro de votre pièce d'identité" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Coordonnées & Résidence</h3>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="phone" render={({ field }) => (
                                            <FormItem><FormLabel>Numéro de téléphone</FormLabel><FormControl><Input type="tel" placeholder="+241 XX XX XX XX" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="email" render={({ field }) => (
                                            <FormItem><FormLabel>Adresse e-mail</FormLabel><FormControl><Input type="email" placeholder="nom@exemple.com" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="address" render={({ field }) => (
                                        <FormItem><FormLabel>Adresse complète (Boîte Postale, Rue, Immeuble, etc.)</FormLabel><FormControl><Textarea placeholder="Ex: BP 123, Rue de la Paix, Immeuble B" {...field} className="capitalize" /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <LocationSelector form={form} title="Lieu de résidence actuel" fieldPrefix="residence" />
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Profil & compétences</h3>
                                    <div className="grid gap-4">
                                        <FormField
                                            control={form.control}
                                            name="educationLevel"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Niveau d’études</FormLabel>
                                                    <Popover open={educationPopoverOpen} onOpenChange={setEducationPopoverOpen}>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant="outline" role="combobox" className="w-full justify-between">
                                                                    {field.value ? allEducationLevels.find((level) => level === field.value) : "Sélectionner ou saisir un niveau..."}
                                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                                                            <Command>
                                                                <CommandInput placeholder="Rechercher ou saisir un niveau..." value={educationInputValue} onValueChange={setEducationInputValue} />
                                                                <CommandList>
                                                                    <CommandEmpty>
                                                                        <CommandItem onSelect={() => { form.setValue("educationLevel", educationInputValue); setEducationPopoverOpen(false); }}>
                                                                            Ajouter "{educationInputValue}"
                                                                        </CommandItem>
                                                                    </CommandEmpty>
                                                                    {educationLevels.map((group) => (
                                                                        <CommandGroup key={group.group} heading={group.group}>
                                                                            {group.levels.map((level) => (
                                                                                <CommandItem key={level} value={level} onSelect={() => { form.setValue("educationLevel", level); setEducationPopoverOpen(false); }}>
                                                                                    <Check className={cn("mr-2 h-4 w-4", level === field.value ? "opacity-100" : "opacity-0")} />
                                                                                    {level}
                                                                                </CommandItem>
                                                                            ))}
                                                                        </CommandGroup>
                                                                    ))}
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="profession"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Profession actuelle</FormLabel>
                                                    <Popover open={professionPopoverOpen} onOpenChange={setProfessionPopoverOpen}>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button variant="outline" role="combobox" className="w-full justify-between">
                                                                    {field.value ? allProfessions.find((prof) => prof === field.value) : "Sélectionner ou saisir une profession..."}
                                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                                                            <Command>
                                                                <CommandInput placeholder="Rechercher ou saisir une profession..." value={professionInputValue} onValueChange={setProfessionInputValue}/>
                                                                <CommandList>
                                                                     <CommandEmpty>
                                                                        <CommandItem onSelect={() => { form.setValue("profession", professionInputValue); setProfessionPopoverOpen(false); }}>
                                                                            Ajouter "{professionInputValue}"
                                                                        </CommandItem>
                                                                    </CommandEmpty>
                                                                    {professionsList.map((group) => (
                                                                        <CommandGroup key={group.group} heading={group.group}>
                                                                            {group.professions.map((profession) => (
                                                                                <CommandItem key={profession} value={profession} onSelect={() => { form.setValue("profession", profession); setProfessionPopoverOpen(false); }}>
                                                                                    <Check className={cn("mr-2 h-4 w-4", profession === field.value ? "opacity-100" : "opacity-0")} />
                                                                                    {profession}
                                                                                </CommandItem>
                                                                            ))}
                                                                        </CommandGroup>
                                                                    ))}
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                         <FormField
                                            control={form.control}
                                            name="skills"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Compétences spécifiques utiles</FormLabel>
                                                     <FormDescription>Sélectionnez vos compétences ou ajoutez les vôtres.</FormDescription>
                                                    <Popover open={skillsPopoverOpen} onOpenChange={setSkillsPopoverOpen}>
                                                        <PopoverTrigger asChild>
                                                             <FormControl>
                                                                <Button variant="outline" role="combobox" className="w-full justify-between h-auto">
                                                                    <div className="flex gap-1 flex-wrap">
                                                                        {field.value && field.value.length > 0 ? (
                                                                            field.value.map((skill) => (
                                                                                <Badge variant="secondary" key={skill} className="mr-1 mb-1 capitalize" onClick={(e) => { e.stopPropagation(); handleUnselectSkill(skill); }}>
                                                                                    {skill}
                                                                                    <button className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }} onClick={(e) => { e.stopPropagation(); handleUnselectSkill(skill); }}>
                                                                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                                                                    </button>
                                                                                </Badge>
                                                                            ))
                                                                        ) : (
                                                                            <span className="text-muted-foreground">Sélectionner des compétences...</span>
                                                                        )}
                                                                    </div>
                                                                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                                                            <Command>
                                                                <CommandInput placeholder="Rechercher une compétence..." value={skillsInputValue} onValueChange={setSkillsInputValue} />
                                                                <CommandList>
                                                                    <CommandEmpty>
                                                                        <CommandItem onSelect={() => handleSelectSkill(skillsInputValue)}>
                                                                            Ajouter "{skillsInputValue}"
                                                                        </CommandItem>
                                                                    </CommandEmpty>
                                                                    {skillsList.map((group) => (
                                                                        <CommandGroup key={group.group} heading={group.group}>
                                                                            {group.skills.map((skill) => (
                                                                                <CommandItem key={skill} value={skill} onSelect={() => handleSelectSkill(skill)}>
                                                                                    <Check className={cn("mr-2 h-4 w-4", field.value?.includes(skill) ? "opacity-100" : "opacity-0")} />
                                                                                    {skill}
                                                                                </CommandItem>
                                                                            ))}
                                                                        </CommandGroup>
                                                                    ))}
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        
                                    </div>
                                </div>
                            )}

                             {step === 4 && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold">Engagement & Disponibilité</h3>
                                    <FormField control={form.control} name="volunteerExperience" render={({ field }) => (
                                            <FormItem><FormLabel>Avez-vous déjà été volontaire à la Croix-Rouge Gabonaise ?</FormLabel><FormControl><Textarea placeholder="Si oui, précisez dans quel domaine et en quelle année..." {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField
                                        control={form.control}
                                        name="causes"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>Dans quel(s) domaine(s) souhaiterez-vous servir ?</FormLabel>
                                                <div className="grid grid-cols-2 gap-4">
                                                     {["Secourisme", "Santé", "Education", "Assainissement", "Etude et projet"].map((item) => (
                                                        <FormField
                                                            key={item}
                                                            control={form.control}
                                                            name="causes"
                                                            render={({ field }) => {
                                                                return (
                                                                    <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={field.value?.includes(item)}
                                                                                onCheckedChange={(checked) => {
                                                                                    return checked
                                                                                        ? field.onChange([...(field.value || []), item])
                                                                                        : field.onChange(field.value?.filter((value) => value !== item))
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormLabel className="font-normal">{item}</FormLabel>
                                                                    </FormItem>
                                                                )
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name="assignedCell"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cellule d'intervention souhaitée</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Choisir une cellule d'affectation" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {cells.map(cell => (
                                                            <SelectItem key={cell} value={cell}>{cell}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="availability"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>Disponibilité</FormLabel>
                                                <FormDescription>Quand êtes-vous généralement disponible ?</FormDescription>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {["Jour (semaine)", "Soir (semaine)", "Week-end", "Missions longues"].map((item) => (
                                                        <FormField
                                                            key={item}
                                                            control={form.control}
                                                            name="availability"
                                                            render={({ field }) => {
                                                                return (
                                                                    <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={field.value?.includes(item)}
                                                                                onCheckedChange={(checked) => {
                                                                                    return checked
                                                                                        ? field.onChange([...(field.value || []), item])
                                                                                        : field.onChange(field.value?.filter((value) => value !== item))
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormLabel className="font-normal">{item}</FormLabel>
                                                                    </FormItem>
                                                                )
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            {step === 5 && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-center">Pièces à joindre & Finalisation</h3>
                                    <div className="flex flex-col items-center gap-4">
                                        <FormField
                                            control={form.control}
                                            name="photo"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel htmlFor="photo-upload">Photo d'identité</FormLabel>
                                                    <FormControl>
                                                         <div className="flex items-center gap-4">
                                                            <Avatar className="h-24 w-24">
                                                                <AvatarImage src={photoPreview} alt="Aperçu de la photo" />
                                                                <AvatarFallback>
                                                                    <UserSquare2 className="h-12 w-12 text-muted-foreground" />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <Input id="photo-upload" type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "photo")} className="max-w-xs"/>
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>Facultatif, pour votre profil.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-4 md:w-2/3 mx-auto">
                                        <FormField
                                            control={form.control}
                                            name="idCardFront"
                                            render={({ field }) => (
                                                <FormItem className="text-left">
                                                    <FormLabel>Pièce d’identité (Recto)</FormLabel>
                                                    <FormDescription>Facultatif, vous pourrez la fournir plus tard.</FormDescription>
                                                    <FormControl>
                                                        <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "idCardFront")} className="pt-2"/>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="idCardBack"
                                            render={({ field }) => (
                                                <FormItem className="text-left">
                                                    <FormLabel>Pièce d’identité (Verso)</FormLabel>
                                                     <FormDescription>Facultatif.</FormDescription>
                                                    <FormControl>
                                                        <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "idCardBack")} className="pt-2"/>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="termsAccepted"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-2 pt-4 md:w-2/3 mx-auto">
                                                 <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <div className="space-y-1 leading-none text-left">
                                                    <FormLabel>
                                                        Je certifie l'exactitude des informations et j'accepte les termes de l'engagement volontaire.
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Cette demande d'adhésion ne confère pas systématiquement le statut de membre de la Croix-Rouge Gabonaise.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            {step <= totalSteps && (
                                <div className="flex justify-between mt-8">
                                    <Button type="button" variant="outline" onClick={handlePrevious} disabled={step === 1}>
                                        Précédent
                                    </Button>

                                    {step < totalSteps && (
                                        <Button type="button" onClick={handleNext}>
                                            Suivant
                                        </Button>
                                    )}

                                    {step === totalSteps && (
                                        <Button type="submit" disabled={isSubmitting || !form.getValues('termsAccepted')}>
                                            {isSubmitting ? "Soumission..." : "Soumettre ma candidature"}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </form>
                    </Form>
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
                </CardContent>
            </Card>
        </div>
    )
}
