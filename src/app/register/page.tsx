
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
import { locations, cells, skillsList, professionsList, educationLevels } from "@/lib/locations"
import { useToast } from "@/hooks/use-toast"
import { registerUser } from "@/ai/flows/register-flow"
import { RegisterUserInputSchema } from "@/ai/schemas/register-user-schema"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const totalSteps = 5

const allEducationLevels = educationLevels.flatMap(group => group.levels);
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
            const result = await registerUser(data);
            if (result.success) {
                toast({
                    title: "Candidature Soumise",
                    description: "Votre inscription a été envoyée avec succès.",
                });
                setStep((prev) => prev + 1);
            } else {
                 toast({
                    title: "Erreur de soumission",
                    description: result.message || "Une erreur inconnue est survenue.",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Erreur",
                description: error.message || "Une erreur est survenue lors de la soumission. Veuillez réessayer.",
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
