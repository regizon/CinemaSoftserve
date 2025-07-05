import React, { useState, useEffect } from 'react';
import './adminfilm.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import MovieForm from '../../Components/Admin/MovieFrom.jsx';
import PosterPreview from '../../Components/Admin/PosterPreview.jsx';
import SessionsSchedule from '../../Components/Admin/SessionsSchedule.jsx';
import TrailerPlayer from '../../Components/Admin/TrailerPlayer.jsx';
import { useHalls } from './useHalls.js';
import { useMeta } from './useMeta.js';

export default function AddMovie() {
  const token = localStorage.getItem('access');

        
  const {
    actorOptions,
    genreOptions,
    directorOptions,
  } = useMeta();

  
  // Поля формы
  const [selectedDirectors, setSelectedDirectors] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedActors, setSelectedActors] = useState([]);
  const [createdMovie, setCreatedMovie] = useState(null);

  const [title, setTitle] = useState('');
  const [slogan, setSlogan] = useState('');
  const [age_rate, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [original_title, setOriginalTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [duration_minutes, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [trailer_url, setTrailer] = useState('');
  const [img_url, setImg] = useState('');
  const [year, setYear] = useState('');

  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('');

  

  const handleMovieSubmit = async (e) => {
    e.preventDefault();

    const movieData = {
      title,
      original_title,
      slogan,
      description,
      country,
      year,
      age_rate,
      language,
      duration_minutes,
      img_url,
      poster_url: '',
      trailer_url,
      is_active: true,
      active_until: '',
      directors: selectedDirectors.map((d) => d.value),
      genres: selectedGenres.map((g) => g.value),
      actors: selectedActors.map((g) => g.value),
    };

    try {
      const response = await fetch('/api/v1/admin/movies/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData),
      });

      const data = await response.json();

      if (response.ok) {
        setAlertMessage('Фільм додано!');
        setAlertType('success');
        setCreatedMovie(data);
      } else {
        setAlertMessage(data?.detail || 'Помилка під час додавання. Перевірте дані.');
        setAlertType('danger');
      }
    } catch (error) {
      console.error('Помилка при запиті:', error);
      setAlertMessage('Сервер недоступний. Спробуйте пізніше.');
      setAlertType('danger');
    }
  };

  // Сеансы
  const [sessionDate, setSessionDate] = useState('');
  const [sessions, setSessions] = useState([
    { startTime: '', expireTime: '', hall: '', price: '', vip_price: '' },
    { startTime: '', expireTime: '', hall: '', price: '', vip_price: '' },
    { startTime: '', expireTime: '', hall: '', price: '', vip_price: '' },
  ]);

  const handleSessionChange = (index, field, value) => {
    const updatedSessions = [...sessions];
    updatedSessions[index][field] = value;
    setSessions(updatedSessions);
  };

  const handleScheduleSubmit = async e => {
    e.preventDefault();
    if (!createdMovie) {
      alert('Фільм не створено');
      return;
    }
  
    // Оставляем только полностью заполненные
    const valid = sessions
      .filter(s => s.startTime && s.expireTime && s.hall && s.price)
      .map(s => ({
        start_time:  s.startTime,
        expire_time: s.expireTime,
        price:       s.price,
        vip_price:   s.vip_price || '-',
        movie:       createdMovie.id,
        hall:        Number(s.hall),
      }));
  
    try {
      // Для каждого сеанса — отдельный POST
      const results = await Promise.all(
        valid.map(session =>
          fetch('/api/v1/admin/sessions/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(session),
          })
        )
      );
  
      // Проверяем, все ли запросы прошли успешно
      if (results.every(r => r.ok)) {
        alert('Усі сеанси збережено!');
      } else {
        const errors = await Promise.all(results.map(r => r.json()));
        console.error('ПОМІЛКИ:', errors);
        alert('Деякі сеанси не збережено. Перевір консоль.');
      }
    } catch (err) {
      console.error(err);
      alert('Сервер недоступний.');
    }
  };

  const { hallOptions, loading, error } = useHalls(token);

  if (loading) return <div>Загрузка залів…</div>;
  if (error)   return <div>Помилка завантаження. Перевірте з'єднання</div>;

  return (
    <>
      <div className="admin-panel">
        <PosterPreview img_url={img_url} />

        <MovieForm
          title={title}
          setTitle={setTitle}
          slogan={slogan}
          setSlogan={setSlogan}
          year={year}
          setYear={setYear}
          age_rate={age_rate}
          setAge={setAge}
          country={country}
          setCountry={setCountry}
          original_title={original_title}
          setOriginalTitle={setOriginalTitle}
          language={language}
          setLanguage={setLanguage}
          duration_minutes={duration_minutes}
          setDuration={setDuration}
          description={description}
          setDescription={setDescription}
          img_url={img_url}
          setImg={setImg}
          trailer_url={trailer_url}
          setTrailer={setTrailer}
          selectedDirectors={selectedDirectors}
          setSelectedDirectors={setSelectedDirectors}
          directorOptions={directorOptions}

          selectedActors={selectedActors}
          setSelectedActors={setSelectedActors}
          actorOptions={actorOptions}

          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          genreOptions={genreOptions}
          alertMessage={alertMessage}
          alertType={alertType}
          handleMovieSubmit={handleMovieSubmit}
        />

      <SessionsSchedule
          createdMovie={createdMovie}
          sessionDate={sessionDate}
          setSessionDate={setSessionDate}
          sessions={sessions}
          setSessions={setSessions}
          hallOptions={hallOptions}
          handleScheduleSubmit={handleScheduleSubmit}
          token={token}
        />
      </div>

      <TrailerPlayer trailer_url={trailer_url} />
    </>
  );
}