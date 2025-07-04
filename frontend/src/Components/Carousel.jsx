import React from 'react';
import { Link } from 'react-router-dom';
//TODO: change slides to actual (or future) movies, not static 
const slides = [
    '/img/movies/posters/thor.png',
    '/img/movies/posters/elio1.png',
    '/img/movies/posters/drakon.png',
    '/img/movies/posters/balerina.png',
    '/img/movies/posters/lilosnich.png',
  ];

export default function Carousel( {movies} ) {
  
  const slides = movies.filter(
    movie => movie.poster_url && movie.poster_url.trim() !== ''
  );
  return (
    <div
      id="carouselExampleCaptions"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="7000"
    >
      {/* Индикаторы */}
      <div className="carousel-indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to={i}
            className={i === 0 ? 'active' : ''}
            aria-current={i === 0 ? 'true' : undefined}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Слайды */}
      <div className="carousel-inner">
        {slides.map((movie, i) => (
          <div
            key={movie.id}
            className={`carousel-item ${i === 0 ? 'active' : ''}`}
          >
            <Link to={`/film/${movie.uuid}`} >
            <img
              src={movie.poster_url}
              className="d-block w-100"
              alt={movie.title}
            />
            </Link>
            
          </div>
        ))}
      </div>

      {/* Кнопки навигации */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}