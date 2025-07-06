import React, { useState, useEffect } from "react";
import './Profile.css'

export  default function Profile() {
  const token = localStorage.getItem('access');


  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchUser = async () => {
        try {
            const response = await fetch('/api/v1/profile/', {
                method: 'GET',
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type':  'application/json',
                },
        });
          const data = await response.json();
          console.log('Полученные данные:', data);
          setUser(data);
        } catch (error) {
          console.error("Помилка при завантаженні профіля:", error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchUser();
    }, []);
    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="page-wrapper">
            <div className="profile-wrapper">
            <h1 className="profile-title">Профіль</h1>
            <div className="content-row">
                <div className="profile-container">
                <div className="photo-upload" id="photoUpload">
                    <input type="file" id="photoInput" accept="image/*" hidden="true" />
                    <div className="photo-placeholder" id="photoPlaceholder">
                    <span>+</span>
                    </div>
                </div>
                <div className="profile-form">
                    <h2>Ім’я</h2>
                    <input type="text" name="name" placeholder={ user.first_name + " " + user.last_name} />
                    <h2>Безпека</h2>
                    <label htmlFor="phone" className="sub-label">
                    Номер телефону
                    </label>
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
                    placeholder={ user.email }
                    disabled=""
                    />
                    <h2>Зміна пароля</h2>
                    <input
                    type="password"
                    name="old_password"
                    placeholder="Старий пароль"
                    />
                    <input
                    type="password"
                    name="new_password"
                    placeholder="Новий пароль"
                    />
                    <input
                    type="password"
                    name="confirm_password"
                    placeholder="Підтвердіть новий пароль"
                    />
                    <h2>Купони</h2>
                    <div className="coupons">
                    <img src="img/movies/other/sales.png" />
                    <img src="img/movies/other/sales1.png" />
                    </div>
                </div>
                </div>
                <div className="tickets-panel">
                <h2 className="tickets-title">Квитки</h2>
                <div className="tickets-tabs">
                    <button className="ticket-tab active" data-tab="active">
                    Активні
                    </button>
                    <button className="ticket-tab" data-tab="history">
                    Історія
                    </button>
                </div>
                <div className="tickets-list active" id="active">
                    <div className="ticket-card">
                    <img
                        src="img/movies/elio.png"
                        className="ticket-poster"
                        alt="Еліо"
                    />
                    <div className="ticket-info">
                        <h3 className="ticket-movie">Еліо (3D)</h3>
                        <div className="ticket-details">
                        <span>Дата: 2025-07-05</span>
                        <span>Час: 18:00</span>
                        <span>Синій зал</span>
                        <span>Ряд: 1</span>
                        <span>Місце: 7</span>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="tickets-list" id="history">
                    <p>Наразі немає історії бронювань</p>
                </div>
                </div>
            </div>
            </div>
        </div>
    ); 
}
