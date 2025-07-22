-- CreateEnum
CREATE TYPE "SponsorshipStatus" AS ENUM ('Pending', 'Contacted', 'InProgress', 'Resolved', 'Rejected');

-- CreateTable
CREATE TABLE "CorporateSponsorship" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "status" "SponsorshipStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CorporateSponsorship_pkey" PRIMARY KEY ("id")
);
