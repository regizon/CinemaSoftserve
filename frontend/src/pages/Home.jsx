import { Link } from 'react-router-dom';
import React from 'react';
import Carousel from '../Components/Carousel.jsx';
import FilmGrid from '../Components/FilmGrid.jsx';
import { useState, useEffect } from 'react';

export default function  Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchMovies = async () => {
        try {
          const response = await fetch('/api/v1/public/movies/');
          const data = await response.json();
          console.log('Полученные данные:', data);
          setMovies(data.results);
        } catch (error) {
          console.error("Ошибка при загрузке фильмов:", error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchMovies();
    }, []);
    if (loading) {
        return <div>Загрузка...</div>;
    }

  return (
    <>
      <Carousel movies={movies}/>
      <div className="navigation">
        <nav className="navigation1">
          <a href="#" className="nav"><img src="/img/icons/filtr.svg" alt="Фільтр" /> Фільтр</a>
          <a href="#" className="nav">Купони та акції</a>
          <a href="#" className="nav">Купівля квитків</a>
          <a href="#" className="nav">Скоро у КІНО!</a>
        </nav>
      </div>
      <Link to="/admin/add-movie"><button className="btn" style={{ backgroundColor: '#1B1F3A', color: '#ffffff', width: '100px', height: '50px', fontSize: '20px', marginLeft: '117px', marginTop: '20px' }}>Додати</button></Link>
      <FilmGrid movies={movies}/>
    </>
  );
}