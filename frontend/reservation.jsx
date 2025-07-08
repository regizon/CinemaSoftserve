import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Reservation.css";

function Seat({ row, number, status, onToggle }) {
  return (
    <div
      className={`seat ${status}`}
      onClick={() => onToggle(row, number)}
    >
      {number}
    </div>
  );
}

function SeatRow({ rowIndex, seatsCount, seatStatusMap, onToggle }) {
  return (
    <div className="seat-row">
      <div className="row-label">{rowIndex}</div>
      {Array.from({ length: seatsCount }, (_, i) => {
        const num = i + 1;
        const key = `${rowIndex}-${num}`;
        const status = seatStatusMap[key] || "free";
        return (
          <Seat
            key={key}
            row={rowIndex}
            number={num}
            status={status}
            onToggle={onToggle}
          />
        );
      })}
    </div>
  );
}

export default function Reservation() {
  const { movieId } = useParams();
  const token = localStorage.getItem("access");

  // --- шаг 1: выбор сеанса ---
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);

  // --- шаг 2: выбор мест ---
  const [takenSeats, setTakenSeats] = useState({});     
  const [selectedSeats, setSelectedSeats] = useState([]);

  // схема зала и VIP
  const seatCounts = [14,16,16,18,20,22,22,24,24,26];
  const VIP_COUNT = 4;

  // загрузка всех сеансов по фильму
  useEffect(() => {
    fetch(`/api/v1/public/sessions/?movie=${movieId}`)
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data.results) ? data.results : data;
        setSessions(arr);
      })
      .catch(console.error)
      .finally(() => setLoadingSessions(false));
  }, [movieId]);

  // когда выбрали сеанс — грузим занятые места
  useEffect(() => {
    if (!selectedSession) return;
    fetch(`/api/v1/bookings/?session=${selectedSession.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data
          : Array.isArray(data.results) ? data.results
          : [];
        const map = {};
        arr.forEach(b => {
          map[`${b.row}-${b.seat_number}`] = true;
        });
        setTakenSeats(map);
      })
      .catch(console.error);
  }, [selectedSession]);

  const toggleSeat = (row, number) => {
    const key = `${row}-${number}`;
    // если занято — ничего не делаем
    if (takenSeats[key]) return;
    // если уже выбран — снимаем, иначе добавляем
    setSelectedSeats(prev =>
      prev.find(s => s.row===row && s.number===number)
        ? prev.filter(s => !(s.row===row && s.number===number))
        : [...prev, { row, number }]
    );
  };

  const handleBook = () => {
    Promise.all(
      selectedSeats.map(({ row, number }) =>
        fetch(`/api/v1/bookings/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            session: selectedSession.id,
            row,
            seat_number: String(number),
          }),
        })
      )
    )
      .then(() => {
        alert("Успішно заброньовано!");
        // отметим эти места как занятые
        setTakenSeats(prev => {
          const m = { ...prev };
          selectedSeats.forEach(s => { m[`${s.row}-${s.number}`] = true; });
          return m;
        });
        setSelectedSeats([]);
      })
      .catch(() => alert("Помилка бронювання"));
  };

  // карта статусов
  const seatStatusMap = {};
  selectedSeats.forEach(s => { seatStatusMap[`${s.row}-${s.number}`] = "selected"; });
  Object.keys(takenSeats).forEach(key => { seatStatusMap[key] = "taken"; });

  // сгруппировать сеансы по дате
  const sessionsByDate = sessions.reduce((acc, s) => {
    const date = new Date(s.start_time).toLocaleDateString("uk-UA");
    acc[date] = acc[date] || [];
    acc[date].push(s);
    return acc;
  }, {});

  // --- Рендерим ---

  // Фаза 1: выбор сеанса
  if (!selectedSession) {
    if (loadingSessions) {
      return <div className="cinema-page">Завантаження сеансів…</div>;
    }
    return (
      <div className="cinema-page">
        <h1>Виберіть сеанс</h1>
        {Object.entries(sessionsByDate).map(([date, list]) => (
          <div key={date} style={{ marginBottom: 20 }}>
            <h2>{date}</h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {list.map(s => {
                const time = new Date(s.start_time).toLocaleTimeString("uk-UA", {
                  hour: "2-digit", minute: "2-digit"
                });
                return (
                  <button
                    key={s.id}
                    className="continue-btn"
                    onClick={() => setSelectedSession(s)}
                  >
                    {time} {s.is_3d ? "3D" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Фаза 2: выбор мест
  const totalPrice = (selectedSession.price || 0) * selectedSeats.length;

  return (
    <div className="cinema-page">
      <button
        className="continue-btn"
        style={{ margin: 12 }}
        onClick={() => {
          setSelectedSession(null);
          setSelectedSeats([]);
          setTakenSeats({});
        }}
      >
        ← Назад до сеансів
      </button>

      <div className="movie-info">
        <h2>{new Date(selectedSession.start_time).toLocaleString("uk-UA", {
          weekday: "long", day: "2-digit", month: "2-digit",
          hour: "2-digit", minute: "2-digit"
        })}</h2>
        <p>Зал: {selectedSession.hall_name}</p>
        <p>Ціна: {selectedSession.price} грн</p>
      </div>
        
      <div className="cinema-wrapper">
        <div className="screen" />
        <div className="vip-row">
            {Array.from({ length: VIP_COUNT }, (_, i) => {
              const row = 0, number = i+1, key=`${row}-${number}`;
              const status = seatStatusMap[key] || "free";
              return (
                <Seat
                  key={key}
                  row={row}
                  number={number}
                  status={status}
                  onToggle={toggleSeat}
                />
              );
            })}
          </div>
        <div className="seating">
          {seatCounts.map((cnt, idx) => (
            <SeatRow
              key={idx}
              rowIndex={idx+1}
              seatsCount={cnt}
              seatStatusMap={seatStatusMap}
              onToggle={toggleSeat}
            />
          ))}
          
        </div>
      </div>

      <div className="side-panel">
        <h3>Вибрано ({selectedSeats.length})</h3>
        <div className="tickets-list1">
          {selectedSeats.map((s,i) => (
            <div className="ticket-item" key={i}>
              <button
                className="close-btn"
                onClick={() => toggleSeat(s.row, s.number)}
              >×</button>
              <p>Ряд {s.row}, місце {s.number}</p>
            </div>
          ))}
        </div>
        <div className="payment-summary">
          <div className="total-info">
            <span>Всього:</span>
            <span className="total-price">{totalPrice} грн</span>
          </div>
          <button
            className="continue-btn"
            disabled={!selectedSeats.length}
            onClick={handleBook}
          >
            Забронювати
          </button>
        </div>
      </div>
    </div>
  );
}