import React from 'react';

export default function TrailerPlayer({ trailer_url }) {
  return (
    <div className="trailer">
      <iframe
        width={560}
        height={315}
        src={trailer_url}
        title="Офіційний трейлер"
        frameBorder={0}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}