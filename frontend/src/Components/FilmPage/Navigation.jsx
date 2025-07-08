import React, { useState, useRef, useEffect } from 'react';

const genres = ['Пригоди', 'Жахи', 'Екшн', 'Фентезі', 'Комедія'];

export default function FilterButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const dropdownRef = useRef(null);

  const toggleDropdown = (e) => {
    e.preventDefault(); // предотвратить переход по ссылке
    setIsOpen(prev => !prev);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  // Закрытие при клике вне меню
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <a href="#" className="nav" onClick={toggleDropdown}>
        <img src="/img/icons/filtr.svg" alt="Фільтр" /> Фільтр
      </a>

      {isOpen && (
        <div
          className="genre-filter-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            boxShadow: '0px 2px 6px rgba(0,0,0,0.2)',
            padding: '10px',
            borderRadius: '8px',
            marginTop: '5px',
            zIndex: 100,
              fontSize: '23px'
          }}
        >
          {genres.map((genre) => (
            <div key={genre}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleGenreChange(genre)}
                />
                {' '}
                {genre}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
