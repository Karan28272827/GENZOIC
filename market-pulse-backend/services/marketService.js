// // backend/services/marketService.js

// const yahooFinance = require('yahoo-finance2').default;
// const fetch = require('node-fetch');

// // --- Helpers ---
// const calculateMomentumScore = (returns) => {
//   if (!returns.length) return 0;
//   const sum = returns.reduce((acc, r) => acc + r, 0);
//   return +(sum / returns.length).toFixed(2);
// };

// const fetchMomentum = async (ticker) => {
//   const history = await yahooFinance.historical(ticker, {
//     period1: '10d',
//     interval: '1d'
//   });

//   if (!history || history.length < 6) return { returns: [], score: 0 };

//   const returns = [];
//   for (let i = 1; i <= 5; i++) {
//     const prev = history[history.length - 1 - i].close;
//     const curr = history[history.length - i].close;
//     returns.push(+((curr - prev) / prev * 100).toFixed(2));
//   }

//   return {
//     returns,
//     score: calculateMomentumScore(returns)
//   };
// };

// const fetchNews = async (ticker) => {
//   const apiKey = process.env.NEWS_API_KEY;
//   const url = `https://newsapi.org/v2/everything?q=${ticker}&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;
//   const res = await fetch(url);
//   const data = await res.json();

//   if (!data.articles) return [];

//   return data.articles.map(a => ({
//     title: a.title,
//     description: a.description,
//     url: a.url
//   }));
// };

// const analyzeWithLLM = async (ticker, momentum, news) => {
//   const prompt = `Given the following stock momentum and news headlines, decide if the stock pulse is bullish, bearish or neutral, and explain why.\n\nTicker: ${ticker}\n\nMomentum Returns (last 5 days): ${momentum.returns.join(', ')}\nMomentum Score: ${momentum.score}\n\nNews Headlines:\n${news.map((n, i) => `${i + 1}. ${n.title} - ${n.description}`).join('\n')}\n\nRespond in JSON with fields 'pulse' and 'explanation'.`;

//   const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GEMINI_API_KEY, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
//   });

//   const result = await geminiResponse.json();
//   const raw = result?.candidates?.[0]?.content?.parts?.[0]?.text;
//   try {
//     return JSON.parse(raw);
//   } catch {
//     return { pulse: 'neutral', explanation: 'LLM response could not be parsed.' };
//   }
// };

// const analyzeMarketPulse = async (ticker) => {
//   const [momentum, news] = await Promise.all([
//     fetchMomentum(ticker),
//     fetchNews(ticker)
//   ]);

//   const llmResult = await analyzeWithLLM(ticker, momentum, news);

//   return {
//     ticker,
//     as_of: new Date().toISOString().split('T')[0],
//     momentum,
//     news,
//     pulse: llmResult.pulse,
//     explanation: llmResult.explanation
//   };
// };

// module.exports = {
//   analyzeMarketPulse
// };


const axios = require('axios');

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// async function fetchPriceMomentum(ticker) {
//   try {
//     const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=compact&apikey=${ALPHA_VANTAGE_API_KEY}`;
//     const response = await axios.get(url);
//     const timeSeries = response.data['Time Series (Daily)'];

//     if (!timeSeries) throw new Error('Invalid data format');

//     const dates = Object.keys(timeSeries).sort((a, b) => new Date(b) - new Date(a));
//     const last5 = dates.slice(0, 6); // Need 6 points to calculate 5 returns

//     const returns = [];
//     for (let i = 0; i < 5; i++) {
//       const closeToday = parseFloat(timeSeries[last5[i]]['4. close']);
//       const closeYesterday = parseFloat(timeSeries[last5[i + 1]]['4. close']);
//       const dailyReturn = ((closeToday - closeYesterday) / closeYesterday) * 100;
//       returns.push(+dailyReturn.toFixed(2)); // Keep as number
//     }

//     const score = +returns.reduce((a, b) => a + b, 0).toFixed(2);
//     return { returns, score };
//   } catch (err) {
//     console.error('Error fetching price momentum:', err.message);
//     return null;
//   }
// }

// const axios = require('axios');

// async function fetchPriceMomentum(ticker) {
//   try {
//     const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
//     const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=${API_KEY}`;
//     // const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${API_KEY}`;

//     const response = await axios.get(url);
//     const data = response.data;

//     // Log data for debugging if format isn't expected
//     if (!data || !data['Time Series (Daily)']) {
//       console.error('❌ Invalid data format received from Alpha Vantage:', JSON.stringify(data, null, 2));
//       throw new Error('Invalid data format');
//     }

//     // Example of calculating price momentum (last 2 close prices)
//     const timeSeries = data['Time Series (Daily)'];
//     const dates = Object.keys(timeSeries).sort((a, b) => new Date(b) - new Date(a));
    
//     if (dates.length < 2) throw new Error('Not enough data to calculate momentum');

//     const latestClose = parseFloat(timeSeries[dates[0]]['4. close']);
//     const previousClose = parseFloat(timeSeries[dates[1]]['4. close']);
//     const momentum = latestClose > previousClose ? 'bullish' : latestClose < previousClose ? 'bearish' : 'neutral';

//     return {
//       latestClose,
//       previousClose,
//       momentum,
//     };

//   } catch (err) {
//     console.error('❌ Error fetching price momentum:', err.message);
//     return null; // let the caller throw
//   }
// }

