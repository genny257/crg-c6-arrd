-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('Planifiee', 'En_cours', 'Terminee', 'Annulee');

-- CreateEnum
CREATE TYPE "DonationType" AS ENUM ('Ponctuel', 'Mensuel');

-- CreateEnum
CREATE TYPE "DonationMethod" AS ENUM ('Mobile_Money', 'Carte_Bancaire');

-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('Confirme', 'En_attente', 'Echoue');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('A_venir', 'Termine', 'Annule');

-- CreateEnum
CREATE TYPE "VolunteerStatus" AS ENUM ('En_attente', 'Actif', 'Inactif', 'Rejete');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('masculin', 'feminin');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('celibataire', 'marie', 'divorce', 'veuf');

-- CreateEnum
CREATE TYPE "ArchiveItemType" AS ENUM ('folder', 'document', 'spreadsheet', 'image', 'video', 'audio', 'pdf', 'archive', 'text', 'unknown');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Volunteer" (
    "id" TEXT NOT NULL,
    "matricule" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "birthPlace" TEXT,
    "sex" "Sex",
    "maritalStatus" "MaritalStatus",
    "idCardNumber" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "educationLevel" TEXT,
    "profession" TEXT,
    "skills" TEXT[],
    "volunteerExperience" TEXT,
    "availability" TEXT[],
    "causes" TEXT[],
    "assignedCell" TEXT,
    "residenceProvince" TEXT,
    "residenceDepartement" TEXT,
    "residenceCommuneCanton" TEXT,
    "residenceArrondissement" TEXT,
    "residenceQuartierVillage" TEXT,
    "photo" TEXT,
    "idCardFront" TEXT,
    "idCardBack" TEXT,
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "status" "VolunteerStatus" NOT NULL DEFAULT 'En_attente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "MissionStatus" NOT NULL DEFAULT 'Planifiee',
    "requiredSkills" TEXT[],
    "maxParticipants" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "excerpt" TEXT NOT NULL,
    "image" TEXT,
    "imageHint" TEXT,
    "slug" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "imageHint" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'A_venir',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "DonationType" NOT NULL,
    "method" "DonationMethod" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "DonationStatus" NOT NULL DEFAULT 'En_attente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchiveItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ArchiveItemType" NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArchiveItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MissionParticipants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MissionParticipants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_matricule_key" ON "Volunteer"("matricule");

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_email_key" ON "Volunteer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "_MissionParticipants_B_index" ON "_MissionParticipants"("B");

-- AddForeignKey
ALTER TABLE "ArchiveItem" ADD CONSTRAINT "ArchiveItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ArchiveItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MissionParticipants" ADD CONSTRAINT "_MissionParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MissionParticipants" ADD CONSTRAINT "_MissionParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "Volunteer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

