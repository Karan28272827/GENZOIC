import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, AlertCircle, RefreshCw, BarChart3, Activity } from 'lucide-react';
import './MarketPulse.css';

const MarketPulse = () => {
    const [ticker, setTicker] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);

    // Mock API call - replace with actual endpoint
    //   const fetchMarketPulse = async (symbol) => {
    //     setLoading(true);
    //     setError('');

    //     try {
    //       // Simulate API delay
    //     //   await new Promise(resolve => setTimeout(resolve, 1500));

    //       // Mock response - replace with actual API call
    //     //   const mockResponses = {
    //     //     'AAPL': {
    //     //       sentiment: 'bullish',
    //     //       confidence: 78,
    //     //       currentPrice: 185.23,
    //     //       priceChange: 2.45,
    //     //       priceChangePercent: 1.34,
    //     //       reasons: [
    //     //         'Strong quarterly earnings beat expectations',
    //     //         'Positive analyst upgrades from 3 major firms',
    //     //         'Technical indicators show upward momentum',
    //     //         'Volume spike suggests institutional buying'
    //     //       ],
    //     //       keyMetrics: {
    //     //         rsi: 65,
    //     //         macd: 'bullish_crossover',
    //     //         volume: '125% above average',
    //     //         support: 182.45,
    //     //         resistance: 190.20
    //     //       },
    //     //       marketCap: '2.89T',
    //     //       peRatio: 28.5
    //     //     },
    //     //     'TSLA': {
    //     //       sentiment: 'bearish',
    //     //       confidence: 82,
    //     //       currentPrice: 238.45,
    //     //       priceChange: -8.92,
    //     //       priceChangePercent: -3.61,
    //     //       reasons: [
    //     //         'CEO selling additional shares',
    //     //         'Production concerns at Shanghai factory',
    //     //         'Regulatory headwinds in key markets',
    //     //         'Technical breakdown below support levels'
    //     //       ],
    //     //       keyMetrics: {
    //     //         rsi: 32,
    //     //         macd: 'bearish_divergence',
    //     //         volume: '89% above average',
    //     //         support: 235.00,
    //     //         resistance: 245.80
    //     //       },
    //     //       marketCap: '758B',
    //     //       peRatio: 65.2
    //     //     },
    //     //     'NVDA': {
    //     //       sentiment: 'neutral',
    //     //       confidence: 65,
    //     //       currentPrice: 445.67,
    //     //       priceChange: 1.23,
    //     //       priceChangePercent: 0.28,
    //     //       reasons: [
    //     //         'Mixed earnings results with strong AI growth',
    //     //         'Geopolitical tensions affecting chip sector',
    //     //         'Sideways trading pattern suggests consolidation',
    //     //         'Institutional sentiment remains divided'
    //     //       ],
    //     //       keyMetrics: {
    //     //         rsi: 52,
    //     //         macd: 'neutral',
    //     //         volume: '102% of average',
    //     //         support: 440.00,
    //     //         resistance: 455.30
    //     //       },
    //     //       marketCap: '1.1T',
    //     //       peRatio: 74.3
    //     //     }
    //     //   };

    //     //   const result = mockResponses[symbol.toUpperCase()] || {
    //     //     sentiment: 'neutral',
    //     //     confidence: 45,
    //     //     currentPrice: Math.random() * 200 + 50,
    //     //     priceChange: (Math.random() - 0.5) * 10,
    //     //     priceChangePercent: (Math.random() - 0.5) * 5,
    //     //     reasons: [
    //     //       'Limited data available for analysis',
    //     //       'Market conditions are mixed',
    //     //       'No significant catalysts identified'
    //     //     ],
    //     //     keyMetrics: {
    //     //       rsi: Math.floor(Math.random() * 100),
    //     //       macd: 'neutral',
    //     //       volume: 'Average',
    //     //       support: 0,
    //     //       resistance: 0
    //     //     },
    //     //     marketCap: 'N/A',
    //     //     peRatio: 'N/A'
    //     //   };

    //         const response = await fetch(`/api/v1/market-pulse?ticker=${symbol}`);
    //         if (!response.ok) throw new Error('API response not ok');
    //         const data = await response.json();

    //         // Transform backend response into expected frontend format
    //         const result = {
    //             ticker: data.ticker,
    //             sentiment: data.pulse,
    //             confidence: Math.round(data.momentum.score * 100), // scale score (e.g., 0.34 → 34)
    //             currentPrice: 0, // Placeholder if not provided
    //             priceChange: 0,
    //             priceChangePercent: 0,
    //             reasons: data.news.slice(0, 4).map(article => article.title),
    //             keyMetrics: {
    //                 rsi: 50, // placeholder
    //                 macd: 'neutral',
    //                 volume: 'N/A',
    //                 support: 0,
    //                 resistance: 0
    //             },
    //             marketCap: 'N/A',
    //             peRatio: 'N/A'
    //         };

    //       setAnalysis({ ...result, ticker: symbol.toUpperCase() });

    //     //   Update recent searches
    //       setRecentSearches(prev => {
    //         const updated = [symbol.toUpperCase(), ...prev.filter(s => s !== symbol.toUpperCase())];
    //         return updated.slice(0, 5);
    //       });

    //     } catch (err) {
    //       setError('Failed to fetch market analysis. Please try again.');
    //     } finally {
    //       setLoading(false);
    //     }
    //   };
    const fetchMarketPulse = async (symbol) => {
        setLoading(true);
        setError('');

        try {
            // const response = await fetch(`/api/market-pulse?ticker=${symbol.toUpperCase()}`);
            const response = await fetch('http://localhost:8000/api/market-pulse?ticker=' + symbol);

            if (!response.ok) throw new Error('API error');

            const data = await response.json();

            const result = {
                sentiment: data.pulse || 'neutral',
                confidence: data.momentum?.score ? Math.round(data.momentum.score * 100) : 50,
                currentPrice: 0, // Placeholder, update if your API includes it
                priceChange: 0,
                priceChangePercent: 0,
                reasons: data.news?.slice(0, 4).map(item => item.title) || ['No news available'],
                keyMetrics: {
                    rsi: null,
                    macd: null,
                    volume: null,
                    support: null,
                    resistance: null
                },
                marketCap: 'N/A',
                peRatio: 'N/A',
                llmExplanation: data.llm_explanation || '',
                ticker: data.ticker || symbol.toUpperCase()
            };

            setAnalysis(result);

            setRecentSearches(prev => {
                const updated = [symbol.toUpperCase(), ...prev.filter(s => s !== symbol.toUpperCase())];
                return updated.slice(0, 5);
            });

        } catch (err) {
            setError('Failed to fetch market analysis. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (ticker.trim()) {
            fetchMarketPulse(ticker.trim());
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    const getSentimentIcon = (sentiment) => {
        switch (sentiment) {
            case 'bullish':
                return <TrendingUp className="sentiment-icon bullish-icon" />;
            case 'bearish':
                return <TrendingDown className="sentiment-icon bearish-icon" />;
            default:
                return <Minus className="sentiment-icon neutral-icon" />;
        }
    };

    const formatPrice = (price) => `$${price.toFixed(2)}`;

    const formatChange = (change, percent) => {
        const sign = change >= 0 ? '+' : '';
        const colorClass = change >= 0 ? 'positive-change' : 'negative-change';
        return (
            <span className={colorClass}>
                {sign}{formatPrice(change)} ({sign}{percent.toFixed(2)}%)
            </span>
        );
    };

    const getConfidenceBarWidth = (confidence) => `${confidence}%`;

    return (
        <div className="market-pulse-container">
            <div className="main-content">
                {/* Animated Background */}
                <div className="animated-bg">
                    <div className="bg-circle circle-1"></div>
                    <div className="bg-circle circle-2"></div>
                    <div className="bg-circle circle-3"></div>
                </div>

                {/* Header */}
                <header className="header">
                    <div className="header-content">
                        <div className="logo-section">
                            <Activity className="logo-icon" />
                            <h1 className="main-title">Market Pulse</h1>
                        </div>
                        <p className="subtitle">
                            Advanced AI-powered stock sentiment analysis
                        </p>
                    </div>
                </header>

                {/* Search Section */}
                <section className="search-section">
                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <Search className="search-icon" />
                            <input
                                type="text"
                                value={ticker}
                                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter ticker symbol (e.g., AAPL, TSLA, NVDA)"
                                className="search-input"
                                disabled={loading}
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !ticker.trim()}
                                className="search-button"
                            >
                                {loading ? (
                                    <RefreshCw className="button-icon spinning" />
                                ) : (
                                    <>
                                        <BarChart3 className="button-icon" />
                                        Analyze
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Recent Searches */}
                        {recentSearches.length > 0 && (
                            <div className="recent-searches">
                                <p className="recent-label">Recent searches:</p>
                                <div className="recent-tags">
                                    {recentSearches.map((search, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setTicker(search);
                                                fetchMarketPulse(search);
                                            }}
                                            className="recent-tag"
                                        >
                                            {search}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        <AlertCircle className="error-icon" />
                        <p>{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="loading-container">
                        <div className="loading-spinner">
                            <RefreshCw className="spinner-icon" />
                        </div>
                        <div className="loading-text">
                            <h3>Analyzing Market Sentiment</h3>
                            <p>Processing technical indicators and market data...</p>
                        </div>
                        <div className="loading-bar">
                            <div className="loading-progress"></div>
                        </div>
                    </div>
                )}

                {/* Analysis Results */}
                {analysis && !loading && (
                    <div className="analysis-container">
                        {/* Stock Header */}
                        <div className="stock-header">
                            <div className="stock-info">
                                <h2 className="stock-ticker">{analysis.ticker}</h2>
                                <div className="stock-details">
                                    <span className="market-cap">Cap: {analysis.marketCap}</span>
                                    <span className="pe-ratio">P/E: {analysis.peRatio}</span>
                                </div>
                            </div>
                            <div className="price-info">
                                <div className="current-price">
                                    {formatPrice(analysis.currentPrice)}
                                </div>
                                <div className="price-change">
                                    {formatChange(analysis.priceChange, analysis.priceChangePercent)}
                                </div>
                            </div>
                        </div>

                        {/* Sentiment Badge */}
                        <div className={`sentiment-badge ${analysis.sentiment}`}>
                            {getSentimentIcon(analysis.sentiment)}
                            <div className="sentiment-text">
                                <span className="sentiment-label">
                                    {analysis.sentiment.toUpperCase()} for Tomorrow
                                </span>
                                <div className="confidence-section">
                                    <span className="confidence-text">{analysis.confidence}% confidence</span>
                                    <div className="confidence-bar">
                                        <div
                                            className="confidence-fill"
                                            style={{ width: getConfidenceBarWidth(analysis.confidence) }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="analysis-content">
                            {/* Key Reasons */}
                            <div className="reasons-section">
                                <h3 className="section-title">Key Analysis Points</h3>
                                <div className="reasons-grid">
                                    {analysis.reasons.map((reason, index) => (
                                        <div key={index} className="reason-item">
                                            <div className="reason-number">{index + 1}</div>
                                            <p className="reason-text">{reason}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Technical Indicators */}
                            <div className="indicators-section">
                                <h3 className="section-title">Technical Indicators</h3>
                                <div className="indicators-grid">
                                    <div className="indicator-card">
                                        <div className="indicator-header">
                                            <span className="indicator-label">RSI</span>
                                            <span className="indicator-value">{analysis.keyMetrics.rsi}</span>
                                        </div>
                                        <div className="indicator-bar">
                                            <div
                                                className="indicator-fill rsi-fill"
                                                style={{ width: `${analysis.keyMetrics.rsi}%` }}
                                            ></div>
                                        </div>
                                        <span className="indicator-status">
                                            {analysis.keyMetrics.rsi > 70 ? 'Overbought' :
                                                analysis.keyMetrics.rsi < 30 ? 'Oversold' : 'Normal'}
                                        </span>
                                    </div>

                                    <div className="indicator-card">
                                        <div className="indicator-header">
                                            <span className="indicator-label">MACD</span>
                                            <span className="indicator-value">
                                                {analysis?.keyMetrics?.macd?.replace('_', ' ').toUpperCase() || 'N/A'}
                                            </span>
                                        </div>
                                        <div className={`macd-status ${analysis?.keyMetrics?.macd?.toLowerCase().includes('bullish') ? 'bullish' :
                                                analysis?.keyMetrics?.macd?.toLowerCase().includes('bearish') ? 'bearish' :
                                                    'neutral'
                                            }`}>
                                            {
                                                analysis?.keyMetrics?.macd?.toLowerCase().includes('bullish') ? '↗' :
                                                    analysis?.keyMetrics?.macd?.toLowerCase().includes('bearish') ? '↘' :
                                                        '→'
                                            }
                                        </div>
                                    </div>

                                    <div className="indicator-card">
                                        <div className="indicator-header">
                                            <span className="indicator-label">Volume</span>
                                            <span className="indicator-value">{analysis.keyMetrics.volume}</span>
                                        </div>
                                        <div className="volume-visual">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div
                                                    key={i}
                                                    className={`volume-bar ${i <= 3 ? 'active' : ''}`}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>

                                    {analysis.keyMetrics.support > 0 && (
                                        <>
                                            <div className="indicator-card">
                                                <div className="indicator-header">
                                                    <span className="indicator-label">Support</span>
                                                    <span className="indicator-value">
                                                        {formatPrice(analysis.keyMetrics.support)}
                                                    </span>
                                                </div>
                                                <div className="support-resistance-visual support">
                                                    <div className="level-line"></div>
                                                </div>
                                            </div>

                                            <div className="indicator-card">
                                                <div className="indicator-header">
                                                    <span className="indicator-label">Resistance</span>
                                                    <span className="indicator-value">
                                                        {formatPrice(analysis.keyMetrics.resistance)}
                                                    </span>
                                                </div>
                                                <div className="support-resistance-visual resistance">
                                                    <div className="level-line"></div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Disclaimer */}
                <footer className="disclaimer">
                    <p>
                        ⚠️ This analysis is for informational purposes only and should not be considered financial advice.
                        Always consult with a qualified financial advisor before making investment decisions.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default MarketPulse;