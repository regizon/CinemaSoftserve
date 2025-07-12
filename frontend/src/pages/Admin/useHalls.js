import { useState, useEffect } from 'react';

export function useHalls(token) {
  const [hallOptions, setHallOptions] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    if (!token) {
      setError(new Error('No auth token'));
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal     = controller.signal;

    async function fetchHalls() {
      try {
        const res = await fetch('/api/v1/public/halls/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type':  'application/json',
          },
          signal,
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }

        const data = await res.json();
        const opts = Array.isArray(data.results)
          ? data.results.map(h => ({ value: h.id, label: String(h.hall_number) }))
          : [];
        console.log(opts)
        setHallOptions(opts);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching halls:', err);
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchHalls();

    return () => controller.abort();
  }, [token]);

  return { hallOptions, loading, error };
}