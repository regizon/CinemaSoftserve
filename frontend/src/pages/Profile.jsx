import React, { useState, useEffect } from "react";
import './Profile.css';

export default function Profile() {
  const token = localStorage.getItem('access');

  const [user, setUser] = useState({});
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // "active" | "history"

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/v1/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Помилка при завантаженні профіля:", error);
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/v1/bookings/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setBookings(data.results || []);
      } catch (error) {
        console.error("Помилка при завантаженні бронювань:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchBookings();
  }, [token]);

  if (loading) return <div>Загрузка...</div>;

  const now = new Date();
  const pastBookings = bookings.filter(b => new Date(b.session_time) < now);
  const futureBookings = bookings.filter(b => new Date(b.session_time) >= now);
  const currentBookings = activeTab === 'history' ? pastBookings : futureBookings;

  return (
    <div className="page-wrapper">
      <div className="profile-wrapper">
        <h1 className="profile-title">Профіль</h1>
        <div className="content-row">
          <div className="profile-container">
            <div className="photo-upload" id="photoUpload">
              <input type="file" id="photoInput" accept="image/*" hidden />
              <div className="photo-placeholder" id="photoPlaceholder">
                <span>+</span>
              </div>
            </div>
            <div className="profile-form">
              <h2>Ім’я</h2>
              <input type="text" name="name" placeholder={user.first_name + " " + user.last_name} />
              <h2>Безпека</h2>
              <label htmlFor="phone" className="sub-label">Номер телефону</label>
              <input type="tel" id="phone" name="phone" placeholder={user.phone_number || "+380 (00) 000 0000"} />
              <h2>Електронна пошта</h2>
              <input type="email" name="email" placeholder={user.email} disabled />
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

            <div className="tickets-list active">
              {currentBookings.length === 0 ? (
                <p>Немає {activeTab === 'active' ? 'активних' : 'минулих'} квитків</p>
              ) : (
                currentBookings.map(booking => {
                  const date = new Date(booking.session_time);
                  const formattedDate = date.toLocaleDateString();
                  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div key={booking.id} className="ticket-card">
                      <img
                        src={booking.movie_img_url}
                        className="ticket-poster"
                        alt={booking.movie_title}
                      />
                      <div className="ticket-info">
                        <h3 className="ticket-movie">{booking.movie_title}</h3>
                        <div className="ticket-details">
                          <span>Дата: {formattedDate}</span>
                          <span>Час: {formattedTime}</span>
                          <span>Ряд: {booking.row}</span>
                          <span>Місце: {booking.seat_number}</span>
                          <span>Ціна: {booking.ticket_price}₴</span>
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
