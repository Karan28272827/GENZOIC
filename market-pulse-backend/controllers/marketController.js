const marketService = require('../services/marketService');

const getMarketPulse = async (req, res) => {
  try {
    const { ticker } = req.params;
    const analysis = await marketService.analyzeMarketTrend(ticker);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMarketPulse };
