import React, { useState, useEffect } from "react";
import './Profile.css';

export default function Profile() {
  const token = localStorage.getItem('access');
  const [user, setUser] = useState({});
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    async function fetchData() {
      const [profileRes, bookingsRes] = await Promise.all([
        fetch('/api/v1/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/v1/bookings/?limit=100', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);
      const profileData = await profileRes.json();
      const bookingsData = await bookingsRes.json();
      setUser(profileData);
      setBookings(bookingsData.results || []);
      setLoading(false);
    }
    fetchData();
  }, [token]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Ви дійсно хочете скасувати це бронювання?")) return;
    const res = await fetch(`/api/v1/bookings/${bookingId}/cancel/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (res.ok) {
      setBookings(prev =>
        prev.map(b => b.id === bookingId ? { ...b, status: 'CA' } : b)
      );
    } else {
      alert("Сталася помилка при скасуванні бронювання");
    }
  };

  if (loading) return <div>Загрузка...</div>;

  const now = new Date();
  // активні: майбутні і статус BK
  const activeBookings = bookings.filter(b =>
    b.status === 'BK' && new Date(b.session_time) >= now
  );
  // історія: або минулі BK, або будь-які CA
  const historyBookings = bookings.filter(b =>
    (b.status === 'BK' && new Date(b.session_time) < now) ||
    b.status === 'CA'
  );

  const current = activeTab === 'active' ? activeBookings : historyBookings;

  return (
    <div className="page-wrapper">
      <div className="profile-wrapper">
        <h1 className="profile-title">Профіль</h1>
        <div className="content-row">
          <div className="profile-container">
            <div className="photo-upload">
              <input type="file" accept="image/*" hidden />
              <div className="photo-placeholder"><span>+</span></div>
            </div>
            <div className="profile-form">
              <h2>Ім’я</h2>
              <input
                type="text"
                name="name"
                placeholder={`${user.first_name || ''} ${user.last_name || ''}`}
              />
              <h2>Безпека</h2>
              <label htmlFor="phone" className="sub-label">Номер телефону</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder={user.phone_number || "+380 (00) 000 0000"}
              />
              <h2>Електронна пошта</h2>
              <input
                type="email"
                name="email"
                placeholder={user.email || ''}
                disabled
              />
              <h2>Зміна пароля</h2>
              <input type="password" name="old_password" placeholder="Старий пароль" />
              <input type="password" name="new_password" placeholder="Новий пароль" />
              <input type="password" name="confirm_password" placeholder="Підтвердіть новий пароль" />
              <h2>Купони</h2>
              <div className="coupons">
                <img src="img/movies/other/sales.png" alt="Купон 1" />
                <img src="img/movies/other/sales1.png" alt="Купон 2" />
              </div>
            </div>
          </div>

          <div className="tickets-panel">
            <h2 className="tickets-title">Квитки</h2>
            <div className="tickets-tabs">
              <button
                className={`ticket-tab ${activeTab === 'active' ? 'active' : ''}`}
                onClick={() => setActiveTab('active')}
              >
                Активні
              </button>
              <button
                className={`ticket-tab ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                Історія
              </button>
            </div>

            {/* Active bookings list */}
            <div className={`tickets-list ${activeTab === 'active' ? 'active' : ''}`}>
              {activeBookings.length === 0 ? (
                <p>Немає активних квитків</p>
              ) : (
                activeBookings.map(b => {
                  const d = new Date(b.session_time);
                  const date = d.toLocaleDateString();
                  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={b.id} className="ticket-card">
                      <img src={b.movie_img_url} className="ticket-poster" alt={b.movie_title} />
                      <div className="ticket-info">
                        <h3 className="ticket-movie">{b.movie_title}</h3>
                        <div className="ticket-details">
                          <span>Дата: {date}</span>
                          <span>Час: {time}</span>
                          <span>Ряд: {b.row}</span>
                          <span>Місце: {b.seat_number}</span>
                          <span>Ціна: {b.ticket_price}₴</span>
                        </div>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => handleCancel(b.id)}
                        aria-label="Скасувати бронювання"
                      >
                        ×
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* History bookings list */}
            <div className={`tickets-list ${activeTab === 'history' ? 'active' : ''}`}>
              {historyBookings.length === 0 ? (
                <p>Немає минулих квитків</p>
              ) : (
                historyBookings.map(b => {
                  const d = new Date(b.session_time);
                  const date = d.toLocaleDateString();
                  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={b.id} className="ticket-card">
                      <img src={b.movie_img_url} className="ticket-poster" alt={b.movie_title} />
                      <div className="ticket-info">
                        <h3 className="ticket-movie">{b.movie_title}</h3>
                        <div className="ticket-details">
                          <span>Дата: {date}</span>
                          <span>Час: {time}</span>
                          <span>Ряд: {b.row + 1}</span>
                          <span>Місце: {b.seat_number}</span>
                          <span>Ціна: {b.ticket_price}₴</span>
                          {b.status === 'CA' && <span className="status-cancelled">Скасовано</span>}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}