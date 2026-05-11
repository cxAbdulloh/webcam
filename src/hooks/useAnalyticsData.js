import { useState, useEffect, useCallback } from 'react';
import {
  getStats,
  getVisitorActivity,
  getPeakLoad,
  getTrafficByGender,
  getCameras,
} from '../api/analyticsApi';

const REFRESH_INTERVAL = 30_000;

export function useAnalyticsData() {
  const [data, setData] = useState({
    stats:           null,
    visitorActivity: null,
    peakLoad:        null,
    genderTraffic:   null,
    cameras:         null,
  });

  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setError(null);
      const [stats, visitorActivity, peakLoad, genderTraffic, cameras] =
        await Promise.all([
          getStats(),
          getVisitorActivity(),
          getPeakLoad(),
          getTrafficByGender(),
          getCameras(),
        ]);

      setData({ stats, visitorActivity, peakLoad, genderTraffic, cameras });
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Auto-refresh
  useEffect(() => {
    const id = setInterval(fetchAll, REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [fetchAll]);

  return { data, loading, error, refetch: fetchAll, lastUpdated };
}


export function useTabData(activeTab) {
  const [tabLoading, setTabLoading] = useState(false);
  const { data, loading, error, refetch, lastUpdated } = useAnalyticsData();

  const handleTabChange = useCallback(async () => {
    setTabLoading(true);
    await refetch();
    setTabLoading(false);
  }, [refetch]);

  return {
    data,
    loading: loading || tabLoading,
    error,
    refetch: handleTabChange,
    lastUpdated,
  };
}
