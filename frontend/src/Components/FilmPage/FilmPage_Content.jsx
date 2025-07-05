import React, {useState} from 'react';
import Shedule from './FilmPage_Schedule';
import SheduleEdit from './FilmPage_ScheduleEdit';

export default function FilmPage_Content({ title, original_title, slogan, description, country, year, age_rate, language, duration_minutes, genres, img_url, actors, directors }) {

  const genreString = genres.join(', ');
  const actorsString = actors.join(', ');

  const directorsString = directors.join(', ');
  const [isEditing, setIsEditing] = useState(false); // переключатель

  const handleToggle = () => {
    setIsEditing(prev => !prev);
  };
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
      
        <div className="film-poster">
          {isEditing ? <SheduleEdit /> : <Shedule />}
          <button className="btn btn-secondary mt-2" onClick={handleToggle} style={{ backgroundColor: '#ffffff', color: '#1B1F3A', width: '130px', height: '50px', fontSize: '20px', marginLeft: '250px', marginTop: '140px'}}>
              {isEditing ? 'Перегляд' : 'Редагувати'}
          </button>
      </div>
      
    </div>
    );
}