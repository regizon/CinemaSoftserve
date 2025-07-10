import React, { useEffect, useState, useMemo } from 'react';
import Select from 'react-select';
import { useHalls } from '../../pages/Admin/useHalls';

export default function FilmPage_ScheduleEdit({ movieId }) {
  const [sessions, setSessions] = useState([]);
  
  const [sessionDate, setSessionDate] = useState('');
  const token = localStorage.getItem('access');
  const { hallOptions, loading: hallsLoading, error: hallsError } = useHalls(token);

  useEffect(() => {
    if (!movieId) return;

    // load sessions
    fetch(`/api/v1/public/sessions/?movie=${movieId}`)
      .then(res => res.json())
      .then(data => {
        const all = data.results || [];
        setSessions(all);

        const now = new Date();
        const upcomingDates = all
          .map(s => new Date(s.start_time))
          .filter(d => d >= now)
          .sort((a, b) => a - b);
        const defaultDate = (
          upcomingDates[0] || now
        )
          .toISOString()
          .slice(0, 10); // "YYYY-MM-DD"
        setSessionDate(defaultDate);
      })
      .catch(err => console.error('Ошибка загрузки сеансов:', err));

  }, [movieId, token]);

  const filteredSessions = useMemo(
    () =>
      sessions.filter(s => s.start_time.slice(0, 10) === sessionDate),
    [sessions, sessionDate]
  );

  const handleChange = (index, field, value) => {
    const updated = [...filteredSessions];
    updated[index] = { ...updated[index], [field]: value };
    const newAll = sessions.map(s =>
      s.id === updated[index].id ? updated[index] : s
    );
    setSessions(newAll);
  };

  const handleDelete = async (session) => {
    if (!session.id) {
      setSessions(prev => prev.filter(s => s !== session));
      return;
    }

    const confirmed = window.confirm('Видалити цей сеанс?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/v1/admin/sessions/${session.id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSessions(prev => prev.filter(s => s.id !== session.id));
      } else {
        alert('Не вдалося видалити сеанс');
      }
    } catch (err) {
      console.error('Помилка при видаленні:', err);
    }
  };

  const handleAdd = () => {
    const isoBase = `${sessionDate}T00:00:00.000Z`;
    const newSession = {
      start_time: isoBase,
      expire_time: isoBase,
      price: '',
      vip_price: '',
      hall: null,
      movie: movieId
    };
    setSessions(prev => [...prev, newSession]);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (const session of filteredSessions) {
        const payload = {
          start_time: session.start_time,
          expire_time: session.expire_time, 
          price: parseFloat(session.price),
          vip_price: parseFloat(session.vip_price),
          hall: session.hall,
          movie: movieId
        };

        if (session.id) {
          // update existing
          await fetch(`/api/v1/admin/sessions/${session.id}/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          });
        } else {
          // create new
          await fetch(`/api/v1/admin/sessions/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          });
        }
      }
      alert('Сеанси успішно збережені');
      // reload to pick up new IDs, etc.
      window.location.reload();
    } catch (err) {
      console.error('Помилка при оновленні сеансів:', err);
      alert('Сталася помилка при збереженні');
    }
  };

  return (
    <div className="film-schedule">
      <div claaName="schedule-title" style={{marginLeft: 35}}>
        <h3>Редагування сеансів</h3>

        <label htmlFor="session_date">Обрати дату</label><br/>
        <input
          type="date"
          id="session_date"
          value={sessionDate}
          onChange={e => setSessionDate(e.target.value)}
        />

        <button type="button" onClick={handleAdd}>
          Додати сеанс
        </button>
      </div>
      <form className="schedule-box" onSubmit={handleScheduleSubmit}>
        {filteredSessions.map((s, idx) => (
          <div className="session-block" key={s.id || `new-${idx}`}>
            <input
              type="time"
              value={s.start_time.slice(11, 16)}
              onChange={e => {
                const time = e.target.value;
                const iso = `${sessionDate}T${time}:00.000Z`;
                handleChange(idx, 'start_time', iso);
              }}
            />
            <input
              type="time"
              value={s.expire_time?.slice(11, 16) || ''}
              onChange={e => {
                const time = e.target.value;
                const iso = `${sessionDate}T${time}:00.000Z`;
                handleChange(idx, 'expire_time', iso);
              }}
            />
            <input
            
              type="number"
              placeholder="Ціна"
              value={s.price}
              onChange={e => handleChange(idx, 'price', e.target.value)}
            />
            <input
              type="number"
              placeholder="VIP-ціна"
              value={s.vip_price}
              onChange={e => handleChange(idx, 'vip_price', e.target.value)}
            />
            <Select
              options={hallOptions}
              value={hallOptions.find(o => o.value === s.hall) || null}
              onChange={opt => handleChange(idx, 'hall', opt.value)}
            />
            <button type="button" onClick={() => handleDelete(s)}>
              Видалити
            </button>
            <hr />
          </div>
        ))}

        <div className="button-wrapper">
          <button type="submit">Зберегти розклад</button>
        </div>
      </form>
    </div>
  );
}