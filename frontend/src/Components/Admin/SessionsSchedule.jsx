import React from 'react';
import Select from 'react-select';

export default function SessionsSchedule({
  createdMovie,
    movieTitle,
  sessionDate,
  setSessionDate,
  sessions,
  setSessions,
  hallOptions,
  handleScheduleSubmit,
}) {
  const handleSessionChange = (index, field, value) => {
    const updated = [...sessions];
    updated[index][field] = value;
    setSessions(updated);
  };

  return (
    <div className="right-panel">
      <div className="schedule-box">
        <h4 className="schedule-title">Додати сеанси</h4>
        {movieTitle && (
          <p style={{ textAlign: 'center', fontSize: '16px', color: '#ccc', marginTop: '-10px' }}>
            для <strong>{movieTitle}</strong>
          </p>
        )}
        <label className="date-label">Дата:</label>
        <input
          type="date"
          className="date-input"
          value={sessionDate}
          onChange={(e) => setSessionDate(e.target.value)}
        />

        {sessions.map((s, idx) => (
          <div key={idx} className="session-block">
            <input
              type="time"
              value={s.startTime}
              placeholder="Початок"
              onChange={(e) => handleSessionChange(idx, 'startTime', e.target.value)}
            />
            <input
              type="time"
              value={s.expireTime}
              placeholder="Кінець"
              onChange={(e) => handleSessionChange(idx, 'expireTime', e.target.value)}
            />
            <input
              type="number"
              value={s.price}
              placeholder="Ціна"
              onChange={(e) => handleSessionChange(idx, 'price', e.target.value)}
            />
            <input
              type="number"
              value={s.vip_price}
              placeholder="VIP-ціна"
              onChange={(e) => handleSessionChange(idx, 'vip_price', e.target.value)}
            />
            <Select
              options={hallOptions}
              value={hallOptions.find(h => h.value === +s.hall) || null}
              onChange={(opt) => handleSessionChange(idx, 'hall', opt.value)}
            />
          </div>
        ))}
      </div>

      {/* Кнопка вынесена за пределы скролла */}
      <div className="button-wrapper">
        <button onClick={handleScheduleSubmit}>
          Зберегти розклад
        </button>
      </div>
    </div>
  );
}
