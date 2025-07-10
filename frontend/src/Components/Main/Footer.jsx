import React from "react";
import "./footer.css"; // Подключи файл стилей, если есть

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-social">
          <div className="footer-icons-vertical">
            <div className="icon-row">
              <img src="/img/icons/youtube.svg" alt="YouTube" />
              <span>YouTube</span>
            </div>
            <div className="icon-row">
              <img src="/img/icons/facebook.svg" alt="Facebook" />
              <span>Facebook</span>
            </div>
            <div className="icon-row">
              <img src="/img/icons/insta.svg" alt="Instagram" />
              <span>Instagram</span>
            </div>
            <div className="icon-row">
              <img src="/img/icons/telega.svg" alt="Telegram" />
              <span>Telegram</span>
            </div>
          </div>
        </div>

        <div className="footer-column about">
          <div className="footer-title">Про нас</div>
          <p>
            Двохзальний кінотеатр "Svinkino" <br />
            Червоний зал на 150 місць. <br />
            Синій зал на 200 місць з активною системою 3D показу.
            <br />
            Проектори Epson EH-LS800, XGIMI Horizon Pro <br />
            Звукова система: Dolby Digital Surround EX 7.1 <br />
            Акустика: JBL <br />
            <br />
            м.Київ, вул.Абрама Вашингтона, буд.11
          </p>
        </div>

        <div className="footer-column">
          <div className="footer-title">Контакти</div>
          <p>
            Каса: <br />
            +380000000000
            <br />
            +380000000001 <br /> <br />
            Електронна пошта: <br />
            admin@svinkino.com <br />
            support@svinkino.com
          </p>
        </div>

        <div className="footer-column">
          <div className="footer-title">Підтримка</div>
          <ul>
            <li>
              <a href="#">Повернення квитків</a>
            </li>
            <li>
              <a href="#">Підтримка на сайті</a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <div className="footer-title">Робота</div>
          <ul>
            <li>
              <a href="#">Заповнити анкету</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 Кінотеатр "Svinkino". Усі права захищені.
      </div>
    </footer>
  );
}
