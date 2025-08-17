import { BarChartIcon as ChartSpline, Gift, Plus, Search } from "lucide-react";
import { useState } from "react";
import { RiDeleteBin5Line, RiEditBoxLine } from "react-icons/ri";
import CommonModal from "../../../components/Common/CommonModal";
import useUserOffer from "../../../hook/userUserOffer";

const Offers = () => {
  const {
    offers,
    loading,
    error,
    page,
    limit,
    search,
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
    refetch,
  } = useUserOffer(1, 20, "", "cask", 1000, 20000);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [tokenToDelete, setTokenToDelete] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [newOffer, setNewOffer] = useState({});

  const handleSearchChange = (e) => {
    updateSearch(e.target.value);
  };

  const handleTypeChange = (e) => {
    updateType(e.target.value);
  };

  const handleMinPriceChange = (e) => {
    const value = e.target.value ? Number(e.target.value) : 0;
    updateMinPrice(value);
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value ? Number(e.target.value) : Infinity;
    updateMaxPrice(value);
  };

  const handleEdit = (token) => {
    setSelectedToken(token);
    setIsEditModalOpen(true);
  };

  const handleUpdateToken = async () => {
    try {
      await updateOffer(selectedToken.id, selectedToken);
      setIsEditModalOpen(false);
      setSelectedToken(null);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleDeleteClick = (token) => {
    setTokenToDelete(token);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!tokenToDelete) return;
    try {
      await deleteOffer(tokenToDelete.id);
      setIsDeleteModalOpen(false);
      setTokenToDelete(null);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleAddOffer = async () => {
    try {
      await addOffer(newOffer);
      setIsAddModalOpen(false);
      setNewOffer({});
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const isAddFormValid =
    newOffer.offerName &&
    newOffer.type &&
    newOffer.price &&
    newOffer.deadline &&
    newOffer.status;

  const totalOffersCount = totalOffers || 0;
  const activeOffersCount =
    offers?.filter((offer) => offer.status === "Active").length || 0;


    console.log(offers);

  return (
    <div className="min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-300/20 p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Total Offers
              </p>
              <p className="text-4xl font-bold text-[#B8860B]">
                {totalOffersCount}
              </p>
            </div>
            <div className="bg-[#B8860B]/10 p-4 rounded-full">
              <Gift className="w-8 h-8 text-[#B8860B]" />
            </div>
          </div>
        </div>
        <div className="bg-[#B8860B]/5 p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Active Offers
              </p>
              <p className="text-4xl font-bold text-green-600">
                {activeOffersCount}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-full">
              <ChartSpline className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Add Offer Button */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search offers..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-all duration-200"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div className="flex gap-4 flex-wrap">
            <select
              value={type}
              onChange={handleTypeChange}
              className="border border-gray-200 rounded-md px-4 py-2"
            >
              <option value="cask">Cask</option>
              <option value="bottle">Bottle</option>
              <option value="experience">Experience</option>
              <option value="tour">Tour</option>
              <option value="event">Event</option>
              <option value="ownership">Ownership</option>
              <option value="investment">Investment</option>
            </select>
            <input
              type="number"
              value={minPrice}
              onChange={handleMinPriceChange}
              placeholder="Min Price"
              className="border border-gray-200 rounded-md px-4 py-2 w-32"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              placeholder="Max Price"
              className="border border-gray-200 rounded-md px-4 py-2 w-32"
            />
            <select
              value={limit}
              onChange={(e) => updateLimit(Number(e.target.value))}
              className="border border-gray-200 rounded-md px-4 py-2"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-[#B8860B] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#a0730b] hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Add Offer
            </button>
          </div>
        </div>
      </div>

      {/* Error and Loading States */}
      {loading && <div className="text-center py-4">Loading...</div>}
      {error && !isAddModalOpen && (
        <div className="text-center py-4 text-red-500">{error}</div>
      )}

      {/* Offers Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#B8860B] to-[#DAA520] text-white">
                <th className="px-6 py-4 text-left font-semibold">Offers</th>
                <th className="px-6 py-4 text-center font-semibold">Type</th>
                <th className="px-6 py-4 text-center font-semibold">Price</th>
                <th className="px-6 py-4 text-center font-semibold">Status</th>
                <th className="px-6 py-4 text-center font-semibold">
                  Deadline
                </th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && !error && offers?.length > 0 ? (
                offers.map((offer, idx) => (
                  <tr
                    key={offer.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">
                        {offer.offerName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {offer.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-gray-800">
                      ${offer.price}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          offer.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {offer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      {offer.Deadline}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleEdit(offer)}
                          className="p-2 text-gray-600 hover:text-[#B8860B] hover:bg-gray-100 rounded-lg transition-all duration-200"
                          title="Edit offer"
                        >
                          <RiEditBoxLine className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(offer)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete offer"
                        >
                          <RiDeleteBin5Line className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-600"
                  >
                    No offers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && !error && offers?.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div>
            Showing {offers.length} of {totalOffers} offers
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => updatePage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 border border-[#B8860B] rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => updatePage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 border border-[#B8860B] rounded-lg disabled:opacity-50"
            >
              Next
            </button>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#a0730b]"
            >
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Edit Offer Modal */}
      <CommonModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedToken(null)
        }}
        title={`Edit Offer - ${selectedToken?.offerName || "N/A"}`}
      >
        {selectedToken && (
          <div className="overflow-y-auto max-h-[calc(90vh-200px)] space-y-5">
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#a0730b]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Offer ID</span>
                <span className="font-mono text-sm bg-white px-3 py-1 rounded border">{selectedToken.id}</span>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Basic Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Offer Name</label>
                  <input
                    type="text"
                    value={selectedToken.offerName || ""}
                    onChange={(e) =>
                      setSelectedToken({
                        ...selectedToken,
                        offerName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a0730b] focus:border-transparent transition-all"
                    placeholder="Enter offer name"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={selectedToken.type || ""}
                      onChange={(e) => setSelectedToken({ ...selectedToken, type: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a0730b] focus:border-transparent transition-all bg-white"
                    >
                      <option value="cask">Cask</option>
                      <option value="bottle">Bottle</option>
                      <option value="experience">Experience</option>
                      <option value="tour">Tour</option>
                      <option value="event">Event</option>
                      <option value="ownership">Ownership</option>
                      <option value="investment">Investment</option>
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={selectedToken.status || ""}
                      onChange={(e) => setSelectedToken({ ...selectedToken, status: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a0730b] focus:border-transparent transition-all bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                    <input
                      type="number"
                      value={selectedToken.price || ""}
                      onChange={(e) => setSelectedToken({ ...selectedToken, price: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a0730b] focus:border-transparent transition-all"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                    <input
                      type="date"
                      value={selectedToken.Deadline || ""}
                      onChange={(e) =>
                        setSelectedToken({
                          ...selectedToken,
                          Deadline: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a0730b] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={selectedToken.description || ""}
                    onChange={(e) =>
                      setSelectedToken({
                        ...selectedToken,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a0730b] focus:border-transparent transition-all resize-none"
                    placeholder="Enter offer description"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Cask Details</h3>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Distillery</label>
                    <input
                      type="text"
                      value={selectedToken.details?.distillery || ""}
                      onChange={(e) =>
                        setSelectedToken({
                          ...selectedToken,
                          details: {
                            ...selectedToken.details,
                            distillery: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a0730b] focus:border-transparent transition-all"
                      placeholder="Enter distillery name"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cask Type</label>
                    <input
                      type="text"
                      value={selectedToken.details?.caskType || ""}
                      onChange={(e) =>
                        setSelectedToken({
                          ...selectedToken,
                          details: {
                            ...selectedToken.details,
                            caskType: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a0730b] focus:border-transparent transition-all"
                      placeholder="e.g., Sherry Oak, Bourbon"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vintage Year</label>
                    <input
                      type="number"
                      value={selectedToken.details?.vintage || ""}
                      onChange={(e) =>
                        setSelectedToken({
                          ...selectedToken,
                          details: {
                            ...selectedToken.details,
                            vintage: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a0730b] focus:border-transparent transition-all"
                      placeholder="YYYY"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">ABV (%)</label>
                    <input
                      type="text"
                      value={selectedToken.details?.abv || ""}
                      onChange={(e) =>
                        setSelectedToken({
                          ...selectedToken,
                          details: {
                            ...selectedToken.details,
                            abv: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a0730b] focus:border-transparent transition-all"
                      placeholder="e.g., 43.0"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Volume (L)</label>
                    <input
                      type="text"
                      value={selectedToken.details?.volume || ""}
                      onChange={(e) =>
                        setSelectedToken({
                          ...selectedToken,
                          details: {
                            ...selectedToken.details,
                            volume: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a0730b] focus:border-transparent transition-all"
                      placeholder="e.g., 500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsEditModalOpen(false)
                  setSelectedToken(null)
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateToken}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
              >
                {loading && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </CommonModal>

      {/* Delete Offer Modal */}
      <CommonModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTokenToDelete(null);
        }}
        title="Confirm Delete"
      >
        {tokenToDelete && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#B8860B]/5">
              <RiDeleteBin5Line className="h-6 w-6 text-[#B8860B]" />
            </div>
            <p className="text-lg">
              Are you sure you want to delete {tokenToDelete.offerName}?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setTokenToDelete(null);
                }}
                className="px-6 py-2 border border-[#B8860B] rounded-lg hover:bg-gray-100 w-full"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="px-6 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#a0730b] w-full disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        )}
      </CommonModal>

      {/* Add Offer Modal */}
      <CommonModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setNewOffer({});
        }}
        title="Add New Offer"
        className="w-full overflow-hidden"
      >
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-[#B8860B] rounded-full mr-3"></div>
                    Image
                  </h3>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#B8860B] transition-colors">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400 mb-4"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <input
                        type="file"
                        className="hidden"
                        id="image-upload"
                        accept="image/*"
                        onChange={(e) =>
                          setNewOffer({
                            ...newOffer,
                            image: e.target.files?.[0],
                          })
                        }
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="text-sm font-medium text-gray-700">
                          Upload an image
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG up to 10MB
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-[#B8860B] rounded-full mr-3"></div>
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Offer Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Rare Macallan 30yr"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                        value={newOffer.offerName || ""}
                        onChange={(e) =>
                          setNewOffer({
                            ...newOffer,
                            offerName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                        value={newOffer.type || ""}
                        onChange={(e) =>
                          setNewOffer({ ...newOffer, type: e.target.value })
                        }
                      >
                        <option value="" disabled>
                          Select Type
                        </option>
                        <option value="cask">Cask</option>
                        <option value="bottle">Bottle</option>
                        <option value="experience">Experience</option>
                        <option value="tour">Tour</option>
                        <option value="event">Event</option>
                        <option value="ownership">Ownership</option>
                        <option value="investment">Investment</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                        value={newOffer.status || ""}
                        onChange={(e) =>
                          setNewOffer({ ...newOffer, status: e.target.value })
                        }
                      >
                        <option value="" disabled>
                          Select Status
                        </option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        placeholder="Write description here"
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors resize-none"
                        value={newOffer.description || ""}
                        onChange={(e) =>
                          setNewOffer({
                            ...newOffer,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-[#B8860B] rounded-full mr-3"></div>
                    Pricing & Timeline
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          placeholder="1,500"
                          className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                          value={newOffer.price || ""}
                          onChange={(e) =>
                            setNewOffer({ ...newOffer, price: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deadline <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                        value={newOffer.deadline || ""}
                        onChange={(e) =>
                          setNewOffer({ ...newOffer, deadline: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Cask Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-[#B8860B] rounded-full mr-3"></div>
                    Cask Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Distillery
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Macallan"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                        value={newOffer.distillery || ""}
                        onChange={(e) =>
                          setNewOffer({
                            ...newOffer,
                            distillery: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cask Type
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Sherry Hogshead"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                        value={newOffer.caskType || ""}
                        onChange={(e) =>
                          setNewOffer({ ...newOffer, caskType: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vintage Year
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 1990"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                        value={newOffer.vintageYear || ""}
                        onChange={(e) =>
                          setNewOffer({
                            ...newOffer,
                            vintageYear: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ABV (%)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 48.5"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                        value={newOffer.abv || ""}
                        onChange={(e) =>
                          setNewOffer({ ...newOffer, abv: e.target.value })
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Volume (L)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 200"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors"
                        value={newOffer.volume || ""}
                        onChange={(e) =>
                          setNewOffer({ ...newOffer, volume: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-8 mt-8 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewOffer({});
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOffer}
                disabled={loading || !isAddFormValid}
                className="px-8 py-3 bg-[#B8860B] text-white rounded-lg hover:bg-[#a0730b] transition-colors font-medium shadow-sm disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Offer"}
              </button>
            </div>
          </div>
        </div>
      </CommonModal>
    </div>
  );
};

export default Offers;
