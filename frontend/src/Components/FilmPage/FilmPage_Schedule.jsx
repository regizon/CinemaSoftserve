import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NotFound from "../../pages/NotFound";

export default function FilmPage_Schedule({ movieId }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    fetch(`/api/v1/public/sessions/?movie=${movieId}`)
      .then(res => res.json())
      .then(data => {
        if (data.detail) {
          setNotFound(true);
        } else {
          setSessions(Array.isArray(data.results) ? data.results : data);
        }
      })
      .catch(err => {
        console.error("Ошибка загрузки сеансов:", err);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [movieId]);

  if (notFound) return <NotFound />;
  if (loading) return <div>Загрузка...</div>;

  const sessionsByHall = {};
  sessions.forEach(session => {
    const hall = session.hall_name || "Невідомий зал";
    if (!sessionsByHall[hall]) sessionsByHall[hall] = [];
    sessionsByHall[hall].push(session);
  });

  return (
    <div className="film-schedule">
      <div className="schedule-header">
        <span>Розклад сеансів</span>
        <select>
          <option>Пт, 21 червня</option>
        </select>
      </div>
      <ul>
        {Object.entries(sessionsByHall).length === 0 ? (
          <li>Сеанси не знайдені</li>
        ) : (
          Object.entries(sessionsByHall).map(([hallName, hallSessions]) => (
            <React.Fragment key={hallName}>
              {hallSessions.map(session => {
                const time = new Date(session.start_time).toLocaleTimeString("uk-UA", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <li key={session.id}>
                    <span className="hall-name">{hallName}</span>
                    <br />
                    <Link to={`/booking/${session.id}`}>
                      {time} {session.is_3d ? "3D" : ""}
                    </Link>
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
