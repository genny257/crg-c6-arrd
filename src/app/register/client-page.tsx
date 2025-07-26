
"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Upload,
  X,
  ChevronsUpDown,
  UserSquare2,
  Loader2,
  FileImage,
} from "lucide-react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { RegisterUserInputSchema } from '@/ai/schemas/register-user-schema';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { locations, cells as allCells } from '@/lib/locations';

const totalSteps = 5;

type FormValues = z.infer<typeof RegisterUserInputSchema>;

const allIdTypes = [
    "CNI",
    "RECEPICE CNI",
    "CNIE",
    "RECEPICE CNIE",
    "PASSPORT",
    "RECEPICE PASSPORT",
    "CARTE DE SÉJOURS",
    "RECEPICE CARTE DE SEJOURS",
    "CNAMGS",
    "CARTE D'IDENTITÉ SCOLAIRE",
];

const foreignIdTypes = allIdTypes.filter(type => type.includes("PASSPORT") || type.includes("CARTE DE SÉJOURS") || type.includes("RECEPICE CARTE DE SEJOURS"));

const ComboboxSelector = ({
  form,
  fieldName,
  label,
  placeholder,
  options,
  onValueChange,
  disabled = false,
}: {
  form: any;
  fieldName: string;
  label: string;
  placeholder: string;
  options: string[];
  onValueChange: (value: string) => void;
  disabled?: boolean;
}) => {
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={disabled}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value || placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
              <Command>
                <CommandInput
                  placeholder={`Rechercher ${label.toLowerCase()}...`}
                  value={inputValue}
                  onValueChange={setInputValue}
                />
                <CommandList>
                  <CommandEmpty>
                    <CommandItem
                        onSelect={() => {
                            onValueChange(inputValue);
                            setPopoverOpen(false);
                        }}
                        >
                        Ajouter &quot;{inputValue}&quot;
                    </CommandItem>
                  </CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        value={option}
                        key={option}
                        onSelect={() => {
                          onValueChange(option);
                          setPopoverOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            option === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {option}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};


const LocationSelector = ({
  form,
  title,
  fieldPrefix,
}: {
  form: any;
  title: string;
  fieldPrefix: string;
}) => {
  const selectedProvince = form.watch(`${fieldPrefix}.province`);
  const selectedDepartement = form.watch(`${fieldPrefix}.departement`);
  const selectedCommune = form.watch(`${fieldPrefix}.communeCanton`);
  const selectedArrondissement = form.watch(`${fieldPrefix}.arrondissement`);

  const provinces = Object.keys(locations);
  const departements = selectedProvince ? Object.keys(locations[selectedProvince]) : [];
  const communes = selectedDepartement ? Object.keys(locations[selectedProvince][selectedDepartement].communes) : [];
  const arrondissements = selectedCommune && locations[selectedProvince]?.[selectedDepartement]?.communes?.[selectedCommune]?.arrondissements
    ? Object.keys(locations[selectedProvince][selectedDepartement].communes[selectedCommune].arrondissements)
    : [];
  const quartiers = selectedArrondissement && locations[selectedProvince]?.[selectedDepartement]?.communes?.[selectedCommune]?.arrondissements?.[selectedArrondissement]
    ? locations[selectedProvince][selectedDepartement].communes[selectedCommune].arrondissements[selectedArrondissement]
    : [];

  return (
    <div className="grid gap-2 p-4 border rounded-lg">
      <h4 className="font-semibold">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ComboboxSelector
          form={form}
          fieldName={`${fieldPrefix}.province`}
          label="Province"
          placeholder="Sélectionner une province"
          options={provinces}
          onValueChange={(value) => {
            form.setValue(`${fieldPrefix}.province`, value);
            form.setValue(`${fieldPrefix}.departement`, "");
            form.setValue(`${fieldPrefix}.communeCanton`, "");
            form.setValue(`${fieldPrefix}.arrondissement`, "");
            form.setValue(`${fieldPrefix}.quartierVillage`, "");
          }}
        />
        <ComboboxSelector
          form={form}
          fieldName={`${fieldPrefix}.departement`}
          label="Département"
          placeholder="Sélectionner un département"
          options={departements}
          disabled={!selectedProvince}
          onValueChange={(value) => {
            form.setValue(`${fieldPrefix}.departement`, value);
            form.setValue(`${fieldPrefix}.communeCanton`, "");
            form.setValue(`${fieldPrefix}.arrondissement`, "");
            form.setValue(`${fieldPrefix}.quartierVillage`, "");
          }}
        />
        <ComboboxSelector
          form={form}
          fieldName={`${fieldPrefix}.communeCanton`}
          label="Commune ou Canton"
          placeholder="Sélectionner une commune/canton"
          options={communes}
          disabled={!selectedDepartement}
          onValueChange={(value) => {
            form.setValue(`${fieldPrefix}.communeCanton`, value);
            form.setValue(`${fieldPrefix}.arrondissement`, "");
            form.setValue(`${fieldPrefix}.quartierVillage`, "");
          }}
        />
        <ComboboxSelector
          form={form}
          fieldName={`${fieldPrefix}.arrondissement`}
          label="Arrondissement"
          placeholder="Sélectionner un arrondissement"
          options={arrondissements}
          disabled={!selectedCommune}
          onValueChange={(value) => {
            form.setValue(`${fieldPrefix}.arrondissement`, value);
            form.setValue(`${fieldPrefix}.quartierVillage`, "");
          }}
        />
        <div className="md:col-span-2">
            <ComboboxSelector
            form={form}
            fieldName={`${fieldPrefix}.quartierVillage`}
            label="Quartier ou Village"
            placeholder="Sélectionner un quartier/village"
            options={quartiers}
            disabled={!selectedArrondissement}
            onValueChange={(value) => {
                form.setValue(`${fieldPrefix}.quartierVillage`, value);
            }}
            />
        </div>
      </div>
    </div>
  );
};

type UploadableField = "photo" | "idCardFront" | "idCardBack";

interface ClientPageProps {
    nationalities: string[];
    educationLevels: string[];
    professions: string[];
    skills: string[];
}

export function RegisterClientPage({
    nationalities: initialNationalities,
    educationLevels: initialEducationLevels,
    professions: initialProfessions,
    skills: initialSkills
}: ClientPageProps) {
  const [step, setStep] = React.useState(1);
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [uploading, setUploading] = React.useState<
    Partial<Record<UploadableField, boolean>>
  >({});
  
  const [nationalities, setNationalities] = React.useState(initialNationalities);
  const [educationLevels, setEducationLevels] = React.useState(initialEducationLevels);
  const [professions, setProfessions] = React.useState(initialProfessions);
  const [skills, setSkills] = React.useState(initialSkills);

  const form = useForm<FormValues>({
    resolver: zodResolver(RegisterUserInputSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      nationality: "Gabonaise",
      birthDate: "",
      birthPlace: "",
      sex: "masculin",
      maritalStatus: "célibataire",
      idType: "",
      idNumber: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      educationLevel: "",
      profession: "",
      skills: [],
      volunteerExperience: "",
      availability: [],
      causes: [],
      assignedCell: "",
      residence: {
        province: "",
        departement: "",
        communeCanton: "",
        arrondissement: "",
        quartierVillage: "",
      },
      photo: "",
      idCardFront: "",
      idCardBack: "",
      termsAccepted: true,
    },
  });

  const [skillsPopoverOpen, setSkillsPopoverOpen] = React.useState(false);
  const [skillsInputValue, setSkillsInputValue] = React.useState("");

  const [educationPopoverOpen, setEducationPopoverOpen] =
    React.useState(false);
  const [educationInputValue, setEducationInputValue] = React.useState("");

  const [professionPopoverOpen, setProfessionPopoverOpen] =
    React.useState(false);
  const [professionInputValue, setProfessionInputValue] = React.useState("");
  
  const [nationalityPopoverOpen, setNationalityPopoverOpen] = React.useState(false);
  const [nationalityInputValue, setNationalityInputValue] = React.useState("");
  
  const [otherCause, setOtherCause] = React.useState("");
  const causes = form.watch('causes');
  const otherCauseChecked = causes?.includes('Autre') ?? false;

  const handleNext = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const handlePrevious = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: UploadableField
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading((prev) => ({ ...prev, [fieldName]: true }));

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }
      
      form.setValue(fieldName, result.url);
      toast({
        title: "Fichier téléversé",
        description: "Le fichier a été ajouté avec succès.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Erreur de téléversement",
        description:
          "Le fichier n'a pas pu être envoyé. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setUploading((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    const finalCauses = data.causes?.filter((c: string) => c !== 'Autre');
    if (otherCauseChecked && otherCause) {
        finalCauses?.push(otherCause);
    }
    const finalData = { ...data, causes: finalCauses };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "L'inscription a échoué.");
      }
      
      toast({
        title: "Inscription Réussie",
        description: "Votre compte a été créé. Vous pouvez maintenant vous connecter.",
      });
      
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: finalData.email,
        password: finalData.password,
      });

      if (signInResult?.error) {
         toast({
          title: "Connexion automatique échouée",
          description: "Votre compte a été créé, mais la connexion a échoué. Veuillez vous connecter manuellement.",
          variant: "destructive",
        });
        router.push('/login');
      } else {
        router.push('/dashboard');
      }

    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (step / totalSteps) * 100;

  const handleUnselectSkill = (skill: string) => {
    const currentSkills = form.getValues("skills") || [];
    form.setValue(
      "skills",
      currentSkills.filter((s: string) => s !== skill)
    );
  };

  const handleSelectSkill = (skill: string) => {
    const currentSkills = form.getValues("skills") || [];
    if (!currentSkills.includes(skill)) {
      form.setValue("skills", [...currentSkills, skill]);
    }
    setSkillsInputValue("");
    setSkillsPopoverOpen(true);
  };

  const photoPreview = form.watch("photo");
  const idCardFrontPreview = form.watch("idCardFront");
  const idCardBackPreview = form.watch("idCardBack");
  const selectedNationality = form.watch("nationality");
  const selectedIdType = form.watch("idType");
  const availableIdTypes = selectedNationality === 'Gabonaise' ? allIdTypes : foreignIdTypes;

  const capitalizeFirstLetter = (string: string) => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  const capitalizeFirstLetterLowercaseRest = (string: string) => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  if (step > totalSteps) {
    return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <div className="p-4 bg-green-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                        <Check className="h-12 w-12 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold font-headline mt-4">Inscription terminée !</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Merci pour votre engagement. Votre candidature a été soumise
                        avec succès. Nous l'examinerons attentivement et vous
                        contacterons très prochainement.
                    </p>
                    <Button asChild className="mt-6">
                        <Link href="/dashboard">Accéder à mon espace</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl relative">
        <Link
          href="/"
          className="absolute top-4 left-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Retour à l'accueil</span>
        </Link>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline pt-8">
            Devenir Volontaire
          </CardTitle>
          <CardDescription>
            Rejoignez nos équipes en quelques étapes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Étape {step} sur {totalSteps}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Informations personnelles
                  </h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Votre prénom"
                                {...field}
                                onChange={e => field.onChange(capitalizeFirstLetterLowercaseRest(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Votre nom"
                                {...field}
                                 onChange={e => field.onChange(e.target.value.toUpperCase())}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                     <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Nationalité</FormLabel>
                                <Popover open={nationalityPopoverOpen} onOpenChange={setNationalityPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                                                {field.value || "Sélectionner une nationalité"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                                        <Command>
                                            <CommandInput
                                              placeholder="Rechercher une nationalité..."
                                              value={nationalityInputValue}
                                              onValueChange={setNationalityInputValue}
                                            />
                                            <CommandList>
                                                <CommandEmpty>
                                                    <CommandItem onSelect={() => {
                                                        form.setValue("nationality", nationalityInputValue);
                                                        setNationalityPopoverOpen(false);
                                                    }}>
                                                        Ajouter "{nationalityInputValue}"
                                                    </CommandItem>
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {nationalities.map((country) => (
                                                        <CommandItem
                                                            value={country}
                                                            key={country}
                                                            onSelect={() => {
                                                                form.setValue("nationality", country);
                                                                setNationalityPopoverOpen(false);
                                                            }}
                                                        >
                                                            <Check className={cn("mr-2 h-4 w-4", country === field.value ? "opacity-100" : "opacity-0")} />
                                                            {country}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date de naissance</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="birthPlace"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lieu de naissance</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Lieu de naissance"
                                {...field}
                                onChange={e => field.onChange(capitalizeFirstLetterLowercaseRest(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sex"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sexe</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex items-center space-x-4"
                              >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="masculin" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Masculin
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="féminin" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Féminin
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="maritalStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Situation de famille</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="célibataire">
                                  Célibataire
                                </SelectItem>
                                <SelectItem value="marié(e)">Marié(e)</SelectItem>
                                <SelectItem value="divorcé(e)">
                                  Divorcé(e)
                                </SelectItem>
                                <SelectItem value="veuf(ve)">Veuf(ve)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <FormField
                          control={form.control}
                          name="idType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type de pièce d'identité</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner une pièce" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {availableIdTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {selectedIdType && (
                           <FormField
                            control={form.control}
                            name="idNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Numéro de la pièce</FormLabel>
                                <FormControl>
                                  <Input placeholder="Numéro de votre pièce" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Coordonnées & Résidence
                  </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="Numéro de téléphone"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse e-mail</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="nom@exemple.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="********"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmer le mot de passe</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="********"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Adresse complète (Boîte Postale, Rue, Immeuble, etc.)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ex: BP 123, Rue de la Paix, Immeuble B"
                            {...field}
                            onChange={e => field.onChange(capitalizeFirstLetter(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <LocationSelector
                    form={form}
                    title="Lieu de résidence actuel"
                    fieldPrefix="residence"
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Profil & compétences
                  </h3>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="educationLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Niveau d’études</FormLabel>
                          <Popover
                            open={educationPopoverOpen}
                            onOpenChange={setEducationPopoverOpen}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-full justify-between"
                                >
                                  {field.value || "Sélectionner ou saisir un niveau..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Rechercher ou saisir un niveau..."
                                  value={educationInputValue}
                                  onValueChange={setEducationInputValue}
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    <CommandItem
                                      onSelect={() => {
                                        form.setValue(
                                          "educationLevel",
                                          educationInputValue
                                        );
                                        setEducationLevels(prev => [...prev, educationInputValue]);
                                        setEducationPopoverOpen(false);
                                      }}
                                    >
                                      Ajouter "{educationInputValue}"
                                    </CommandItem>
                                  </CommandEmpty>
                                  <CommandGroup>
                                      {educationLevels.map((level) => (
                                        <CommandItem
                                          key={level}
                                          value={level}
                                          onSelect={() => {
                                            form.setValue(
                                              "educationLevel",
                                              level
                                            );
                                            setEducationPopoverOpen(false);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              level === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {level}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
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
                          <Popover
                            open={professionPopoverOpen}
                            onOpenChange={setProfessionPopoverOpen}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-full justify-between"
                                >
                                  {field.value || "Sélectionner ou saisir une profession..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Rechercher ou saisir une profession..."
                                  value={professionInputValue}
                                  onValueChange={setProfessionInputValue}
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    <CommandItem
                                      onSelect={() => {
                                        form.setValue(
                                          "profession",
                                          professionInputValue
                                        );
                                        setProfessions(prev => [...prev, professionInputValue]);
                                        setProfessionPopoverOpen(false);
                                      }}
                                    >
                                      Ajouter "{professionInputValue}"
                                    </CommandItem>
                                  </CommandEmpty>
                                  <CommandGroup>
                                      {professions.map((profession) => (
                                        <CommandItem
                                          key={profession}
                                          value={profession}
                                          onSelect={() => {
                                            form.setValue(
                                              "profession",
                                              profession
                                            );
                                            setProfessionPopoverOpen(false);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              profession === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {profession}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
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
                          <FormDescription>
                            Sélectionnez vos compétences ou ajoutez les vôtres.
                          </FormDescription>
                          <Popover
                            open={skillsPopoverOpen}
                            onOpenChange={setSkillsPopoverOpen}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-full justify-between h-auto"
                                >
                                  <div className="flex gap-1 flex-wrap">
                                    {field.value && field.value.length > 0 ? (
                                      field.value.map((skill) => (
                                        <Badge
                                          variant="secondary"
                                          key={skill}
                                          className="mr-1 mb-1 capitalize"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleUnselectSkill(skill);
                                          }}
                                        >
                                          {skill}
                                          <button
                                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            onMouseDown={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                            }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleUnselectSkill(skill);
                                            }}
                                          >
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                          </button>
                                        </Badge>
                                      ))
                                    ) : (
                                      <span className="text-muted-foreground">
                                        Sélectionner des compétences...
                                      </span>
                                    )}
                                  </div>
                                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Rechercher une compétence..."
                                  value={skillsInputValue}
                                  onValueChange={setSkillsInputValue}
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    <CommandItem
                                      onSelect={() => {
                                        handleSelectSkill(skillsInputValue);
                                        setSkills(prev => [...prev, skillsInputValue]);
                                      }}
                                    >
                                      Ajouter "{skillsInputValue}"
                                    </CommandItem>
                                  </CommandEmpty>
                                  <CommandGroup>
                                      {skills.map((skill) => (
                                        <CommandItem
                                          key={skill}
                                          value={skill}
                                          onSelect={() =>
                                            handleSelectSkill(skill)
                                          }
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              field.value?.includes(skill)
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {skill}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
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
                  <h3 className="text-lg font-semibold">
                    Engagement & Disponibilité
                  </h3>
                  <FormField
                    control={form.control}
                    name="volunteerExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Avez-vous déjà été volontaire à la Croix-Rouge
                          Gabonaise ?
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Si oui, précisez dans quel domaine et en quelle année..."
                            {...field}
                            onChange={(e) => field.onChange(capitalizeFirstLetter(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 <FormField
                    control={form.control}
                    name="causes"
                    render={() => (
                      <FormItem>
                        <FormLabel>Dans quel(s) domaine(s) souhaiterez-vous servir ?</FormLabel>
                        <div className="grid grid-cols-2 gap-4">
                          {["Secourisme", "Santé", "Education", "Assainissement", "Etude et projet", "Autre"].map((item) => (
                            <FormField
                              key={item}
                              control={form.control}
                              name="causes"
                              render={({ field }) => (
                                <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item])
                                          : field.onChange(field.value?.filter((value: string) => value !== item));
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{item}</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        {otherCauseChecked && (
                          <Input
                            placeholder="Veuillez préciser"
                            className="mt-2"
                            value={otherCause}
                            onChange={(e) => setOtherCause(e.target.value)}
                          />
                        )}
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir une cellule d'affectation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {allCells.map((cell) => (
                              <SelectItem key={cell} value={cell}>
                                {cell}
                              </SelectItem>
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
                        <FormDescription>
                          Quand êtes-vous généralement disponible ?
                        </FormDescription>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            "Jour (semaine)",
                            "Soir (semaine)",
                            "Week-end",
                            "Missions longues",
                          ].map((item) => (
                            <FormField
                              key={item}
                              control={form.control}
                              name="availability"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...(field.value || []),
                                                item,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value: string) => value !== item
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item}
                                    </FormLabel>
                                  </FormItem>
                                );
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
                  <h3 className="text-lg font-semibold text-center">
                    Pièces à joindre & Finalisation
                  </h3>

                  <div className="flex flex-col items-center gap-4">
                    <FormField
                      control={form.control}
                      name="photo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="photo-upload">
                            Photo d'identité
                          </FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-4">
                              <Avatar className="h-24 w-24">
                                <AvatarImage
                                  src={photoPreview}
                                  alt="Aperçu de la photo"
                                />
                                <AvatarFallback>
                                  <UserSquare2 className="h-12 w-12 text-muted-foreground" />
                                </AvatarFallback>
                              </Avatar>
                              <Button asChild variant="outline">
                                <label
                                  htmlFor="photo-upload"
                                  className="cursor-pointer"
                                >
                                  {uploading.photo ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Upload className="mr-2 h-4 w-4" />}
                                  Choisir un fichier
                                  <Input
                                    id="photo-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleFileUpload(e, "photo")
                                    }
                                    className="hidden"
                                    disabled={uploading.photo}
                                  />
                                </label>
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Facultatif, pour votre profil.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="idCardFront"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                          <FormLabel>Pièce d’identité (Recto)</FormLabel>
                          <FormControl>
                            {idCardFrontPreview ? (
                              <img
                                src={idCardFrontPreview}
                                alt="Aperçu Recto CNI"
                                className="w-full h-32 object-contain rounded-md"
                              />
                            ) : (
                              <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center">
                                <FileImage className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                          </FormControl>
                          <Button asChild variant="outline" size="sm">
                            <label
                              htmlFor="idCardFront-upload"
                              className="cursor-pointer"
                            >
                              {uploading.idCardFront ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Upload className="mr-2 h-4 w-4" />}
                              Téléverser Recto
                              <Input
                                id="idCardFront-upload"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleFileUpload(e, "idCardFront")
                                }
                                className="hidden"
                                disabled={uploading.idCardFront}
                              />
                            </label>
                          </Button>
                          <FormDescription>Facultatif</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="idCardBack"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                          <FormLabel>Pièce d’identité (Verso)</FormLabel>
                          <FormControl>
                            {idCardBackPreview ? (
                              <img
                                src={idCardBackPreview}
                                alt="Aperçu Verso CNI"
                                className="w-full h-32 object-contain rounded-md"
                              />
                            ) : (
                              <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center">
                                <FileImage className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                          </FormControl>
                          <Button asChild variant="outline" size="sm">
                            <label
                              htmlFor="idCardBack-upload"
                              className="cursor-pointer"
                            >
                             {uploading.idCardBack ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Upload className="mr-2 h-4 w-4" />}
                              Téléverser Verso
                              <Input
                                id="idCardBack-upload"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleFileUpload(e, "idCardBack")
                                }
                                className="hidden"
                                disabled={uploading.idCardBack}
                              />
                            </label>
                          </Button>
                          <FormDescription>Facultatif</FormDescription>
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
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none text-left">
                          <FormLabel>
                            Je certifie l'exactitude des informations et
                            j'accepte les termes de l'engagement volontaire.
                          </FormLabel>
                          <FormDescription>
                            Cette demande d'adhésion ne confère pas
                            systématiquement le statut de membre de la
                            Croix-Rouge Gabonaise.
                          </FormDescription>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={step === 1}
                  >
                    Précédent
                  </Button>

                  {step < totalSteps && (
                    <Button type="button" onClick={handleNext}>
                      Suivant
                    </Button>
                  )}

                  {step === totalSteps && (
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        Object.values(uploading).some(Boolean) ||
                        !form.getValues("termsAccepted")
                      }
                    >
                      {isSubmitting
                        ? "Soumission..."
                        : "Soumettre ma candidature"}
                    </Button>
                  )}
                </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
