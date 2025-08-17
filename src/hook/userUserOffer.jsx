import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import apiClient from '../lib/api-client';

const useUserOffer = (
  initialPage = 1,
  initialLimit = 20,
  initialSearch = '',
  initialType = 'cask',
  initialMinPrice = 1000,
  initialMaxPrice = 20000
) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(searchInput, 500);
  const [type, setType] = useState(initialType);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOffers, setTotalOffers] = useState(0);

  // Map API response to frontend format
  const mapOfferData = (offer) => ({
    id: offer.id,
    offerName: offer.title || 'N/A',
    type: offer.type || 'N/A',
    price: offer.priceNumeric ? offer.priceNumeric.toString() : '0',
    status: offer.isActive ? 'Active' : 'Inactive',
    Deadline: offer.expiryDate ? offer.expiryDate.split('T')[0] : 'N/A',
    description: offer.description || '',
    image: offer.image || '',
    category: offer.category || 'standard',
    daysLeft: offer.daysLeft || 0,
    details: {
      distillery: offer.details?.distillery || '',
      caskType: offer.details?.caskType || '',
      vintage: offer.details?.vintage || '',
      abv: offer.details?.abv || '',
      volume: offer.details?.volume || '',
    },
  });

  // Fetch offers from API
  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/offers', {
        params: {
          page,
          limit,
          search: debouncedSearch,
          type,
          minPrice,
          maxPrice,
        },
      });
      const mappedOffers = response.data.data.offers.map(mapOfferData);
      setOffers(mappedOffers);
      setTotalPages(response.data.data.pagination.pages || 1);
      setTotalOffers(response.data.data.pagination.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch offers');
      setOffers([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, type, minPrice, maxPrice]);

  // Upload file to server
  const uploadFile = async (file) => {
    if (!file) return null;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post('/offers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.url; // Expecting { url: string } in response
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to upload image');
    }
  };

  // Add a new offer
  const addOffer = async (offerData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      const requiredFields = ['offerName', 'type', 'price', 'deadline', 'status'];
      const missingFields = requiredFields.filter((field) => !offerData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Prepare payload (adjust based on server requirements)
      const payload = {
        title: offerData.offerName,
        type: offerData.type,
        priceNumeric: Number(offerData.price),
        isActive: offerData.status === 'Active',
        expiryDate: offerData.deadline,
        description: offerData.description || '',
        category: offerData.category || 'standard',
        details: {
          distillery: offerData.distillery || '',
          caskType: offerData.caskType || '',
          vintage: offerData.vintageYear || '',
          abv: offerData.abv || '',
          volume: offerData.volume || '',
        },
      };

      // Handle file upload if present
      if (offerData.image instanceof File) {
        payload.image = await uploadFile(offerData.image);
      } else {
        payload.image = offerData.image || '';
      }

      // Log payload for debugging
      console.log('Sending payload to POST /api/offers:', JSON.stringify(payload, null, 2));

      const response = await apiClient.post('/offers', payload);

      // Log response for debugging
      console.log('Response from POST /api/offers:', response.data);

      await fetchOffers(); // Refresh the offers list
    } catch (err) {
      // Log detailed error for debugging
      console.error('Error in addOffer:', {
        message: err.response?.data?.message || err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(err.response?.data?.message || err.message || 'Failed to add offer');
      throw err; // Re-throw to handle in the component
    } finally {
      setLoading(false);
    }
  };

  // Update an existing offer
  const updateOffer = async (id, offerData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      const requiredFields = ['offerName', 'type', 'price', 'Deadline', 'status'];
      const missingFields = requiredFields.filter((field) => !offerData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Prepare payload
      const payload = {
        title: offerData.offerName,
        type: offerData.type,
        priceNumeric: Number(offerData.price),
        isActive: offerData.status === 'Active',
        expiryDate: offerData.Deadline,
        description: offerData.description || '',
        category: offerData.category || 'standard',
        details: {
          distillery: offerData.details?.distillery || '',
          caskType: offerData.details?.caskType || '',
          vintage: offerData.details?.vintage || '',
          abv: offerData.details?.abv || '',
          volume: offerData.details?.volume || '',
        },
      };

      // Handle file upload if present
      if (offerData.image instanceof File) {
        payload.image = await uploadFile(offerData.image);
      } else {
        payload.image = offerData.image || '';
      }

      await apiClient.put(`/offers/${id}`, payload);
      await fetchOffers(); // Refresh the offers list
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update offer');
      throw err; // Re-throw to handle in the component
    } finally {
      setLoading(false);
    }
  };

  // Delete an offer
  const deleteOffer = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.delete(`/offers/${id}`);
      await fetchOffers(); // Refresh the offers list
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete offer');
      throw err; // Re-throw to handle in the component
    } finally {
      setLoading(false);
    }
  };

  // Update query parameters
  const updatePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const updateLimit = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  };

  const updateSearch = (newSearch) => {
    setSearchInput(newSearch);
    setPage(1); // Reset to first page when search changes
  };

  const updateType = (newType) => {
    setType(newType);
    setPage(1); // Reset to first page when type changes
  };

  const updateMinPrice = (newMinPrice) => {
    setMinPrice(Number(newMinPrice) || 0);
    setPage(1); // Reset to first page when minPrice changes
  };

  const updateMaxPrice = (newMaxPrice) => {
    setMaxPrice(Number(newMaxPrice) || Infinity);
    setPage(1); // Reset to first page when maxPrice changes
  };

  // Initial fetch
  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return {
    offers,
    loading,
    error,
    page,
    limit,
    search: searchInput,
    type,
    minPrice,
    maxPrice,
    totalPages,
    totalOffers,
    addOffer,
    updateOffer,
    deleteOffer,
    updatePage,
    updateLimit,
    updateSearch,
    updateType,
    updateMinPrice,
    updateMaxPrice,
    refetch: fetchOffers,
  };
};

export default useUserOffer;