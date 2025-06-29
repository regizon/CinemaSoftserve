import React from 'react';
import FilmItem from './FilmItem';


export default function FilmGrid( {movies} ) {
  
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