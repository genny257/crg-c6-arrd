import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import missionRoutes from './routes/mission.routes';
import blogRoutes from './routes/blog.routes';
import eventRoutes from './routes/event.routes';
import reportRoutes from './routes/report.routes';
import genericRoutes from './routes/generic.routes';
import donationRoutes from './routes/donation.routes';
import userRoutes from './routes/user.routes';
import sponsorshipRoutes from './routes/sponsorship.routes';
import adminRoutes from './routes/admin.routes';
import { loggingMiddleware } from './middleware/logging';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Trust proxy to get the real IP address of the request
app.set('trust proxy', true);

// --- Middlewares de Journalisation ---
app.use(loggingMiddleware);

// --- Configuration de Swagger ---
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de gestion de la Croix-Rouge Gabonaise',
      version: '1.0.0',
      description: 'Documentation de l\'API pour la gestion des missions, des volontaires, etc.',
    },
    servers: [
      {
        url: `http://localhost:${port}/api`,
        description: 'Serveur de développement',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// --- Middlewares de Sécurité ---
// Ajoute des en-têtes de sécurité HTTP importants
app.use(helmet());

// Limite le nombre de requêtes par IP pour prévenir les attaques par force brute
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limite chaque IP à 100 requêtes par fenêtre de 15 minutes
	standardHeaders: true,
	legacyHeaders: false, 
    message: 'Trop de requêtes depuis cette adresse IP, veuillez réessayer après 15 minutes.',
});
app.use(limiter);

// --- Middlewares Généraux ---
// Activer CORS pour autoriser les requêtes cross-origin
app.use(cors());

// Parser les corps de requête JSON (avec une limite de taille pour la sécurité)
app.use(express.json({ limit: '10kb' }));


// --- Routes ---
// Route pour la documentation de l'API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes de l'API
app.use('/api', missionRoutes);
app.use('/api', blogRoutes);
app.use('/api', eventRoutes);
app.use('/api', reportRoutes);
app.use('/api', genericRoutes);
app.use('/api', donationRoutes);
app.use('/api', userRoutes);
app.use('/api', sponsorshipRoutes);
app.use('/api/admin', adminRoutes);

// Route de base pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Le serveur API est en cours d\'exécution !');
});


// Démarrage du serveur
app.listen(port, () => {
  console.log(`Le serveur fonctionne sur http://localhost:${port}`);
  console.log(`La documentation API est disponible sur http://localhost:${port}/api-docs`);
});
