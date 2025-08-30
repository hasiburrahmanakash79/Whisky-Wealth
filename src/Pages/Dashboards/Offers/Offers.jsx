/* eslint-disable no-unused-vars */
"use client";

import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { RiDeleteBin5Line, RiEditBoxLine } from "react-icons/ri";
import CommonModal from "../../../components/Common/CommonModal";
import useUserOffer from "../../../hook/userUserOffer";
import AddOfer from "./AddOffer";
import Pagination from "../../../Layouts/Pagination";
import Loader from "../../../components/Common/Loader";
import UpdateOffer from "./UpdateOffer";

const Offers = () => {
  const {
    offers,
    loading,
    error,
    page,
    search,
    type,
    totalPages,
    totalOffers,
    updateOffer,
    deleteOffer,
    updatePage,
    updateSearch,
    updateType,

    refetch,
  } = useUserOffer(1, 10, "", "");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [tokenToDelete, setTokenToDelete] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const handleSearchChange = (e) => {
    updateSearch(e.target.value);
  };

  const handleTypeChange = (e) => {
    updateType(e.target.value);
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
            {/* <div className="bg-[#B8860B]/10 p-4 rounded-full">
              <Gift className="w-8 h-8 text-[#B8860B]" />
            </div> */}
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
            {/* <div className="bg-green-100 p-4 rounded-full">
              <ChartSpline className="w-8 h-8 text-green-600" />
            </div> */}
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
              className="border border-gray-200 rounded-md px-4 py-2">
              <option value="">All</option>
              <option value="cask">Cask</option>
              <option value="bottle">Bottle</option>
              <option value="experience">Experience</option>
            </select>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-[#B8860B] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#a0730b] hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
              <Plus className="w-5 h-5" />
              Add Offer
            </button>
          </div>
        </div>
      </div>

      {/* Error and Loading States */}

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
              {loading ? (
                <tr>
                  <td colSpan="6">
                    <Loader text="Loading offers..." />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : offers?.length > 0 ? (
                offers.map((offer, idx) => (
                  <tr
                    key={offer.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}>
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
                        }`}>
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
                          title="Edit offer">
                          <RiEditBoxLine className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(offer)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete offer">
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
                    className="px-6 py-4 text-center text-gray-600">
                    No offers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={updatePage}
        loading={loading}
        error={error}
        data={offers}
        totalItems={totalOffers}
        itemLabel="offers"
        onRefresh={refetch}
        showItemCount={true}
        showRefresh={true}
      />
      <UpdateOffer
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selectedToken={selectedToken}
      />

      {/* Delete Offer Modal */}
      <CommonModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTokenToDelete(null);
        }}
        title="Confirm Delete">
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
                className="px-6 py-2 border border-[#B8860B] rounded-lg hover:bg-gray-100 w-full">
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="px-6 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#a0730b] w-full disabled:opacity-50">
                {loading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        )}
      </CommonModal>

      {/* Add Offer Modal */}
      <AddOfer
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
      />
    </div>
  );
};

export default Offers;
