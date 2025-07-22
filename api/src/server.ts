import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import missionRoutes from './routes/mission.routes';
import blogRoutes from './routes/blog.routes';
import eventRoutes from './routes/event.routes';
import reportRoutes from './routes/report.routes';
import genericRoutes from './routes/generic.routes';
import donationRoutes from './routes/donation.routes';
import userRoutes from './routes/user.routes';

// Charger les variables d'environnement
dotenv.config();


const app = express();
const port = process.env.PORT || 3001;

// --- Configuration de Swagger ---
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de gestion de missions',
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
  // Chemin vers les fichiers contenant les annotations Swagger
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
// --- Fin de la configuration de Swagger ---


// --- Middlewares ---
// Activer CORS pour autoriser les requêtes cross-origin
app.use(cors());
// Parser les corps de requête JSON
app.use(express.json());


// --- Routes ---
// Route pour la documentation de l'API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes de l'API pour les missions
app.use('/api', missionRoutes);
app.use('/api', blogRoutes);
app.use('/api', eventRoutes);
app.use('/api', reportRoutes);
app.use('/api', genericRoutes);
app.use('/api', donationRoutes);
app.use('/api', userRoutes);

// Route de base pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Le serveur API est en cours d\'exécution !');
});


// Démarrage du serveur
app.listen(port, () => {
  console.log(`Le serveur fonctionne sur http://localhost:${port}`);
  console.log(`La documentation API est disponible sur http://localhost:${port}/api-docs`);
});
