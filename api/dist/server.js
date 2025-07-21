"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const mission_routes_1 = __importDefault(require("./routes/mission.routes"));
// Charger les variables d'environnement
dotenv_1.default.config();
const app = (0, express_1.default)();
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
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
// --- Fin de la configuration de Swagger ---
// --- Middlewares ---
// Activer CORS pour autoriser les requêtes cross-origin
app.use((0, cors_1.default)());
// Parser les corps de requête JSON
app.use(express_1.default.json());
// --- Routes ---
// Route pour la documentation de l'API
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// Routes de l'API pour les missions
app.use('/api', mission_routes_1.default);
// Route de base pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
    res.send('Le serveur API est en cours d\'exécution !');
});
// Démarrage du serveur
app.listen(port, () => {
    console.log(`Le serveur fonctionne sur http://localhost:${port}`);
    console.log(`La documentation API est disponible sur http://localhost:${port}/api-docs`);
});
