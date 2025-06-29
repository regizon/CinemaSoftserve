import React from 'react';
import './App.css';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import Film from './pages/Film.jsx'; 
import Profile from './pages/Profile.jsx'; 
import Register from './pages/auth/register.jsx'; 
import Login from './pages/auth/Login.jsx'; 

import Footer from './Components/Main/Footer.jsx';
import Header from './Components/Main/Header.jsx';
import { Routes, Route } from 'react-router-dom';

import FilmGrid from './Components/FilmGrid';
import Carousel from './Components/Carousel';

function App() {

  return (
    <>
    <div className='content'>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/film/:id" element={<Film />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
    </>
  );
}

export default App
