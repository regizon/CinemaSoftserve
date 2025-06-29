import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import FilmPage_Content from '../Components/FilmPage_Content.jsx';
import FilmPage_Posters from '../Components/FilmPage_Posters.jsx';
import FilmPage_Trailer from '../Components/FilmPage_Trailer.jsx';
import './Film.css';
import NotFound from './NotFound.jsx';

export default function Film() {
  const { id } = useParams();            
  const [movie, setMovie] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/v1/public/movies/${id}/`)
      .then(res => res.json())
      .then(data => {
        if (data.detail) {
          setNotFound(true); // если ответ содержит "detail", это ошибка
        } else {
          setMovie(data); // нормальный ответ
        }
      })
      .catch(err => console.error(err));
  }, [id]);
  if (notFound) return <NotFound />
  if (!movie) return <div>Загрузка...</div>;

  return (
    <div className="film">
    <FilmPage_Content {...movie}/>
    <FilmPage_Trailer {...movie}/>
    <FilmPage_Posters />
    </div>
  );
}