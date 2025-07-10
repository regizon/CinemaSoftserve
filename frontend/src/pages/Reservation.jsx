import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Reservation.css";


/** Компонент, который рисует и управляет местами для одного сеанса. */
function Seating({ session, token }) {
  const [takenSeats, setTakenSeats] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);

  const seatCounts = [14, 16, 16, 18, 20, 22, 22, 24, 24, 26];
  const VIP_COUNT = 4;

  // вспомогательная функция: докачиваем все страницы пагинации
  const fetchAllBookings = async (url, headers, acc = []) => {
    const res = await fetch(url, { headers });
    const json = await res.json();
    const pageArr = Array.isArray(json.results) ? json.results : Array.isArray(json) ? json : [];
    const all = acc.concat(pageArr);

    if (json.next) {
      return fetchAllBookings(json.next, headers, all);
    } else {
      return all;
    }
  };

  // сразу после mount или при смене session.id — грузим забронированные места
  useEffect(() => {
    setTakenSeats({});
    setSelectedSeats([]);

    const url = `/api/v1/bookings/?session=${session.id}&limit=10`;
    const headers = { Authorization: `Bearer ${token}` };

    fetchAllBookings(url, headers)
      .then(arr => {
        console.log(`Fetched ${arr.length} bookings across pages for session ${session.id}:`, arr);
        const filtered = arr.filter(b => b.session === session.id && b.status !== "CA");
        const map = {};
        filtered.forEach(b => {
          map[`${b.row}-${b.seat_number}`] = true;
        });
        setTakenSeats(map);
      })
      .catch(console.error);
  }, [session.id, token]);

  const toggleSeat = (row, number) => {
    const key = `${row}-${number}`;
    if (takenSeats[key]) return;
    setSelectedSeats(prev =>
      prev.some(s => s.row === row && s.number === number)
        ? prev.filter(s => !(s.row === row && s.number === number))
        : [...prev, { row, number }]
    );
  };

  const handleBook = () => {
    if (!selectedSeats.length) return;

    Promise.all(
      selectedSeats.map(({ row, number }) =>
        fetch(`/api/v1/bookings/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            session: session.id,
            row,
            seat_number: number
          })
        }).then(async res => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(`Помилка ${res.status}: ${JSON.stringify(errorData)}`);
          }
          return res.json();
        })
      )
    )
      .then(() => {
        alert("Успішно заброньовано!");
        setTakenSeats(prev => {
          const m = { ...prev };
          selectedSeats.forEach(s => {
            m[`${s.row}-${s.number}`] = true;
          });
          return m;
        });
        setSelectedSeats([]);
      })
      .catch(err => {
        console.error(err);
        alert("Помилка бронювання: " + err.message);
      });
  };

  // собираем карту статусов
  const seatStatusMap = {};
  selectedSeats.forEach(s => {
    seatStatusMap[`${s.row}-${s.number}`] = "selected";
  });
  Object.keys(takenSeats).forEach(k => {
    seatStatusMap[k] = "taken";
  });

  const Seat = ({ row, number, status }) => (
    <div className={`seat ${status}`} onClick={() => toggleSeat(row, number)}>
      {number}
    </div>
  );

  const SeatRow = ({ rowIndex, count }) => (
    <div className="seat-row">
      <div className="row-label">{rowIndex}</div>
      {Array.from({ length: count }, (_, i) => {
        const num = i + 1;
        const key = `${rowIndex}-${num}`;
        return (
          <Seat
            key={key}
            row={rowIndex}
            number={num}
            status={seatStatusMap[key] || "free"}
          />
        );
      })}
    </div>
  );

  const getPrice = row =>
    row === 1 ? parseFloat(session.vip_price) : parseFloat(session.price);
  const total = selectedSeats.reduce((sum, s) => sum + getPrice(s.row), 0);

  return (
    <>
      <div className="movie-info">
        <h2>
          {new Date(session.start_time).toLocaleString("uk-UA", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </h2>
        <p>Зал: {session.hall_name}</p>
        <p>Ціна: {session.price} грн / VIP: {session.vip_price} грн</p>
      </div>

      <div className="cinema-wrapper">
        <div className="screen" />
        <div className="seating">
          {seatCounts.map((count, i) => (
            <SeatRow key={i} rowIndex={i + 1} count={count} />
          ))}
          <div className="vip-row">
            {Array.from({ length: VIP_COUNT }, (_, i) => {
              const row = 1;
              const num = i + 1;
              const key = `${row}-${num}`;
              return (
                <Seat
                  key={key}
                  row={row}
                  number={num}
                  status={seatStatusMap[key] || "free"}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="side-panel">
        <h3>Вибрано ({selectedSeats.length})</h3>
        <div className="tickets-list1">
          {selectedSeats.map((s, i) => (
            <div className="ticket-item" key={i}>
              <button
                className="close-btn"
                onClick={() => toggleSeat(s.row, s.number)}
              >
                ×
              </button>
              <p>
                Ряд {s.row}, місце {s.number} — {getPrice(s.row).toFixed(2)} грн
              </p>
            </div>
          ))}
        </div>
        <div className="payment-summary">
          <div className="total-info">
            <span>Всього:</span>
            <span className="total-price">{total.toFixed(2)} грн</span>
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
    </>
  );
}

export default function Reservation() {
  const { movieId } = useParams();
  const token = localStorage.getItem("access");

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    fetch(`/api/v1/public/sessions/?movie=${movieId}`)
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data.results) ? data.results : data;
        setSessions(arr);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [movieId]);

  const byDate = sessions.reduce((acc, s) => {
    const d = new Date(s.start_time).toLocaleDateString("uk-UA");
    (acc[d] = acc[d] || []).push(s);
    return acc;
  }, {});

  if (!selectedSession) {
    if (loading) return <div className="cinema-page">Завантаження…</div>;
    return (
      <div className="cinema-page">
        <div className="session-list">
          {Object.entries(byDate).map(([date, list]) => (
            <React.Fragment key={date}>
              <h2 style={{ width: "100%", paddingLeft: 25 }}>{date}</h2>
              {list.map(s => {
                const time = new Date(s.start_time).toLocaleTimeString("uk-UA", {
                  hour: "2-digit",
                  minute: "2-digit"
                });
                return (
                  <div
                    key={s.id}
                    className="session-card"
                    onClick={() => setSelectedSession(s)}
                  >
                    <div className="time">{time}</div>
                    <div className="date">{date}</div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="cinema-page">
      <button className="back-btn" onClick={() => setSelectedSession(null)}>
        ← Назад до сеансів
      </button>
      <Seating key={selectedSession.id} session={selectedSession} token={token} />
    </div>
  );
}