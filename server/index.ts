require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('./logger.js').default;
const { startScheduler } = require('./scheduler.js');
const routes = require('./routes.js').default;

const app = express();
const port = parseInt(process.env.PORT || '3000');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from dist/client (React frontend)
const clientPath = path.join(__dirname, '..');
app.use(express.static(clientPath));

// Fallback to index.html for React Router (all non-API routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
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

module.exports = app;
