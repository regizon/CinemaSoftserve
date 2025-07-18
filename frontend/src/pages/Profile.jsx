import React, { useState, useEffect } from "react";
import './Profile.css';

export default function Profile() {
  const token = localStorage.getItem('access');
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [profileRes, bookingsRes] = await Promise.all([
        fetch('https://cinemasoftserve-8ejj.onrender.com/api/v1/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('https://cinemasoftserve-8ejj.onrender.com/api/v1/bookings/?limit=100', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);
      const profileData = await profileRes.json();
      const bookingsData = await bookingsRes.json();
      setUser(profileData);
      setFormData({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        phone_number: profileData.phone_number || '',
        old_password: '',
        new_password: '',
        confirm_password: '',
      });
      setBookings(bookingsData.results || []);
      setLoading(false);
    }
    fetchData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      setIsEdited(true);
      return updated;
    });
  };

  const handleUpdateProfile = async () => {
    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number,
    };

    if (formData.old_password || formData.new_password || formData.confirm_password) {
      if (formData.new_password !== formData.confirm_password) {
        alert("Новий пароль не збігається з підтвердженням");
        return;
      }
      payload.old_password = formData.old_password;
      payload.new_password = formData.new_password;
    }

    const res = await fetch('https://cinemasoftserve-8ejj.onrender.com/api/v1/profile/', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const updated = await res.json();
      setUser(updated);
      setIsEdited(false);
      alert("Профіль оновлено");
    } else {
      alert("Не вдалося оновити профіль");
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Ви дійсно хочете скасувати це бронювання?")) return;
    const res = await fetch(`https://cinemasoftserve-8ejj.onrender.com/api/v1/bookings/${bookingId}/cancel/`, {
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
  const activeBookings = bookings.filter(b =>
    b.status === 'BK' && new Date(b.session_time) >= now
  );
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

            <div className="profile-form">
              <h2>Ім’я</h2>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Ім’я"
              />

              <h2>Прізвище</h2>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Прізвище"
              />

              <h2>Безпека</h2>
              <label htmlFor="phone" className="sub-label">Номер телефону</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="+380 (00) 000 0000"
              />

              <h2>Електронна пошта</h2>
              <input
                type="email"
                name="email"
                value={user.email || ''}
                disabled
              />

              <h2>Зміна пароля</h2>
              <input
                type="password"
                name="old_password"
                value={formData.old_password}
                onChange={handleInputChange}
                placeholder="Старий пароль"
              />
              <input
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleInputChange}
                placeholder="Новий пароль"
              />
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                placeholder="Підтвердіть новий пароль"
              />

              <button
                className="edit-btn"
                disabled={!isEdited}
                onClick={handleUpdateProfile}
              >
                Редагувати
              </button>

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
                      <button className="delete-btn" onClick={() => handleCancel(b.id)}>×</button>
                    </div>
                  );
                })
              )}
            </div>

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