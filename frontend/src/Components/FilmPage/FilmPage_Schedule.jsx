import React from "react"
import { Link } from "react-router-dom"

export default function Shedule() {
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
