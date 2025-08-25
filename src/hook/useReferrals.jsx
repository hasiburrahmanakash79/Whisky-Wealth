/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import apiClient from "../lib/api-client";

const useReferrals = (
  initialPage = 1,
  initialLimit = 10,
  initialStatus = "",
  initialSearch = ""
) => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(false);
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
      const response = await apiClient.get("/referrals", {
        params: {
          page,
          limit,
          status,
          search,
        },
      });

      console.log("API Response:", response.data); // Debug API response

      const { referrals, stats, pagination } = response.data.data;

      const mappedReferrals = referrals.map((referral) => ({
        id: referral._id || "N/A",
        referrerName: referral.referrer?.fullName || "N/A",
        referrerEmail: referral.referrer?.email || "N/A",
        refereeName: referral.referee?.fullName || "N/A",
        refereeEmail: referral.referee?.email || "N/A",
        rewardAmount: referral.rewardAmount
          ? referral.rewardAmount.toString()
          : "0",
        currency: referral.currency || "USD",
        status: referral.status || "pending",
        completedDate: referral.completedDate
          ? new Date(referral.completedDate).toLocaleDateString()
          : "N/A",
        firstPurchaseAmount: referral.firstPurchaseAmount
          ? referral.firstPurchaseAmount.toString()
          : "0",
        firstPurchaseDate: referral.firstPurchaseDate
          ? new Date(referral.firstPurchaseDate).toLocaleDateString()
          : "N/A",
        referralCode: referral.referralCode || "N/A",
        adminNotes: referral.adminNotes || "",
        totalPurchases: referral.totalPurchases || 0,
        totalPurchaseAmount: referral.totalPurchaseAmount || 0,
        pointsAwarded: referral.pointsAwarded || 0,
        rewardPaid: referral.rewardPaid || false,
      }));

      setReferrals(mappedReferrals);
      setTotalPages(pagination.pages || 1);
      setTotalReferrals(pagination.total || 0);
      setStats(stats || null);
      setError(null);
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to fetch referrals");
      setReferrals([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, search]);

  const updateReferralStatus = useCallback(
    async (referralId, newStatus) => {
      try {
        await apiClient.put(`/referrals/${referralId}/status`, {
          status: newStatus,
        });
        await fetchData(); // Refetch data to update the UI
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to update referral status"
        );
      }
    },
    [fetchData]
  );

  console.log("UseReferrals State:", {
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
  });

  useEffect(() => {
    let isMounted = true;
    fetchData().then(() => {
      if (!isMounted) return;
    });
    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  const updateLimit = (newLimit) => {
    if (limit !== newLimit) {
      setLimit(newLimit);
      setPage(1); // reset page when limit changes
    }
  };

  const updateStatus = (newStatus) => {
    if (status !== newStatus) {
      setStatus(newStatus);
      setPage(1); // reset page when status changes
    }
  };

  const updateSearch = (newSearch) => {
    if (search !== newSearch) {
      setSearch(newSearch);
      setPage(1); // reset page when search changes
    }
  };

  const updatePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage); // only update page without resetting
    }
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
