import React from 'react';
import Select from 'react-select';

export default function MovieForm({
  title, setTitle,
  slogan, setSlogan,
  year, setYear,
  age_rate, setAge,
  country, setCountry,
  original_title, setOriginalTitle,
  language, setLanguage,
  duration_minutes, setDuration,
  description, setDescription,
  img_url, setImg,
  trailer_url, setTrailer,
  selectedDirectors, setSelectedDirectors,
  directorOptions,
  selectedActors, setSelectedActors,
  actorOptions,
  selectedGenres, setSelectedGenres,
  genreOptions,
  alertMessage, alertType,
  handleMovieSubmit,
}) {
  return (
    <form
      method="POST"
      encType="multipart/form-data"
      className="center-panel"
      onSubmit={handleMovieSubmit}
    >
      <input type="text" name="title" placeholder="Назва"
        value={title} onChange={e => setTitle(e.target.value)} />
      <input type="text" name="slogan" placeholder="Слоган"
        value={slogan} onChange={e => setSlogan(e.target.value)} />
      <input type="text" name="year" placeholder="Рік"
        value={year} onChange={e => setYear(e.target.value)} />
      <input type="text" name="age_limit" placeholder="Вікові обмеження"
        value={age_rate} onChange={e => setAge(e.target.value)} />
      <input type="text" name="country" placeholder="Країна"
        value={country} onChange={e => setCountry(e.target.value)} />
      <input type="text" name="original_title" placeholder="Оригінальна назва"
        value={original_title} onChange={e => setOriginalTitle(e.target.value)} />
      <input type="text" name="language" placeholder="Мова"
        value={language} onChange={e => setLanguage(e.target.value)} />

      <Select
        placeholder="Режисери"
        options={directorOptions}
        isMulti
        onChange={setSelectedDirectors}
        value={selectedDirectors}
      />

      <Select
        placeholder="Жанри"
        options={genreOptions}
        isMulti
        onChange={setSelectedGenres}
        value={selectedGenres}
      />

      <input type="text" name="duration" placeholder="Час"
        value={duration_minutes} onChange={e => setDuration(e.target.value)} />
      <Select
        placeholder="У головних ролях"
        options={actorOptions}
        isMulti
        onChange={setSelectedActors}
        value={selectedActors}
      />

      <textarea name="description" placeholder="Опис фільму"
        value={description} onChange={e => setDescription(e.target.value)} />

      <input type="url" name="image_link" placeholder="Посилання на фото"
        value={img_url} onChange={e => setImg(e.target.value)} />

      <input type="url" name="trailer_link" placeholder="Посилання на відео (YouTube)"
        value={trailer_url} onChange={e => setTrailer(e.target.value)} />

      <button type="submit">Зберегти фільм</button>

      {alertMessage && (
        <div className={`alert alert-${alertType} mt-3`} role="alert">
          {alertMessage}
        </div>
      )}
    </form>
  );
}