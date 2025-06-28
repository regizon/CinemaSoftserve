import React from 'react';
import Carousel from '../Components/Carousel.jsx';
import FilmGrid from '../Components/FilmGrid.jsx';


export default function  Home() {
  return (
    <>
      <Carousel />
      <div className="navigation">
        <nav className="navigation1">
          <a href="#" className="nav"><img src="/img/icons/filtr.svg" alt="Фільтр" /> Фільтр</a>
          <a href="#" className="nav">Купони та акції</a>
          <a href="#" className="nav">Купівля квитків</a>
          <a href="#" className="nav">Скоро у КІНО!</a>
        </nav>
      </div>

      <FilmGrid />
    </>
  );
}