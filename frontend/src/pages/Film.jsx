import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import FilmPage_Content from '../Components/FilmPage_Content.jsx';
import FilmPage_Posters from '../Components/FilmPage_Posters.jsx';
import FilmPage_Trailer from '../Components/FilmPage_Trailer.jsx';
import './Film.css';

export default function Film() {
  const { id } = useParams();            
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/v1/public/movies/${id}/`)
      .then(res => res.json())
      .then(data => setMovie(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!movie) return <div>Загрузка...</div>;

  return (
    <div className="film">
    <FilmPage_Content {...movie}/>
    <FilmPage_Trailer {...movie}/>
    <FilmPage_Posters />
    </div>
  );
}