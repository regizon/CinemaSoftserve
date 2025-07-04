<>
  {"{"}% extends "base.html" %{"}"}
  {"{"}% load static %{"}"}
  {"{"}% block title %{"}"}Редагування фільму{"{"}% endblock %{"}"}
  {"{"}% block content %{"}"}
  <div className="admin-panel">
    {/* Ліва частина */}
    <div className="left-panel">
      <div className="poster-upload">+</div>
      <button className="ticket-btn">Придбати квиток</button>
    </div>
    {/* Центральна частина */}
    <form method="POST" encType="multipart/form-data" className="center-panel">
      <input type="text" name="title" placeholder="Назва" />
      <input type="text" name="slogan" placeholder="Слоган" />
      <input type="text" name="release_date" placeholder="Дата виходу" />
      <input type="text" name="age_limit" placeholder="Вікові обмеження" />
      <input type="text" name="country" placeholder="Країна" />
      <input
        type="text"
        name="original_title"
        placeholder="Оригінальна назва"
      />
      <input type="text" name="language" placeholder="Мова" />
      <input type="text" name="director" placeholder="Режисер" />
      <input type="text" name="genre" placeholder="Жанр" />
      <input type="text" name="duration" placeholder="Час" />
      <input type="text" name="cast" placeholder="У головних ролях" />
      <textarea
        name="description"
        placeholder="Опис фільму"
        defaultValue={""}
      />
      <input
        type="url"
        name="trailer_link"
        placeholder="Посилання на відео (YouTube)"
      />
      <button type="submit">Зберегти фільм</button>
    </form>
    {/* Права частина: Розклад сеансів */}
    <div className="right-panel">
      <form method="POST" action="/submit-sessions" className="schedule-box">
        <div className="schedule-title">
          <h3>Розклад сеансів</h3>
        </div>
        <label htmlFor="session_date" className="date-label">
          Обрати дату сеансів
        </label>
        <input
          type="date"
          id="session_date"
          name="session_date"
          className="date-input"
          required=""
        />
        {/* Сеанс 1 */}
        <div className="session-block">
          <input type="time" name="session_time_1" />
          <input type="text" name="session_hall_1" placeholder="Зал" />
          <input
            type="text"
            name="session_format_1"
            placeholder="Формат (2D, 3D)"
          />
        </div>
        {/* Сеанс 2 */}
        <div className="session-block">
          <input type="time" name="session_time_2" />
          <input type="text" name="session_hall_2" placeholder="Зал" />
          <input
            type="text"
            name="session_format_2"
            placeholder="Формат (2D, 3D)"
          />
        </div>
        {/* Сеанс 3 */}
        <div className="session-block">
          <input type="time" name="session_time_3" />
          <input type="text" name="session_hall_3" placeholder="Зал" />
          <input
            type="text"
            name="session_format_3"
            placeholder="Формат (2D, 3D)"
          />
        </div>
        {/* Кнопка збереження */}
        <div className="button-wrapper">
          <button type="submit">Зберегти розклад</button>
        </div>
      </form>
    </div>
  </div>
  {/* Відео трейлер */}
  <div className="trailer">
    <iframe
      width={560}
      height={315}
      src="{{ trailer_link|default:'https://www.youtube.com/embed/' }}"
      title="Офіційний трейлер"
      frameBorder={0}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen=""
    ></iframe>
  </div>
  {"{"}% endblock %{"}"}
</>
