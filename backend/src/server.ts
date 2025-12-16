// IMPORTANT: Load environment variables first
import { config } from './config/env';

import express, { Request, Response } from 'express';
import cors from 'cors';
import pool, { query } from './config/db';

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

// Login route
app.post('/api/auth/login', (req: Request, res: Response) => {
  console.log('Login attempt received:', req.body);

  if (req.body.username && req.body.password) {
    return res.status(200).send({
      success: true,
      message: 'Login simulation successful',
      token: 'mock-jwt-token'
    });
  }

  res.status(401).send({ success: false, message: 'Missing username or password' });
});

// --- Server start ---

app.listen(PORT, () => {
  console.log(`\n✅ Server is running on port ${PORT}`);
  console.log(`📡 Backend URL: ${config.server.backendUrl}`);
  console.log(`🌍 Environment: ${config.server.nodeEnv}`);
  console.log('------------------------------------------');
});