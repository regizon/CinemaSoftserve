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
            <div className="profile-container">
                <div className="photo-upload" id="photoUpload">
                <input type="file" id="photoInput" accept="image/*" hidden="" />
                <div className="photo-placeholder" id="photoPlaceholder">
                    <span>+</span>
                </div>
                </div>
                <div className="profile-form">
                <h2>Ім’я</h2>
                <input type="text" name="name" placeholder="Віктор Кроліков" />
                <h2>Безпека</h2>
                <label htmlFor="phone" className="sub-label">
                    Номер телефону
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+380 (00) 000 0000"
                />
                <h2>Електронна пошта</h2>
                <input
                    type="email"
                    name="email"
                    placeholder="viktorkrolik@svinkino.com"
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
                    <img src="images/sales.png" />
                    <img src="images/sales1.png" />
                </div>
                </div>
            </div>
            </div>
        </div>
    ); 
}
