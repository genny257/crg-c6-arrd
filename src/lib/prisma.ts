// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Déclare une variable globale pour stocker le client Prisma
declare global {
  var prisma: PrismaClient | undefined;
}

// Crée une instance unique du client Prisma
// Si `global.prisma` existe, on le réutilise, sinon on en crée un nouveau.
// En production, `global.prisma` n'existera pas à chaque rechargement, 
// mais en développement, cela évite de créer de multiples instances à cause du hot-reloading de Next.js.
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;
