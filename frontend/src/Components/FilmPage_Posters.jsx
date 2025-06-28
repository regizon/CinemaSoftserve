import React from 'react';

//TODO: change this to db info (carousel films)
const films = [
  {
    id: 1,
    src: '/img/movies/elio.png',
    title: 'Еліо',
    info: '2025, США, пригоди',
  },
  {
    id: 2,
    src: '/img/movies/torf.png',
    title: 'Тор: Любов і Грім',
    info: '2022, США, бойовик/пригоди',
  },
  {
    id: 3,
    src: '/img/movies/x-men.png',
    title: 'Люди Ікс: Темний Фенікс',
    info: '2019, США, фантастика',
  },
  {
    id: 4,
    src: '/img/movies/lilo.png',
    title: 'Ліло і Стіч',
    info: '2025, США, пригоди',
  },
];

export default function FilmPage_Posters() {
  return (
    <div className="main-film">
      {films.map(({ id, src, title, info }) => (
        <div key={id} className="poster-film">
          <div className="film-item1">
            <img src={src} alt={title} />
            <div className="film-caption1">{title}</div>
            <div className="film-caption3">{info}</div>
          </div>
        </div>
      ))}
    </div>
  );
}