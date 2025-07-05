import React, {useState} from 'react';
import Shedule from './FilmPage_Schedule';
import SheduleEdit from './FilmPage_ScheduleEdit';
import { useNavigate } from 'react-router-dom';
import FilmPage_ContentEdit from './FilmPage_ContentEdit';
import FilmPage_Content from './FilmPage_Content';

export default function FilmPage_Main({ movie }) {
  const token = localStorage.getItem('access');
  const navigate = useNavigate();
  
  const [isSessionEditing, setIsSessionEditing] = useState(false); // переключатель
  const [isMovieEditing, setIsMovieEditing] = useState(false); // переключатель
  const handleToggle = () => {
    setIsSessionEditing(prev => !prev);
  };

  const handleToggleMovie = () => {
    setIsMovieEditing(prev => !prev);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Ви впевнені, що хочете видалити цей фільм?');
    if (!confirmed) return;
  
    try {
      const response = await fetch(`/api/v1/admin/movies/${movie.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (response.ok) {
        alert('Фільм видалено');
        navigate('/')
      } else {
        alert('Не вдалося видалити фільм');
      }
    } catch (error) {
      console.error('Помилка при видаленні фільму:', error);
      alert('Сталася помилка');
    }
  };
return (
<div className="film-container">
      <div className="film-poster">
        <img src={movie.img_url} alt={movie.title} />
        <button className="buy-button">Придбати квиток</button>
        <button onClick={handleDelete} className="delete-button">Видалити</button>
      </div>
      <div className="film-info">
        
      {isMovieEditing ? <FilmPage_ContentEdit {...movie}/> : <FilmPage_Content {...movie}/>}
          <button className="btn btn-secondary mt-2" onClick={handleToggleMovie} style={{ backgroundColor: '#ffffff', color: '#1B1F3A', width: '130px', height: '50px', fontSize: '20px', marginLeft: '250px', marginTop: '140px'}}>
              {isMovieEditing ? 'Перегляд' : 'Редагувати'}
          </button>
      </div>
      
        <div className="film-poster">
          {isSessionEditing ? <SheduleEdit /> : <Shedule />}
          <button className="btn btn-secondary mt-2" onClick={handleToggle} style={{ backgroundColor: '#ffffff', color: '#1B1F3A', width: '130px', height: '50px', fontSize: '20px', marginLeft: '250px', marginTop: '140px'}}>
              {isSessionEditing ? 'Перегляд' : 'Редагувати'}
          </button>
      </div>
      
    </div>
    );
}