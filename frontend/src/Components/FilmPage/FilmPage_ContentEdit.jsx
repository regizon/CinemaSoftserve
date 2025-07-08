import React from 'react';
import Select from 'react-select';

export default function FilmPage_ContentEdit({
  title,
  slogan,
  year,
  age_rate,
  country,
  original_title,
  language,
  duration_minutes,
  description,
  img_url,
  poster_url,
  trailer_url,
  onFieldChange,
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
      className="center-panel"
      onSubmit={(e) => handleMovieSubmit(e)} // ✅ передаём e
    >
      <input type="text" name="title" placeholder="title"
        value={title} onChange={e => onFieldChange('title', e.target.value)} />
      <input type="text" name="slogan" placeholder="slogan"
        value={slogan} onChange={e => onFieldChange('slogan', e.target.value)} />
      <input type="text" name="year" placeholder="year"
        value={year} onChange={e => onFieldChange('year', e.target.value)} />
      <input type="text" name="age_limit" placeholder="Вікові обмеження"
        value={age_rate} onChange={e => onFieldChange('age_rate', e.target.value)} />
      <input type="text" name="country" placeholder="Країна"
        value={country} onChange={e => onFieldChange('country', e.target.value)} />
      <input type="text" name="original_title" placeholder="Оригінальна назва"
        value={original_title} onChange={e => onFieldChange('original_title', e.target.value)} />
      <input type="text" name="language" placeholder="Мова"
        value={language} onChange={e => onFieldChange('language', e.target.value)} />

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
        value={duration_minutes} onChange={e => onFieldChange('duration_minutes', e.target.value)} />
      <Select
        placeholder="У головних ролях"
        options={actorOptions}
        isMulti
        onChange={setSelectedActors}
        value={selectedActors}
      />

      <textarea name="description" placeholder="Опис фільму"
        value={description} onChange={e => onFieldChange('description', e.target.value)} />

      <input type="url" name="image_link" placeholder="Посилання на фото"
        value={img_url} onChange={e => onFieldChange('img_url', e.target.value)} />

      <input type="url" name="poster_link" placeholder="Посилання на постер (якщо необхідно)"
        value={poster_url} onChange={e => onFieldChange('poster_url', e.target.value)} />

      <input type="url" name="trailer_link" placeholder="Посилання на відео (YouTube)"
        value={trailer_url} onChange={e => onFieldChange('trailer_url', e.target.value)} />

      <button type="submit">Зберегти фільм</button>

      {alertMessage && (
        <div className={`alert alert-${alertType} mt-3`} role="alert">
          {alertMessage}
        </div>
      )}
    </form>
  );
}
