import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import missionRoutes from './routes/mission.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Routes
app.use('/api', missionRoutes);

app.get('/', (req, res) => {
  res.send('API Server is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
