// App.jsx (ganti bagian import dengan ini)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Man from './components/Man';
import Woman from './components/Woman';
import Contact from './components/Contact';

import './style.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/man" element={<Man />} />
        <Route path="/woman" element={<Woman />} />
        
      </Routes>
    </Router>
  );
}

export default App;