async function fetchPriceMomentum(ticker) {
  try {
    const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=60min&apikey=${API_KEY}`;

    const response = await axios.get(url);
    const data = response.data;

    if (!data || !data['Time Series (60min)']) {
      console.error('❌ Invalid data format received from Alpha Vantage:', JSON.stringify(data, null, 2));
      throw new Error('Invalid data format');
    }

    const timeSeries = data['Time Series (60min)'];
    const dates = Object.keys(timeSeries).sort((a, b) => new Date(b) - new Date(a));

    if (dates.length < 2) throw new Error('Not enough data to calculate momentum');

    const latestClose = parseFloat(timeSeries[dates[0]]['4. close']);
    const previousClose = parseFloat(timeSeries[dates[1]]['4. close']);
    const momentum = latestClose > previousClose ? 'bullish' : latestClose < previousClose ? 'bearish' : 'neutral';

    return {
      latestClose,
      previousClose,
      momentum,
      percentChange: ((latestClose - previousClose) / previousClose * 100).toFixed(2)
    };

  } catch (err) {
    console.error('❌ Error fetching price momentum:', err.message);
    return null;
  }
}


console.log("🔑 NEWS_API_KEY:", NEWS_API_KEY);

// async function fetchNewsFeed(ticker) {
//   try {
//     const url = `https://newsapi.org/v2/everything?q=${ticker}&sortBy=publishedAt&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`;
//     const response = await axios.get(url);
//     const articles = response.data.articles;

//     return articles.map(article => ({
//       title: article.title,
//       description: article.description,
//       url: article.url,
//     }));
//   } catch (err) {
//     console.error('Error fetching news feed:', err.message);
//     return [];
//   }
// }
async function fetchNewsFeed(ticker) {
  try {
    // Check if API key exists
    if (!process.env.NEWS_API_KEY) {
      console.error('❌ NEWS_API_KEY is not defined');
      return [];
    }

    // Log the API key (first 8 characters only for security)
    console.log('🔑 Using NEWS_API_KEY:', process.env.NEWS_API_KEY.substring(0, 8) + '...');

    // Build the URL with proper encoding
    const apiKey = process.env.NEWS_API_KEY.trim();
    const encodedTicker = encodeURIComponent(ticker);
    // const url = `https://newsapi.org/v2/everything?q=${encodedTicker}&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;
    const url = `https://gnews.io/api/v4/search?q=MSFT&lang=en&country=us&max=10&apikey=${process.env.NEWS_API_KEY}`;

    
    console.log('📡 Making request to:', url.replace(apiKey, 'HIDDEN_API_KEY'));

    // Add proper headers
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'YourAppName/1.0',
        'Accept': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    console.log('✅ News API Response Status:', response.status);
    console.log('📰 Articles found:', response.data.articles?.length || 0);

    const articles = response.data.articles || [];

    return articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: article.publishedAt,
      source: article.source?.name,
    }));

  } catch (err) {
    console.error('❌ Error fetching news feed:');
    console.error('   Status:', err.response?.status);
    console.error('   Status Text:', err.response?.statusText);
    console.error('   Error Message:', err.message);
    
    // Log the full error response for debugging
    if (err.response?.data) {
      console.error('   API Error Details:', JSON.stringify(err.response.data, null, 2));
    }

    return [];
  }
}



async function analyzeWithLLM(ticker, momentum, news) {
  try {
    if (news.length === 0) {
      return {
        pulse: "neutral",
        llm_explanation: "No news available for LLM to evaluate pulse sentiment."
      };
    }

    const newsText = news.map((item, i) => `${i + 1}. ${item.title}: ${item.description}`).join('\n');

    const prompt = `
You are a financial market analyst.

Given the following momentum indicators and recent news headlines for ${ticker}, classify the overall sentiment as "bullish", "bearish", or "neutral". Then briefly explain your reasoning.

Momentum Score: ${momentum.score}
Momentum Returns: ${JSON.stringify(momentum.returns)}

News Headlines:
${newsText}

Respond in this JSON format:
{
  "pulse": "...",
  "reason": "..."
}
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const geminiRes = await axios.post(geminiUrl, {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    });

    // Debug: print raw response from Gemini
    console.log("Gemini raw response:", JSON.stringify(geminiRes.data, null, 2));

    const candidates = geminiRes.data?.candidates || [];
    const reply = candidates.length > 0 && candidates[0].content?.parts?.length > 0
      ? candidates[0].content.parts[0].text
      : null;

    if (!reply) {
      return {
        pulse: "neutral",
        llm_explanation: "LLM returned empty or unstructured response."
      };
    }

    // Try parsing JSON from Gemini (if structured response is given)
    try {
      const parsed = JSON.parse(reply);
      return {
        pulse: parsed.pulse || "neutral",
        llm_explanation: parsed.reason || reply
      };
    } catch (parseErr) {
      // Fallback: use simple keyword matching if JSON parsing fails
      const lowerReply = reply.toLowerCase();
      const pulse = lowerReply.includes("bullish")
        ? "bullish"
        : lowerReply.includes("bearish")
        ? "bearish"
        : "neutral";

      return {
        pulse,
        llm_explanation: reply
      };
    }

  } catch (err) {
    console.error("Error calling Gemini LLM:", err.message);
    return {
      pulse: "neutral",
      llm_explanation: "LLM response could not be parsed or fetched."
    };
  }
}

async function analyzeMarketPulse(ticker) {
  const momentum = await fetchPriceMomentum(ticker);
  const news = await fetchNewsFeed(ticker);

  if (!momentum) throw new Error('Failed to fetch momentum');

  const llmResult = await analyzeWithLLM(ticker, momentum, news);

  return {
    ticker: ticker.toUpperCase(),
    as_of: new Date().toISOString().split('T')[0],
    momentum,
    news,
    ...llmResult
  };
}

module.exports = {
  fetchPriceMomentum,
  fetchNewsFeed,
  analyzeMarketPulse
};
