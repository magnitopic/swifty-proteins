import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
if (!process.env.BACKEND_PORT) {
  throw new Error('BACKEND_PORT environment variable is not defined');
}
const PORT = process.env.BACKEND_PORT;

// Middlewares
app.use(cors());
app.use(express.json());  

// --- Test routes ---

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).send({
    message: 'SwiftyProtein Backend Service is running!',
    environment: process.env.NODE_ENV || 'development',
    status: 'Ready for client requests'
  });
});

// Login route
app.post('/api/auth/login', (req: Request, res: Response) => {
  console.log('Login attempt received:', req.body);

  if (req.body.username && req.body.password) {
    return res.status(200).send({ success: true, message: 'Login simulation successful', token: 'mock-jwt-token' });
  }

  res.status(401).send({ success: false, message: 'Missing username or password' });
});

// --- Server start ---

app.listen(PORT, () => {
  console.log(`\n✅ Server is running on port ${PORT}`);
  console.log('URL is: ', process.env.EXPO_PUBLIC_BACKEND_URL);
  console.log('------------------------------------------');
});