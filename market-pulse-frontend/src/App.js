import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MarketPulse from './components/MarketPulse.jsx/MarketPulse';
import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <main className="main-content">
          <Routes>
            <Route path="/market-pulse" element={<MarketPulse />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;