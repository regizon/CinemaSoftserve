import React, { useEffect, useState } from 'react';
import Select from 'react-select';

export default function FilmPage_ScheduleEdit({ movieId }) {
  const [sessions, setSessions] = useState([]);
  const [hallOptions, setHallOptions] = useState([]);
  const [sessionDate, setSessionDate] = useState('');
  const token = localStorage.getItem('access');

  useEffect(() => {
    if (!movieId) return;

    fetch(`/api/v1/public/sessions/?movie=${movieId}`)
      .then(res => res.json())
      .then(data => setSessions(data.results || []))
      .catch(err => console.error('Ошибка загрузки сеансів:', err));

    fetch('/api/v1/admin/halls/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const options = data.map(hall => ({ value: hall.id, label: hall.name }));
        setHallOptions(options);
      });
  }, [movieId]);

  const handleChange = (index, field, value) => {
    const updated = [...sessions];
    updated[index] = { ...updated[index], [field]: value };
    setSessions(updated);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Видалити цей сеанс?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/v1/admin/sessions/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setSessions(prev => prev.filter(s => s.id !== id));
      } else {
        alert('Не вдалося видалити сеанс');
      }
    } catch (err) {
      console.error('Помилка при видаленні:', err);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (const session of sessions) {
        await fetch(`/api/v1/admin/sessions/${session.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(session)
        });
      }
      alert('Сеанси оновлено');
    } catch (err) {
      console.error('Помилка при оновленні сеансів:', err);
    }
  };

  return (
    <div className="film-schedule">
      <form className="schedule-box" onSubmit={handleScheduleSubmit}>
        <h3>Редагування сеансів</h3>

        <label htmlFor="session_date">Обрати дату</label>
        <input
          type="date"
          id="session_date"
          value={sessionDate}
          onChange={e => setSessionDate(e.target.value)}
        />

        {sessions.map((s, idx) => (
          <div className="session-block" key={s.id}>
            <input
              type="time"
              value={s.start_time?.slice(11, 16) || ''}
              onChange={e => {
                const time = e.target.value;
                const iso = sessionDate
                  ? new Date(`${sessionDate}T${time}`).toISOString()
                  : s.start_time;
                handleChange(idx, 'start_time', iso);
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
            <button type="button" onClick={() => handleDelete(s.id)}>Видалити</button>
            <hr />
          </div>
        ))}
      </form>

      {/* кнопка вынесена за пределы scrollable формы */}
      <div className="button-wrapper">
        <button type="submit" onClick={handleScheduleSubmit}>
          Зберегти розклад
        </button>
      </div>
    </div>
  );
}
