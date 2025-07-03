import React, { useEffect, useState } from 'react';
import './Auth.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
  
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState(''); 
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const userData = {
        username: username,
        password: password,
      };
  
      try {
        const response = await fetch('http://127.0.0.1:8000/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setUserName('');
          setPassword('');

          const access = data.access;
          localStorage.setItem('access', access);

          navigate('/profile')
          window.location.reload();
        } else {
          setAlertMessage(
            data?.detail || 'Помилка під час реєстрації. Перевірте дані.'
          );
          setAlertType('danger');
        }
      } catch (error) {
          console.error('Помилка при запиті:', error);
          setAlertMessage('Сервер недоступний. Спробуйте пізніше.');
          setAlertType('danger');
      }
    };


    return( 
        <div className="wrapper">
            <div className="container">
                <h1 className="title">Вхід до особистого кабінету</h1>
                {alertMessage && (
                <div className={`alert alert-${alertType} mt-3`} role="alert">
                    {alertMessage}
                </div>
                )}
                <form className="form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    className="input full"
                    required=""
                    value={username} onChange={(e) => setUserName(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    className="input full"
                    required=""
                    value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="submit-btn">
                    Увійти
                </button>
                </form>
                <div className="divider">
                <hr />
                <span>Або увійдіть за допомогою</span>
                <hr />
                </div>
                <button className="google-btn">
                <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="google-icon"
                />
                Продовжити за допомогою Google
                </button>
                <Link  to="/" className="back-link">⬅ Повернутись назад на сайт <strong>Svinkino</strong></Link>
            </div>
            </div>

    );
}
