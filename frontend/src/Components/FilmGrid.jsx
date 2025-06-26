import React from 'react';
//import films from '../data/films';
import FilmItem from './FilmItem';

const films = [
    { id: 1, img: '/img/movies/elio.png', title: 'Еліо', info: '2025, США, пригоди' },
    { id: 2, img: '/img/movies/torf.png', title: 'Тор: Любов і Грім', info: '2022, США, бойовик/пригоди' },
    { id: 3, img: '/img/movies/x-men.png', title: 'Люди Ікс: Темний Фенікс', info: '2019, США, фантастика' },
    { id: 4, img: '/img/movies/lilo.png', title: 'Ліло і Стіч', info: '2025, США, пригоди' },
    { id: 5, img: '/img/movies/dovod.png', title: 'Довод', info: '2020, США, бойовик' },
    { id: 6, img: '/img/movies/mayak.png', title: 'Маяк', info: '2020, США, жахи' },
    { id: 7, img: '/img/movies/lordoftherings.png', title: 'Володар перснів: Повернення короля', info: '2004, США, пригоди' },
    { id: 8, img: '/img/movies/pirates.png', title: 'Пірати Карибського моря: Мерці не розповідають казки', info: '2017, США, фантастика' },
  ];
export default function FilmGrid() {

  return (
    <div className="main">
      <div className="main1">
        {films.map(film => (
            <FilmItem key={film.id} {...film} />
        ))}
        </div>
    </div>
  );
}