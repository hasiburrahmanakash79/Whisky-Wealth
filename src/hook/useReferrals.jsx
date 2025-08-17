import { useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/api-client';

const useReferrals = (initialPage = 1, initialLimit = 20, initialStatus = 'completed', initialSearch = 'james') => {
  const [referrals, setReferrals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [status, setStatus] = useState(initialStatus);
  const [search, setSearch] = useState(initialSearch);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [stats, setStats] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/referrals', {
        params: {
          page,
          limit,
          status,
          search,
        },
      });
      // Map API response fields to match component expectations
      const mappedReferrals = response.data.data.referrals.map(referral => ({
        id: referral._id,
        referrerName: referral.referrerInfo[0]?.fullName || 'N/A',
        refereeName: referral.refereeInfo[0]?.fullName || 'N/A',
        refereeEmail: referral.refereeInfo[0]?.email || 'N/A',
        rewardAmount: referral.rewardAmount.toString(),
        currency: referral.currency,
        status: referral.status,
        completedDate: referral.completedDate ? new Date(referral.completedDate).toLocaleDateString() : 'N/A',
        firstPurchaseAmount: referral.firstPurchaseAmount.toString(),
      }));
      setReferrals(mappedReferrals);
      setTotalPages(response.data.data.pagination.pages);
      setTotalReferrals(response.data.data.pagination.total);
      setStats(response.data.data.stats);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch referrals');
      setReferrals(null);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, search]);

  const updateReferralStatus = useCallback(async (referralId, newStatus) => {
    try {
      await apiClient.put(`/referrals/${referralId}/status`, { status: newStatus });
      await fetchData(); // Refetch data to update the UI
    } catch (err) {
      setError(err.message || 'Failed to update referral status');
    }
  }, [fetchData]);

  useEffect(() => {
    let isMounted = true;

    fetchData().then(() => {
      if (!isMounted) return;
    });

    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  const updatePage = (newPage) => {
    setPage(newPage);
  };

  const updateLimit = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  };

  const updateStatus = (newStatus) => {
    setStatus(newStatus);
    setPage(1); // Reset to first page when status changes
  };

  const updateSearch = (newSearch) => {
    setSearch(newSearch);
    setPage(1); // Reset to first page when search changes
  };

  return {
    referrals,
    loading,
    error,
    page,
    limit,
    status,
    search,
    totalPages,
    totalReferrals,
    stats,
    updatePage,
    updateLimit,
    updateStatus,
    updateSearch,
    refetch: fetchData,
    updateReferralStatus,
  };
};

export default useReferrals;