import React from 'react';

export default function FilmPage_Content({ title, original_title, slogan, description, country, year, age_rate, language, duration_minutes, genres, img_url, trailer_url }) {

  const genreString = genres.join(', ');
return (
<div className="film-container">
      <div className="film-poster">
        <img src={img_url} alt={title} />
        <button className="buy-button">Придбати квиток</button>
      </div>
      <div className="film-info">
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
          <strong>Режисер:</strong> Едріан Моліна, Мадлен Шарафян, Домі Ші
        </p>
        <p>
          <strong>Жанр:</strong> {genreString}, Комедії, Драми, Фантастика, Сімейні
        </p>
        <p>
          <strong>Час:</strong> {duration_minutes}
        </p>
        <p>
          <strong>У головних ролях:</strong> Йонас Кібріб, Америка Феррера,
          Джаміла Джаміл, Бред Геррет, Зої Салдана та інші
        </p>
        <h3>Опис фільму</h3>
        <p>
          {description}
        </p>
        
      </div>
      <div className="film-schedule">
        <div className="schedule-header">
          <span>Розклад сеансів</span>
          <select>
            <option>Пт, 21 червня</option>
          </select>
        </div>
        <ul>
          <li>
            <span className="hall-name">Червоний зал</span>
            <br />
            <a href="#">9:15</a>
          </li>
          <li>
            <span className="hall-name">Червоний зал</span>
            <br />
            <a href="#">13:15</a>
          </li>
          <li>
            <span className="hall-name">Синій зал</span>
            <br />
            <a href="#">17:20 3D</a>
          </li>
        </ul>
      </div>
    </div>
    );
}