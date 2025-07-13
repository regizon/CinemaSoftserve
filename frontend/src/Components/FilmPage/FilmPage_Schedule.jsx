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
    if (!movieId) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      try {
        const res = await fetch(`https://cinemasoftserve-8ejj.onrender.com/api/v1/public/sessions/?movie=${movieId}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        const list = Array.isArray(data.results) ? data.results : [];

        if (!list.length) {
          setNotFound(true);
          return;
        }

        setSessions(list);

        const availableDates = Array.from(new Set(
          list.map(s => s.start_time?.slice(0, 10)).filter(Boolean)
        )).sort();

        const today = new Date().toISOString().slice(0, 10);
        setSelectedDate(availableDates.includes(today) ? today : availableDates[0] || "");
      } catch (error) {
        console.error("Помилка завантаження сеансів:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [movieId]);

  if (loading || hallsLoading) return <div>Завантаження…</div>;
  if (hallsError) console.warn("Помилка при завантаженні залів:", hallsError); // не мешает отрисовке

  const filteredSessions = sessions.filter(
    s => s.start_time?.slice(0, 10) === selectedDate
  );

  const sessionsByHall = {};

  filteredSessions.forEach(session => {
    const hall = hallOptions?.find?.(h => h.value === session.hall);
    const hallName = session.hall_name || hall?.label || "—";

    if (!sessionsByHall[hallName]) sessionsByHall[hallName] = [];
    sessionsByHall[hallName].push(session);
  });

  const dateOptions = Array.from(
    new Set(sessions.map(s => s.start_time?.slice(0, 10)).filter(Boolean))
  ).sort();

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
        {filteredSessions.length === 0 ? (
          <li>Сеансів на цю дату не знайдено</li>
        ) : (
          Object.entries(sessionsByHall).map(([hallName, hallSessions]) => (
            <React.Fragment key={hallName}>
              <li className="hall-header" style={{ marginLeft: 150 }}>
                <strong>{hallName}</strong>
              </li>
              {hallSessions.map(session => {
                const time = session.start_time
                  ? new Date(session.start_time).toLocaleTimeString("uk-UA", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  : "??:??";

                return (
                  <li key={session.id}>
                    <Link>
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