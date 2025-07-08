import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FilmPage_Main from '../Components/FilmPage/FilmPage_Main.jsx';
import FilmPage_Posters from '../Components/FilmPage/FilmPage_Posters.jsx';
import FilmPage_Trailer from '../Components/FilmPage/FilmPage_Trailer.jsx';
import FilmPage_Schedule from '../Components/FilmPage/FilmPage_Schedule.jsx';
import FilmPage_ScheduleEdit from '../Components/FilmPage/FilmPage_ScheduleEdit.jsx';
import './Film.css';
import NotFound from './NotFound.jsx';

export default function Film() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isSessionEditing, setIsSessionEditing] = useState(false);

  const handleToggleEdit = () => setIsSessionEditing(prev => !prev);

  useEffect(() => {
    fetch(`/api/v1/public/movies/${id}/`)
      .then(res => res.json())
      .then(data => {
        if (data.detail) {
          setNotFound(true);
        } else {
          setMovie(data);
        }
      })
      .catch(err => console.error(err));
  }, [id]);

  if (notFound) return <NotFound />
  if (!movie) return <div>Загрузка...</div>;

  return (
    <div className="film">
      <div className="film-container">
        <div className="left-column">
          <FilmPage_Main movie={movie} />
        </div>
        <div className="right-column">
          {isSessionEditing
            ? <FilmPage_ScheduleEdit movieId={movie.id} />
            : <FilmPage_Schedule movieId={movie.id} />
          }

          <button
            onClick={handleToggleEdit}
            className="btn btn-secondary mt-2"
            style={{
              backgroundColor: '#ffffff',
              color: '#1B1F3A',
              width: '130px',
              height: '50px',
              fontSize: '20px',
              marginTop: '20px'
            }}
          >
            {isSessionEditing ? 'Перегляд' : 'Редагувати'}
          </button>
        </div>
      </div>
        <FilmPage_Trailer {...movie} />
          <FilmPage_Posters />
    </div>
  );
}
