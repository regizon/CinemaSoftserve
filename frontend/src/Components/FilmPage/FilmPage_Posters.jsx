import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function FilmPage_Posters() {
    const { id } = useParams();            
  const [movies, setMovie] = useState(null);
  

  useEffect(() => {
    fetch(`https://cinemasoftserve-8ejj.onrender.com/api/v1/public/movies/`)
      .then(res => res.json())
      .then(data => setMovie(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!movies) return <div>Загрузка...</div>;
  const four_movies = movies.results.slice(0, 4); 
  return (
    <div className="main-film">
      {four_movies.map(({ uuid, img_url, title, year, country, genres_read }) => (
        <div key={uuid} className="poster-film">
          <Link to={`/film/${uuid}`}>
            <div className="film-item1">
              <img src={img_url} alt={title} />
              <div className="film-caption1">{title}</div>
              <div className="film-caption3">{`${year}, ${country}, ${Array.isArray(genres_read) ? genres_read.slice(0, 2).join('/') : ''}`}</div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}