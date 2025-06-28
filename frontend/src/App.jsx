import React from 'react';
import './App.css';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import Film from './pages/Film'; 
import Footer from './Components/Footer.jsx'
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
    <div className='content'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/film/:id" element={<Film />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
    </>
  );
}

export default App
