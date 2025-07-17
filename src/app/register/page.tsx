
"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const totalSteps = 5

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({})

  const handleNext = () => setStep((prev) => Math.min(prev + 1, totalSteps))
  const handlePrevious = () => setStep((prev) => Math.max(prev - 1, 1))

  const progress = (step / totalSteps) * 100

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
                            <Textarea id="address" placeholder="Votre adresse complète..." />
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
                             <p className="text-sm text-muted-foreground">Cochez toutes les compétences applicables.</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {["Soins de santé", "Logistique", "Communication", "Langues étrangères", "Psychologie", "Droit humanitaire"].map(skill => (
                                    <div className="flex items-center space-x-2" key={skill}>
                                        <Checkbox id={skill} />
                                        <label htmlFor={skill} className="text-sm font-medium leading-none">{skill}</label>
                                    </div>
                                ))}
                            </div>
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
