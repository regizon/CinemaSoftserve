import React from 'react';

export default function FilmItem({ img, title, info }) {
  return (
    <div className="poster">
      <div className="film-item">
        <img src={img} alt={title} />
        <div className="film-caption">{title}</div>
        <div className="film-caption2">{info}</div>
      </div>
    </div>
  );
}