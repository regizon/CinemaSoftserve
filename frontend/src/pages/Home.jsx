import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Carousel from '../Components/Carousel.jsx';
import FilmGrid from '../Components/FilmGrid.jsx';
import FilterButton from '../Components/FilmPage/FilterButton.jsx';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/v1/public/movies/');
        const data = await response.json();
        console.log('Полученные данные:', data);
        setMovies(data.results);
        setFilteredMovies(data.results); // по умолчанию показываем всё
      } catch (error) {
        console.error("Ошибка при загрузке фильмов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleGenreFilter = (selectedGenres) => {
    if (selectedGenres.length === 0) {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie =>
        movie.genres_read && movie.genres_read.some(genre =>
          selectedGenres.includes(genre)
        )
      );
      setFilteredMovies(filtered);
    }
  };


  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <>
      <Carousel movies={movies} />
      <div className="navigation">
        <nav className="navigation1">
          <FilterButton onChange={handleGenreFilter} />
          <a href="#" className="nav">Купони та акції</a>
          <a href="#" className="nav">Купівля квитків</a>
          <a href="#" className="nav">Скоро у КІНО!</a>
        </nav>
      </div>

      <Link to="/admin/add-movie">
        <button
          className="btn"
          style={{
            backgroundColor: '#1B1F3A',
            color: '#ffffff',
            width: '100px',
            height: '50px',
            fontSize: '20px',
            marginLeft: '117px',
            marginTop: '20px'
          }}
        >
          Додати
        </button>
      </Link>

      {/* Показываем отфильтрованные фильмы */}
      <FilmGrid movies={filteredMovies} />
    </>
  );
}
