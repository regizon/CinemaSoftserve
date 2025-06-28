import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1>404 — Сторінка не знайдена!</h1>
        <Link  to="/" className="back-home">← На головну.</Link>
      </div>
    </div>
  );
}