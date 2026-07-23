import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import logger from './logger';
import { startScheduler } from './scheduler';
import routes from './routes';

const app = express();
const port = parseInt(process.env.PORT || '3000');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

async function main() {
  try {
    logger.info('[SERVER] Initializing Auto-Scout Bot...');
    startScheduler();
    app.listen(port, () => {
      logger.info(`[SERVER] Running on http://localhost:${port}`);
    });
  } catch (err) {
    logger.error('[SERVER] Fatal error:', err);
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  logger.info('[SERVER] Shutting down...');
  process.exit(0);
});

main();
