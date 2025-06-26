import React from 'react';

export default function FilmItem({ img_url, title, description }) {
  return (
    <div className="poster">
      <div className="film-item">
        <img src={img_url} alt={title} />
        <div className="film-caption">{title}</div>
        <div className="film-caption2">{description}</div>
      </div>
    </div>
  );
}