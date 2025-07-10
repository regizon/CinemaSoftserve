import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NotFound from "../../pages/NotFound";
import { useHalls } from "../../pages/Admin/useHalls";

export default function FilmPage_Schedule({ movieId }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const token = localStorage.getItem("access");
  const { hallOptions, loading: hallsLoading, error: hallsError } = useHalls(token);

  useEffect(() => {
    if (!movieId) return;

    fetch(`/api/v1/public/sessions/?movie=${movieId}`)
      .then(res => res.json())
      .then(data => {
        if (data.detail) {
          setNotFound(true);
        } else {
          const list = Array.isArray(data.results) ? data.results : data;
          setSessions(list);

          // Выбор текущей или ближайшей даты
          const dates = Array.from(new Set(
            list.map(s => s.start_time.slice(0, 10))
          )).sort();

          const today = new Date().toISOString().slice(0, 10);
          setSelectedDate(dates.includes(today) ? today : dates[0] || "");
        }
      })
      .catch(err => {
        console.error("Ошибка загрузки сеансів:", err);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [movieId]);

  if (notFound) return <NotFound />;
  if (loading || hallsLoading) return <div>Завантаження…</div>;
  if (hallsError) return <div>Помилка при завантаженні залів</div>;

  // Сессии на выбранную дату
  const daySessions = sessions.filter(s => s.start_time.slice(0, 10) === selectedDate);

  // Группировка по залам
  const sessionsByHall = {};
  daySessions.forEach(session => {
    const hallOption = hallOptions.find(h => h.value === session.hall);
    const hallName = session.hall_name || hallOption?.label || "Невідомий зал";
    if (!sessionsByHall[hallName]) {
      sessionsByHall[hallName] = [];
    }
    sessionsByHall[hallName].push(session);
  });

  // Все доступные даты
  const dateOptions = Array.from(new Set(sessions.map(s => s.start_time.slice(0, 10)))).sort();

  return (
    <div className="film-schedule">
      <div className="schedule-header">
        <span>Розклад сеансів</span>
        <select
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        >
          {dateOptions.map(date => (
            <option key={date} value={date}>
              {new Date(date).toLocaleDateString("uk-UA", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit"
              })}
            </option>
          ))}
        </select>
      </div>

      <ul>
        {daySessions.length === 0 ? (
          <li>Сеанси не знайдені</li>
        ) : (
          Object.entries(sessionsByHall).map(([hallName, hallSessions]) => (
            <React.Fragment key={hallName}>
              <li className="hall-header" style={{marginLeft: 150}}><strong>{hallName}</strong></li>
              {hallSessions.map(session => {
                const time = new Date(session.start_time).toLocaleTimeString("uk-UA", {
                  hour: "2-digit",
                  minute: "2-digit"
                });
                return (
                  <li key={session.id}>
                    <Link to={`/booking/${session.id}`}>
                      {time}, {session.is_3d ? "3D" : "2D"}
                    </Link>
                    <hr />
                  </li>
                );
              })}
            </React.Fragment>
          ))
        )}
      </ul>
    </div>
  );
}