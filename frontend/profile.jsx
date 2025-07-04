<>
  {"{"}% extends "base.html" %{"}"}
  {"{"}% load static %{"}"}
  {"{"}% block title %{"}"}Профіль{"{"}% endblock %{"}"}
  {"{"}% block content %{"}"}
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
            <img src="{% static 'images/sales.png' %}" />
            <img src="{% static 'images/sales1.png' %}" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="group">
    <div className="overlap-group-2">
      <div className="rectangle-5" />
      <p className="element-svinkino">
        © 2025 Кінотеатр "Svinkino"
        <br />
        Усі права захищені
      </p>
      <img className="union" src="{% static 'images/youtube.svg' %}" />
      <img className="union-2" src="{% static 'images/facebook.svg' %}" />
      <img className="union-3" src="{% static 'images/insta.svg' %}" />
      <svg
        className="union-4"
        height={32}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M23.1286 9.15893C23.2851 9.11913 23.4211 9.16379 23.5205 9.25179C23.6096 9.31324 23.6837 9.40178 23.7268 9.51518C23.7712 9.63244 23.7824 9.76037 23.7598 9.88393L23.2223 12.8259L22.5071 16.7804L21.5607 22.192C21.4732 22.6917 20.9587 22.9858 20.4937 22.8018L20.1196 22.6536C20.0547 22.6278 19.9935 22.5918 19.9393 22.5473L19.1143 21.8696L17.0571 20.1893L14.4223 18.1875C14.0805 17.9275 14.0564 17.4144 14.3723 17.1223L19.2437 12.6187L12.6545 16.6688C12.3758 16.84 12.038 16.8813 11.7277 16.7812L7.63036 15.4598C7.21475 15.3257 7.20733 14.7301 7.61964 14.5857L22.9482 9.21786C23.0056 9.1868 23.0669 9.16784 23.1286 9.15893Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24.6857 0C28.7253 0 32 3.27472 32 7.31429V24.6857C32 28.5989 28.927 31.7941 25.0625 31.9902L24.6857 32H7.31429L6.9375 31.9902C3.19784 31.8004 0.199592 28.8022 0.00982143 25.0625L0 24.6857V7.31429C0 3.27472 3.27472 2.20888e-08 7.31429 0H24.6857ZM7.31429 1.82857C4.28461 1.82857 1.82857 4.28461 1.82857 7.31429V24.6857C1.82857 27.7154 4.28461 30.1714 7.31429 30.1714H24.6857C27.7154 30.1714 30.1714 27.7154 30.1714 24.6857V7.31429C30.1714 4.28461 27.7154 1.82857 24.6857 1.82857H7.31429Z"
          fill="white"
        />
      </svg>
      <div className="text-wrapper-9">YouTube</div>
      <div className="text-wrapper-10">Facebook</div>
      <div className="text-wrapper-11">Instagram</div>
      <div className="text-wrapper-12">Telegram</div>
      <p className="svinkino">
        Двохзальний кінотеатр "Svinkino"
        <br />
        Червоний зал на&nbsp;150&nbsp;місць.
        <br />
        Синій зал на&nbsp;200&nbsp;місць з активною системою &nbsp;3D показу.
        <br />
        Проектори&nbsp;Epson EH-LS800, XGIMI Horizon Pro
        <br />
        Звукова система:&nbsp;Dolby Digital Surround EX 7.1
        <br />
        Акустика:&nbsp;JBL
        <br />
        <br />
        м.Київ, вул.Абрама Вашингтона, буд.11
      </p>
      <div className="element">
        Каса: <br />
        +380000000000
        <br />
        +380000000001
        <br />
        <br />
        Електронна пошта:
        <br />
        admin@svinkino.com
        <br />
        support@svinkino.com
      </div>
      <div className="text-wrapper-13">
        Повернення квитків
        <br />
        Підтримка на сайті
      </div>
      <div className="text-wrapper-14">Заповнити анкету</div>
      <div className="text-wrapper-15">Про НАС</div>
      <div className="text-wrapper-16">Контакти</div>
      <div className="text-wrapper-17">Підтримка</div>
      <div className="text-wrapper-18">Робота</div>
    </div>
  </div>
  {"{"}% endblock %{"}"}
</>
