import React from 'react';

export default function FilmPage_Trailer( {trailer_url}) {
    return (
    <div className="trailer">
            <iframe
              width={696}
              height={392}
              src={trailer_url}
              title="YouTube video player"
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen=""
            />
    </div>);
}