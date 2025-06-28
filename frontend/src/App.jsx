import React from 'react';
import './App.css'
import FilmGrid from './Components/FilmGrid'
import Carousel from './Components/Carousel';

function App() {

  return (
    <>
      
      <Carousel />

      {/* Навигация */}
      <div className="navigation">
        <nav className="navigation1">
          <a href="#" className="nav"><img src="/img/icons/filtr.svg" alt="Фільтр" /> Фільтр</a>
          <a href="#" className="nav">Купони та акції</a>
          <a href="#" className="nav">Купівля квитків</a>
          <a href="#" className="nav">Скоро у КІНО!</a>
        </nav>
      </div>

      <FilmGrid />

      <footer className="footer" />
    </>
  );
}

export default App
