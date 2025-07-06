import React from 'react';
import Select from 'react-select';

const validateMovieData = (data) => {
  const errors = [];

  if (!data.title || data.title.trim() === '') {
    errors.push('Назва фільму є обов\'язковою');
  }

  if (!data.year || isNaN(data.year) || data.year < 1900 || data.year > new Date().getFullYear()) {
    errors.push('Рік має бути числом від 1900 до поточного року');
  }

  if (data.duration_minutes && (isNaN(data.duration_minutes) || data.duration_minutes <= 0)) {
    errors.push('Тривалість має бути позитивним числом');
  }

  if (data.age_rate && isNaN(data.age_rate)) {
    errors.push('Віковий рейтинг має бути числом');
  }

  if (data.img_url && !isValidUrl(data.img_url)) {
    errors.push('Посилання на фото має бути валідним URL');
  }

  if (data.trailer_url && !isValidUrl(data.trailer_url)) {
    errors.push('Посилання на трейлер має бути валідним URL');
  }

  if (!Array.isArray(data.directors) || data.directors.length === 0) {
    errors.push('Оберіть хоча б одного режисера');
  }

  if (!Array.isArray(data.genres) || data.genres.length === 0) {
    errors.push('Оберіть хоча б один жанр');
  }

  if (!Array.isArray(data.actors) || data.actors.length === 0) {
    errors.push('Оберіть хоча б одного актора');
  }

  return errors;
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const prepareMovieData = (formData) => {
  return {
    title: formData.title?.trim() || '',
    slogan: formData.slogan?.trim() || '',
    year: parseInt(formData.year) || null,
    age_rate: parseInt(formData.age_rate) || null,
    country: formData.country?.trim() || '',
    original_title: formData.original_title?.trim() || '',
    language: formData.language?.trim() || '',
    duration_minutes: parseInt(formData.duration_minutes) || null,
    description: formData.description?.trim() || '',
    img_url: formData.img_url?.trim() || '',
    trailer_url: formData.trailer_url?.trim() || '',
    directors: formData.selectedDirectors?.map(d => d.value) || [],
    genres: formData.selectedGenres?.map(g => g.value) || [],
    actors: formData.selectedActors?.map(a => a.value) || []
  };
};

const validateAndSendData = async (data, onSuccess, onError) => {
  try {
    const movieData = prepareMovieData(data);

    const validationErrors = validateMovieData(movieData);

    if (validationErrors.length > 0) {
      onError(validationErrors.join('; '));
      return;
    }

    const jsonString = JSON.stringify(movieData);

    const parsedData = JSON.parse(jsonString);

    if (typeof parsedData !== 'object' || parsedData === null) {
      throw new Error('Неправильна структура даних');
    }

    console.log('Дані для відправки:', parsedData);
    console.log('JSON рядок:', jsonString);

    onSuccess('Дані успішно підготовлені для відправки!');

  } catch (error) {
    console.error('Помилка при обробці даних:', error);
    onError(`Помилка при обробці даних: ${error.message}`);
  }
};

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
  poster_url, setPoster,
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

  const handleSubmitWithValidation = async (e) => {
    e.preventDefault();

    const formData = {
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
      trailer_url,
      selectedDirectors,
      selectedActors,
      selectedGenres
    };

    await validateAndSendData(
      formData,
      (successMessage) => {
        console.log(successMessage);
        handleMovieSubmit(e);
      },
      (errorMessage) => {
        console.error(errorMessage);
        alert(errorMessage);
      }
    );
  };

  return (
    <form
      method="POST"
      encType="multipart/form-data"
      className="center-panel"
      onSubmit={handleSubmitWithValidation}
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

      <input type="url" name="poster_link" placeholder="Посилання на постер (якщо необхідно)"
        value={poster_url} onChange={e => setPoster(e.target.value)} />

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