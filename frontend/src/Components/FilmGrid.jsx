import React from 'react';
import FilmItem from './FilmItem';
import { useState, useEffect } from 'react';

  
/*const films = [
    { id: 1, img: '/img/movies/elio.png', title: 'Еліо', info: '2025, США, пригоди' },
    { id: 2, img: '/img/movies/torf.png', title: 'Тор: Любов і Грім', info: '2022, США, бойовик/пригоди' },
    { id: 3, img: '/img/movies/x-men.png', title: 'Люди Ікс: Темний Фенікс', info: '2019, США, фантастика' },
    { id: 4, img: '/img/movies/lilo.png', title: 'Ліло і Стіч', info: '2025, США, пригоди' },
    { id: 5, img: '/img/movies/dovod.png', title: 'Довод', info: '2020, США, бойовик' },
    { id: 6, img: '/img/movies/mayak.png', title: 'Маяк', info: '2020, США, жахи' },
    { id: 7, img: '/img/movies/lordoftherings.png', title: 'Володар перснів: Повернення короля', info: '2004, США, пригоди' },
    { id: 8, img: '/img/movies/pirates.png', title: 'Пірати Карибського моря: Мерці не розповідають казки', info: '2017, США, фантастика' },
  ];*/

export default function FilmGrid() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchMovies = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/v1/public/movies/');
          const data = await response.json();
          setMovies(data);
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