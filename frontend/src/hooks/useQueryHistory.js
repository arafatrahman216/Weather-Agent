import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useQueryHistory() {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/query-history');
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch query history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return { history, fetchHistory };
}