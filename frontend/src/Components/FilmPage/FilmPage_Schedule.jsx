import React from "react"
import { Link } from "react-router-dom"
import NotFound from "../../pages/NotFound";

export default function Shedule() {
           
  const [movie, setMovie] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/public/sessions/${id}/`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.detail) {
          setNotFound(true); // если ответ содержит "detail", это ошибка
        } else {
          setMovie(data); // нормальный ответ
        }
      })
      .catch(err => console.error(err));
  }, [id]);
  if (notFound) return <NotFound />
  if (!movie) return <div>Загрузка...</div>;

    return(
        <div className="film-schedule">
        <div className="schedule-header">
          <span>Розклад сеансів</span>
          <select>
            <option>Пт, 21 червня</option>
          </select>
        </div>
        <ul>
          <li>
            <span className="hall-name">Червоний зал</span>
            <br />
            <a href="#">9:15</a>
          </li>
          <li>
            <span className="hall-name">Червоний зал</span>
            <br />
            <a href="#">13:15</a>
          </li>
          <li>
            <span className="hall-name">Синій зал</span>
            <br />
            <a href="#">17:20 3D</a>
          </li>
        </ul>
      </div>
    );
}
