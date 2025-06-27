import React from 'react';

export default function FilmItem({ img_url, title, year, country, genres }) {
  const genreString = genres.join('/');
  return (
    <div className="poster">
      <div className="film-item">
        <img src={img_url} alt={title} />
        <div className="film-caption">{title}</div>
        <div className="film-caption2">{year}, {country}, {genreString}</div>
      </div>
    </div>
  );
}