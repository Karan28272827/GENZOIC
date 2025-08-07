const express = require('express');
const router = express.Router();
const { analyzeMarketPulse } = require('../services/marketService');

router.get('/market-pulse', async (req, res) => {
  const { ticker } = req.query;
  if (!ticker) {
    return res.status(400).json({ error: 'Ticker is required as a query parameter.' });
  }

  try {
    const result = await analyzeMarketPulse(ticker.toUpperCase());
    res.json(result);
  } catch (err) {
    console.error(err); // 👍 Good: logs error to console
    res.status(500).json({ error: 'Failed to analyze market pulse.' });
  }
});

module.exports = router;

