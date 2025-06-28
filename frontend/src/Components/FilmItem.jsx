import React from 'react';
import { Link } from 'react-router-dom';

export default function FilmItem({ id, img_url, title, year, country, genres }) {
  const genreString = genres.join('/');
  return (
    <div className="poster">
      
      <div className="film-item">
        <Link to={`/film/${id}`} >
        <img src={img_url} alt={title} />
        <div className="film-caption">{title}</div>
        </Link>
        <div className="film-caption2">{year}, {country}, {genreString}</div>
      </div>
      
    </div>
  );
}