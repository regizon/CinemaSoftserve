import React from 'react';
import Select from 'react-select';

export default function SessionsSchedule({
  createdMovie,
  sessionDate,
  setSessionDate,
  sessions,
  setSessions,
  handleScheduleSubmit,
  hallOptions,
  token,
}) {
  // Обработчик для любых полей сеанса
  const handleChange = (index, field, value) => {
    const copy = [...sessions];
    copy[index][field] = value;
    setSessions(copy);
  };

  return (
    <div className="right-panel">
      <form method="POST" className="schedule-box" onSubmit={handleScheduleSubmit}>
        <div className="schedule-title">
          <h3>Розклад сеансів</h3>
        </div>
        <div className="schedule-title">
          <h3>
            {createdMovie
              ? `"${createdMovie.title}"`
              : "'Назва фільму'"}
          </h3>
        </div>

        {/* Дата сеансів */}
        <label htmlFor="session_date" className="date-label">
          Обрати дату сеансів
        </label>
        <input
          type="date"
          id="session_date"
          name="session_date"
          className="date-input"
          value={sessionDate}
          onChange={e => setSessionDate(e.target.value)}
          
        />

        {/* Три блока сеансів */}
        {sessions.map((session, idx) => (
          <div className="session-block" key={idx}>
            {/* Время начала */}
            <input
                type="time"
                name={`session_start_${idx + 1}`}
                value={session.startTime || ''}
                onChange={e => {
                    const time = e.target.value;           
                    handleChange(idx, 'startTime', time);  
                }}
                
                />

                {/* Время окончания */}
                <input
                type="time"
                name={`session_end_${idx + 1}`}
                value={session.expireTime || ''}
                onChange={e => {
                    const time = e.target.value;             
                    handleChange(idx, 'expireTime', time);   
                }}
  
            />

            {/* Выбор зала */}
            <Select
              className="select-hall"
              placeholder="Зал"
              options={hallOptions}
              onChange={opt => handleChange(idx, 'hall', opt.value)}
              value={hallOptions.find(o => o.value === session.hall) || null}
              styles={{                        // а сюда «засовываем» наш стиль
                option: (base) => ({
                  ...base,
                  color: 'black',              // текст каждой опции будет чёрным
                }),
              }}
            />

            {/* Цена */}
            <input
              type="number"
              name={`session_price_${idx + 1}`}
              placeholder="Ціна"
              value={session.price}
              onChange={e => handleChange(idx, 'price', e.target.value)}
              
            />

            {/* VIP-ціна */}
            <input
              type="text"
              name={`session_vip_${idx + 1}`}
              placeholder="VIP-ціна"
              value={session.vip_price}
              onChange={e => handleChange(idx, 'vip_price', e.target.value)}
            />
            <hr color='white'/>
          </div>
        ))}

        <div className="button-wrapper">
          <button type="submit">Зберегти розклад</button>
        </div>
      </form>
    </div>
  );
}