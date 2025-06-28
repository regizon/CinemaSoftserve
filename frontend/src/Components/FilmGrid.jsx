import React from 'react';
import FilmItem from './FilmItem';
import { useState, useEffect } from 'react';

export default function FilmGrid() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchMovies = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/v1/public/movies/');
          const data = await response.json();
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
    <div className="main">
      <div className="main1">
        {movies.map(film => (
            <FilmItem key={film.id} {...film} />
        ))}
        </div>
    </div>
  );
}