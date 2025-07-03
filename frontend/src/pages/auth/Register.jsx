import React, { useEffect, useState } from 'react';
import './Auth.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username: username,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      role: "US"
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        setAlertMessage('Реєстрація успішна!');
        setAlertType('success');
        // Очистить поля формы:
        setFirstName('');
        setLastName('');
        setUsername('');
        setEmail('');
        setPassword('');
        navigate('/profile')
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
  return ( <>
    <div className="wrapper">
      <div className="container">
        <h1 className="title">Реєстрація</h1>
            {alertMessage && (
            <div className={`alert alert-${alertType} mt-3`} role="alert">
                {alertMessage}
            </div>
            )}
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-row">
            <input type="text" placeholder="Ім’я" className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input type="text" placeholder="Прізвище" className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <input type="text" placeholder="Nickname" className="input full" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="email" placeholder="Email" className="input full" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Пароль" className="input full" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="submit-btn">Зареєструватися</button>
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
  </>
  );
}