import express, { Request, Response } from 'express';
import cors from 'cors';

// Local imports
import { config } from './config/env';
import pool, { query } from './config/db';
import router from './routes';

const app = express();
const PORT = config.server.port;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection on startup
(async () => {
  try {
    const result = await query('SELECT NOW() as current_time');
    console.log('✅ Database connection successful. Current time:', result.rows[0].current_time);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
})();

// --- Test routes ---

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).send({
    message: 'SwiftyProtein Backend Service is running!',
    environment: config.server.nodeEnv,
    status: 'Ready for client requests'
  });
});

app.use('/api/v1', router);

// --- Server start ---

app.listen(PORT, () => {
  console.log(`\n✅ Server is running on port ${PORT}`);
  console.log(`📡 Backend URL: ${config.server.backendUrl}`);
  console.log(`🌍 Environment: ${config.server.nodeEnv}`);
  console.log('------------------------------------------');
});