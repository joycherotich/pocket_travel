import { useState, useEffect } from "react";
import api from "../services/api";

export default function useApi(endpoint, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get(endpoint)
      .then(r => mounted && setData(r.data))
      .catch(e => mounted && setError(e))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, deps);

  return { data, loading, error };
}
