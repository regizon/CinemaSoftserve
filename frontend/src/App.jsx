import React from 'react';
import './App.css';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import Film from './pages/Film.jsx'; 
import Profile from './pages/Profile.jsx'; 
import Register from './pages/auth/register.jsx'; 
import Login from './pages/auth/Login.jsx'; 
import UnLogin from './pages/auth/UnLogin.jsx'; 

import Footer from './Components/Main/Footer.jsx';
import Header from './Components/Main/Header.jsx';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './Components/Main/Auth/PrivateRoute.jsx';

import AddMovie from './pages/Admin/adminfilm.jsx';
import Reservation from './pages/Reservation.jsx';

function App() {

  return (
    <>
    <div className='content'>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/film/:id" element={<Film />} />
        <Route path="/profile" element={ <PrivateRoute><Profile /></PrivateRoute>}/>
        <Route path="/reservation" element={ <Reservation /> }/>
        <Route path="/admin/add-movie" element={<PrivateRoute><AddMovie /></PrivateRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unlogin" element={<UnLogin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
    </>
  );
}

export default App
