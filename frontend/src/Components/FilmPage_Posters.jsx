import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function FilmPage_Posters() {
    const { id } = useParams();            
  const [movies, setMovie] = useState(null);
  

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/v1/public/movies/`)
      .then(res => res.json())
      .then(data => setMovie(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!movies) return <div>Загрузка...</div>;
  const four_movies = movies.results.slice(0, 4); 
  return (
    <div className="main-film">
      {four_movies.map(({ id, img_url, title, year, country, genre }) => (
        <div key={id} className="poster-film">
          <Link to={`/film/${id}`}>
            <div className="film-item1">
              <img src={img_url} alt={title} />
              <div className="film-caption1">{title}</div>
              <div className="film-caption3">{`${year}, ${country}, ${genre}`}</div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}