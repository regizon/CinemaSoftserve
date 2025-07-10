import { useState, useEffect, useCallback } from 'react';

export function useMeta() {
  const [actorOptions,    setActorOptions]    = useState([]);
  const [genreOptions,    setGenreOptions]    = useState([]);
  const [directorOptions, setDirectorOptions] = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);

  // 🔧 Вынеси fetchEntities наружу с useCallback
  const fetchEntities = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/public/all-entities/');
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const data = await res.json();

      const aOpts = Array.isArray(data.actors)
        ? data.actors.map(a => ({
            value: a.id,
            label: a.actor_name || a.name || String(a.id),
          }))
        : [];
      setActorOptions(aOpts);

      const gOpts = Array.isArray(data.genres)
        ? data.genres.map(g => ({
            value: g.id,
            label: g.genre_name,
          }))
        : [];
      setGenreOptions(gOpts);

      const dOpts = Array.isArray(data.directors)
        ? data.directors.map(d => ({
            value: d.id,
            label: d.director_name,
          }))
        : [];
      setDirectorOptions(dOpts);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching entities:', err);
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchEntities();
    return () => controller.abort();
  }, [fetchEntities]);

  return {
    actorOptions,
    genreOptions,
    directorOptions,
    loading,
    error,
    fetchEntities, // ✅ теперь доступен в AddMovie.jsx
  };
}
