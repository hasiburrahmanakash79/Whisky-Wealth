import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import apiClient from "../lib/api-client";
import toast from "react-hot-toast";

const useUserOffer = (
  initialPage = 1,
  initialLimit = 20,
  initialSearch = "",
  initialType = "All",
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

  // Map API response to frontend format based on offer type
  const mapOfferData = (offer) => {
    const baseOffer = {
      id: offer.id,
      offerName: offer.title || "N/A",
      type: offer.type || "N/A",
      price: offer.priceNumeric ? offer.priceNumeric.toString() : "0",
      status: offer.isActive ? "Active" : "Inactive",
      Deadline: offer.expiryDate ? offer.expiryDate.split("T")[0] : "N/A",
      description: offer.description || "",
      image: offer.image || "",
      images: offer.images || [],
      category: offer.category || "standard",
      daysLeft: offer.daysLeft || 0,
      originalPrice: offer.originalPrice || 0,
      location: offer.location || "",
    };

    // Dynamically build details based on offer type
    let details = {};
    if (offer.type === "cask") {
      details = {
        distillery: offer.details?.distillery || "",
        caskType: offer.details?.caskType || "",
        vintage: offer.details?.vintage || "",
        abv: offer.details?.abv || "",
        volume: offer.details?.volume || "",
      };
    } else if (offer.type === "bottle") {
      details = {
        distillery: offer.details?.distillery || "",
        packaging: offer.details?.packaging || "",
        quantity: offer.details?.quantity || "",
        volume: offer.details?.volume || "",
        certificate: offer.details?.certificate || "",
      };
    } else if (offer.type === "experience") {
      details = {
        packaging: offer.details?.packaging || "",
        duration: offer.details?.duration || "",
        testing: offer.details?.testing || "",
        participants: offer.details?.participants || "",
        includes: offer.details?.includes || "",
      };
    } else {
      // Default case for unknown types
      details = offer.details || {};
    }

    return {
      ...baseOffer,
      details,
    };
  };

  // Fetch offers from API
  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/offers", {
        params: {
          page,
          limit,
          search: debouncedSearch,
          type,
        },
      });
      const mappedOffers = response.data.data.offers.map(mapOfferData);
      setOffers(mappedOffers);
      setTotalPages(response.data.data.pagination.pages || 1);
      setTotalOffers(response.data.data.pagination.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch offers");
      setOffers([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, type]);

  // Add a new offer
  const addOffer = async (offerData) => {
    try {
      setLoading(true);
      setError(null);

      // Build details object based on offer type
      let details = {};
      if (offerData.type === "cask") {
        details = {
          distillery: offerData.distillery || "",
          caskType: offerData.caskType || "",
          vintage: offerData.vintageYear || "",
          abv: offerData.abv || "",
          volume: offerData.volume || "",
        };
      } else if (offerData.type === "bottle") {
        details = {
          distillery: offerData.distillery || "",
          packaging: offerData.packaging || "",
          quantity: offerData.quantity || "",
          volume: offerData.volume || "",
          certificate: offerData.certificate || "",
        };
      } else if (offerData.type === "experience") {
        details = {
          packaging: offerData.packaging || "",
          duration: offerData.duration || "",
          testing: offerData.testing || "",
          participants: offerData.participants || "",
          includes: offerData.includes || "",
        };
      }

      // Create FormData object
      const formData = new FormData();

      // Add basic fields
      formData.append("title", offerData.offerName);
      formData.append("type", offerData.type);
      formData.append("priceNumeric", Number(offerData.price));
      formData.append("expiryDate", offerData.deadline);
      formData.append("description", offerData.description || "");
      formData.append("currentPrice", offerData.price || 0);
      formData.append("originalPrice", offerData.purchaseValue || 0);
      formData.append("isFeatured", true);
      formData.append("location", offerData.storageLocation || "");

      // Add details as JSON string
      formData.append("details", JSON.stringify(details));

      // Add image file if present
      if (offerData.image && offerData.image instanceof File) {
        formData.append("offerImage", offerData.image);
      }

      if (offerData.images && offerData.images.length > 0) {
        offerData.images.forEach((file) => {
          formData.append("offerImages", file); // Append each image file
        });
      }

      // Log FormData contents for debugging
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, `File: ${value.name} (${value.size} bytes)`);
        } else {
          console.log(key, value);
        }
      }

      const response = await apiClient.post("/offers", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast("Offer added successfully");

      console.log("Response from POST /api/offers:", response.data);

      window.location.reload();
    } catch (err) {
      console.error("Error in addOffer:", {
        message: err.response?.data?.message || err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(
        err.response?.data?.message || err.message || "Failed to add offer"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing offer
  const updateOffer = async (id, offerData) => {
    try {
      setLoading(true);
      setError(null);

      // Build details object based on offer type
      let details = {};
      if (offerData.type === "cask") {
        details = {
          distillery: offerData.distillery || "",
          caskType: offerData.caskType || "",
          vintage: offerData.vintageYear || "",
          abv: offerData.abv || "",
          volume: offerData.volume || "",
        };
      } else if (offerData.type === "bottle") {
        details = {
          distillery: offerData.distillery || "",
          packaging: offerData.packaging || "",
          quantity: offerData.quantity || "",
          volume: offerData.volume || "",
          certificate: offerData.certificate || "",
        };
      } else if (offerData.type === "experience") {
        details = {
          packaging: offerData.packaging || "",
          duration: offerData.duration || "",
          testing: offerData.testing || "",
          participants: offerData.participants || "",
          includes: offerData.includes || "",
        };
      }

      // Create FormData object
      const formData = new FormData();

      // Add basic fields
      formData.append("title", offerData.offerName || offerData.title);
      formData.append("type", offerData.type);
      formData.append(
        "priceNumeric",
        Number(offerData.price) || Number(offerData.currentValue)
      );
      formData.append("expiryDate", offerData.deadline || offerData.Deadline);
      formData.append("description", offerData.description || "");
      formData.append(
        "currentPrice",
        offerData.price || offerData.currentValue || 0
      );
      formData.append(
        "originalPrice",
        offerData.purchaseValue || offerData.originalPrice || 0
      );
      formData.append(
        "isActive",
        offerData.status === "Active" || offerData.status === "active"
      );
      formData.append("location", offerData.storageLocation || "");

      // Add details as JSON string
      formData.append("details", JSON.stringify(details));

      // Add image file if present
      if (offerData.image && offerData.image instanceof File) {
        formData.append("offerImage", offerData.image);
      } else if (offerData.image) {
        formData.append("offerImage", offerData.image); // Keep existing image URL if no new file
      }

      if (offerData.images && offerData.images.length > 0) {
        offerData.images.forEach((file) => {
          formData.append("offerImages", file); // Append each image file
        });
      }

      // Log FormData contents for debugging
      console.log("FormData contents for update:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, `File: ${value.name} (${value.size} bytes)`);
        } else {
          console.log(key, value);
        }
      }

      const response = await apiClient.put(`/offers/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast("Offer updated successfully");

      console.log("Response from PUT /api/offers:", response.data);

      window.location.reload();
    } catch (err) {
      console.error("Error in updateOffer:", {
        message: err.response?.data?.message || err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(
        err.response?.data?.message || err.message || "Failed to update offer"
      );
      throw err;
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
      window.location.reload();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to delete offer"
      );
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
