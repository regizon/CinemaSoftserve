import React, {useState} from 'react';

export default function FilmPage_Content({ title, original_title, slogan, description, country, year, age_rate, language, duration_minutes, genres_read, actors_read, directors_read }) {

  const genreString = Array.isArray(genres_read) ? genres_read.join('/') : '';
  const actorsString = Array.isArray(actors_read) ? actors_read.join('/') : '';
  const directorsString = Array.isArray(directors_read) ? directors_read.join('/') : '';


return (
<div>
        <h1>{title}</h1>
        <p>
          <strong>Слоган:</strong> {slogan}
        </p>
        <p>
          <strong>Дата виходу:</strong> 12 червня {year} року
        </p>
        <p>
          <strong>Вікові обмеження:</strong> {age_rate}+
        </p>
        <p>
          <strong>Країна:</strong> {country}
        </p>
        <p>
          <strong>Оригінальна назва:</strong> {original_title}
        </p>
        <p>
          <strong>Мова:</strong> {language}
        </p>
        <p>
          <strong>Режисер:</strong> { directorsString }
        </p>
        <p>
          <strong>Жанр:</strong> {genreString}
        </p>
        <p>
          <strong>Час:</strong> {duration_minutes}
        </p>
        <p>
          <strong>У головних ролях:</strong> { actorsString } та інші
        </p>
        <h3>Опис фільму</h3>
        <p>
          {description}
        </p>
    </div>
    );
}