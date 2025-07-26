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
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const mission_routes_1 = __importDefault(require("./routes/mission.routes"));
const blog_routes_1 = __importDefault(require("./routes/blog.routes"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const generic_routes_1 = __importDefault(require("./routes/generic.routes"));
const donation_routes_1 = __importDefault(require("./routes/donation.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const sponsorship_routes_1 = __importDefault(require("./routes/sponsorship.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const volunteer_routes_1 = __importDefault(require("./routes/volunteer.routes"));
const team_routes_1 = __importDefault(require("./routes/team.routes"));
const genkit_routes_1 = __importDefault(require("./routes/genkit.routes"));
const logging_1 = require("./middleware/logging");
// Charger les variables d'environnement
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Trust proxy to get the real IP address of the request
app.set('trust proxy', true);
// --- Middlewares Généraux ---
// Configuration CORS flexible pour le développement. DOIT être en premier.
app.use((0, cors_1.default)());
// Parser les corps de requête JSON (avec une limite de taille pour la sécurité)
app.use(express_1.default.json({ limit: '50mb' }));
// --- Middlewares de Journalisation ---
app.use(logging_1.loggingMiddleware);
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
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
                bearerAuth: []
            }]
    },
    apis: ['./src/routes/*.ts'],
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
// --- Middlewares de Sécurité ---
// Ajoute des en-têtes de sécurité HTTP importants
app.use((0, helmet_1.default)());
// Limite le nombre de requêtes par IP pour prévenir les attaques par force brute
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes par fenêtre de 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Trop de requêtes depuis cette adresse IP, veuillez réessayer après 15 minutes.',
});
app.use(limiter);
// --- Routes ---
// Route pour la documentation de l'API
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// Routes de l'API
app.use('/api', mission_routes_1.default);
app.use('/api', blog_routes_1.default);
app.use('/api', event_routes_1.default);
app.use('/api', report_routes_1.default);
app.use('/api', generic_routes_1.default);
app.use('/api', donation_routes_1.default);
app.use('/api', user_routes_1.default);
app.use('/api', sponsorship_routes_1.default);
app.use('/api', team_routes_1.default);
app.use('/api', admin_routes_1.default);
app.use('/api', volunteer_routes_1.default);
app.use('/api/genkit', genkit_routes_1.default);
// Route de base pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
    res.send('Le serveur API est en cours d\'exécution !');
});
// Démarrage du serveur
app.listen(port, () => {
    console.log(`Le serveur fonctionne sur http://localhost:${port}`);
    console.log(`La documentation API est disponible sur http://localhost:${port}/api-docs`);
});
