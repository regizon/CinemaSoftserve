import { useState, useEffect } from 'react';

export function useMeta() {
  const [actorOptions,    setActorOptions]    = useState([]);
  const [genreOptions,    setGenreOptions]    = useState([]);
  const [directorOptions, setDirectorOptions] = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal     = controller.signal;

    async function fetchEntities() {
      try {
        const res = await fetch('/api/v1/public/all-entities/', { signal });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }

        const data = await res.json();
        // actors → [{ value: id, label: director_name }]
        const aOpts = Array.isArray(data.actors)
          ? data.actors.map(a => ({
              value: a.id,
              label: a.actor_name || a.name || String(a.id),
            }))
          : [];
        setActorOptions(aOpts);

        // genres → [{ value: id, label: genre_name }]
        const gOpts = Array.isArray(data.genres)
          ? data.genres.map(g => ({
              value: g.id,
              label: g.genre_name,
            }))
          : [];
        setGenreOptions(gOpts);

        // directors → [{ value: id, label: director_name }]
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
    }

    fetchEntities();
    return () => controller.abort();
  }, []);

  return { actorOptions, genreOptions, directorOptions, loading, error };
}