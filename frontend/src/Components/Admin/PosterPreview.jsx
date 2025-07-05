import React from 'react';

export default function PosterPrewiev({ img_url }) {
  return (
    <div className="left-panel">
      <img alt="" />
      <div className="poster-upload">
        <img src={img_url} alt="Постер фільму" style={{ maxWidth: '100%', height: 'auto' }} />
      </div>
      <button className="ticket-btn">Придбати квиток</button>
    </div>
  );
}