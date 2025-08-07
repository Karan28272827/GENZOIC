const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const app = require('./app');
const cors = require('cors');

// Load environment variables from the root-level .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Log important env variables for debugging
console.log("🔑 ALPHA_VANTAGE_API_KEY:", process.env.ALPHA_VANTAGE_API_KEY);
console.log("🔑 NEWS_API_KEY:", process.env.NEWS_API_KEY);
console.log("🔑 GEMINI_API_KEY:", process.env.GEMINI_API_KEY);

// Enable CORS
app.use(cors());
// Validate if keys are loaded
if (!process.env.NEWS_API_KEY || !process.env.ALPHA_VANTAGE_API_KEY || !process.env.GEMINI_API_KEY) {
  console.error('❌ One or more required environment variables are missing.');
  process.exit(1);
}

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
