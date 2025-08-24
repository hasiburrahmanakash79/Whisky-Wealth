import { useState, useEffect, useCallback } from "react";
import apiClient from "../lib/api-client";

const useUserData = (
  initialPage = 1,
  initialLimit = 10,
  initialSearch = ""
) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState(initialSearch);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [rewardData, setRewardData] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/users", {
        params: {
          page,
          limit,
          search,
        },
      });
      // Map API response fields to match component expectations
      const mappedUsers = response.data.data.users.map((user) => ({
        id: user.id,
        name: user.fullName,
        email: user.email,
        casks: user.balance.toString(), // Map balance to casks
        status: user.isActive ? "Active" : "Inactive", // Map isActive to status
      }));
      setUsers(mappedUsers);
      setRewardData(response.data.data.users);
      setTotalPages(response.data.data.pagination.pages);
      setTotalUsers(response.data.data.pagination.total);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
      setUsers(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

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

  const updateSearch = (newSearch) => {
    setSearch(newSearch);
    setPage(1); // Reset to first page when search changes
  };

  return {
    users,
    loading,
    error,
    page,
    limit,
    search,
    totalPages,
    totalUsers,
    updatePage,
    updateLimit,
    updateSearch,
    refetch: fetchData,
    rewardData,
    setRewardData,
  };
};

export default useUserData;
