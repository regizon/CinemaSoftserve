import React, { useState, useEffect, useContext } from 'react';
import Shedule from './FilmPage_Schedule';
import SheduleEdit from './FilmPage_ScheduleEdit';
import { Link, useNavigate } from 'react-router-dom';
import FilmPage_ContentEdit from './FilmPage_ContentEdit';
import FilmPage_Content from './FilmPage_Content';
import { useMeta } from '../../pages/Admin/useMeta';
import { AuthContext } from '../Main/Auth/AuthProvider.jsx';

export default function FilmPage_Main({ movie }) {
  const token = localStorage.getItem('access');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isSessionEditing, setIsSessionEditing] = useState(false);
  const [isMovieEditing, setIsMovieEditing] = useState(false);

  const [movieData, setMovieData] = useState({
    title: '',
    slogan: '',
    year: '',
    age_rate: '',
    country: '',
    original_title: '',
    language: '',
    duration_minutes: '',
    description: '',
    img_url: '',
    poster_url: '',
    trailer_url: ''
  });

  const { actorOptions, directorOptions, genreOptions, loading, error } = useMeta();

  const [selectedDirectors, setSelectedDirectors] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedActors, setSelectedActors] = useState([]);

  const initializeSelectFields = () => {
    if (!loading && movie) {
      setSelectedActors(
        Array.isArray(movie.actors_read)
          ? actorOptions.filter(opt => movie.actors_read.includes(opt.label))
          : []
      );

      setSelectedDirectors(
        Array.isArray(movie.directors_read)
          ? directorOptions.filter(opt => movie.directors_read.includes(opt.label))
          : []
      );

      setSelectedGenres(
        Array.isArray(movie.genres_read)
          ? genreOptions.filter(opt => movie.genres_read.includes(opt.label))
          : []
      );
    }
  };

  const handleToggle = () => setIsSessionEditing(prev => !prev);

  const handleToggleMovie = () => {
    if (!isMovieEditing) {
      setMovieData({
        title: movie.title || '',
        slogan: movie.slogan || '',
        year: movie.year || '',
        age_rate: movie.age_rate || '',
        country: movie.country || '',
        original_title: movie.original_title || '',
        language: movie.language || '',
        duration_minutes: movie.duration_minutes || '',
        description: movie.description || '',
        img_url: movie.img_url || '',
        poster_url: movie.poster_url || '',
        trailer_url: movie.trailer_url || ''
      });

      initializeSelectFields();
    }
    setIsMovieEditing(prev => !prev);
  };

  useEffect(() => {
    if (movie) {
      setMovieData({
        title: movie.title || '',
        slogan: movie.slogan || '',
        year: movie.year || '',
        age_rate: movie.age_rate || '',
        country: movie.country || '',
        original_title: movie.original_title || '',
        language: movie.language || '',
        duration_minutes: movie.duration_minutes || '',
        description: movie.description || '',
        img_url: movie.img_url || '',
        poster_url: movie.poster_url || '',
        trailer_url: movie.trailer_url || ''
      });
    }
  }, [movie]);

  useEffect(() => {
    initializeSelectFields();
  }, [loading, actorOptions, directorOptions, genreOptions, movie]);

  const handleFieldChange = (field, value) => {
    setMovieData(prev => ({
      ...prev,
      [field]: value
    }));
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

  const handleMovieSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    try {
      const dataToSend = {
        ...movieData,
        actors: selectedActors.map(actor => actor.value),
        directors: selectedDirectors.map(director => director.value),
        genres: selectedGenres.map(genre => genre.value)
      };

      const response = await fetch(`/api/v1/admin/movies/${movie.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        alert('Фільм оновлено успішно');
        setIsMovieEditing(false);
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error('Помилка відповіді:', errorData);
        alert('Не вдалося оновити фільм');
      }
    } catch (error) {
      console.error('Помилка при оновленні фільму:', error);
      alert('Сталася помилка');
    }
  };

  return (
    <div className="film-container">
      <div className="film-poster">
        <img src={movie.img_url} alt={movie.title} />
        <Link to="/reservation"><button className="buy-button">Придбати квиток</button></Link>
        {user?.role == 'AD' && (
        <button onClick={handleDelete} className="delete-button">Видалити</button>
        )}
      </div>

      <div className="film-info">
        {isMovieEditing ? (
          <FilmPage_ContentEdit
            title={movieData.title}
            slogan={movieData.slogan}
            year={movieData.year}
            age_rate={movieData.age_rate}
            country={movieData.country}
            original_title={movieData.original_title}
            language={movieData.language}
            duration_minutes={movieData.duration_minutes}
            description={movieData.description}
            img_url={movieData.img_url}
            poster_url={movieData.poster_url}
            trailer_url={movieData.trailer_url}

            onFieldChange={handleFieldChange}

            selectedActors={selectedActors}
            setSelectedActors={setSelectedActors}
            selectedDirectors={selectedDirectors}
            setSelectedDirectors={setSelectedDirectors}
            selectedGenres={selectedGenres}
            setSelectedGenres={setSelectedGenres}

            actorOptions={actorOptions}
            directorOptions={directorOptions}
            genreOptions={genreOptions}

            alertMessage={null}
            alertType={null}
            handleMovieSubmit={handleMovieSubmit}
          />
        ) : (
          <FilmPage_Content {...movie} />
        )}
        {user?.role == 'AD' && (
          <button className="btn btn-secondary mt-2" onClick={handleToggleMovie}
            style={{ backgroundColor: '#ffffff', color: '#1B1F3A', width: '130px', height: '50px', fontSize: '20px', marginLeft: '250px', marginTop: '140px'}}>
            {isMovieEditing ? 'Перегляд' : 'Редагувати'}
          </button>
        )}
      </div>

      <div className="film-poster">
        {isSessionEditing ? <SheduleEdit /> : <Shedule />}
        {user?.role == 'AD' && (
        <button className="btn btn-secondary mt-2" onClick={handleToggle}
          style={{ backgroundColor: '#ffffff', color: '#1B1F3A', width: '130px', height: '50px', fontSize: '20px', marginLeft: '250px', marginTop: '140px'}}>
          {isSessionEditing ? 'Перегляд' : 'Редагувати'}
        </button>
        )}
      </div>
    </div>
  );
}