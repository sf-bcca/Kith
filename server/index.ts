import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { pool } from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.get('/api/health', async (req: Request, res: Response) => {
  try {
    await pool.query('SELECT NOW()');
    res.status(200).json({ status: 'ok', database: 'connected' });
  } catch (err: any) {
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      message: err.message 
    });
  }
});

// Start server if not imported
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;
