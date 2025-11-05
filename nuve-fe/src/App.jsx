import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Men, Women } from './components';
import './style.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/man" element={<Man />} />
        <Route path="/woman" element={<Woman />} />
      </Routes>
    </Router>
  );
}

export default App;
