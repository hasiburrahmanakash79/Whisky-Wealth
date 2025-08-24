"use client";

import { useState } from "react";
import { RiDeleteBin5Line, RiEditBoxLine, RiSearchLine } from "react-icons/ri";
import useUserData from "../../../hook/useUserData";
import apiClient from "../../../lib/api-client";
import CommonModal from "../../../components/Common/CommonModal";
import Pagination from "../../../Layouts/Pagination";
import RewardList from "../Home/RewardList";
import Loader from "../../../components/Common/Loader";

const Users = () => {
  const {
    users,
    loading,
    error,
    page,
    search,
    totalPages,
    totalUsers,
    updatePage,

    updateSearch,
    refetch,
  } = useUserData(1, 6, "");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tokenToDelete, setTokenToDelete] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);

  const handleSearchChange = (e) => {
    updateSearch(e.target.value);
  };

  const handleEdit = (user) => {
    setSelectedToken(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateToken = async () => {
    if (!selectedToken) return;
    try {
      await apiClient.put(`/users/${selectedToken.id}`, {
        isActive: selectedToken.status === "Active",
      });
      setIsEditModalOpen(false);
      setSelectedToken(null);
      refetch();
    } catch (err) {
      console.error("Failed to update user:", err.message);
    }
  };

  const handleDeleteClick = (user) => {
    setTokenToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!tokenToDelete) return;
    try {
      await apiClient.delete(`/users/${tokenToDelete.id}`);
      setIsDeleteModalOpen(false);
      setTokenToDelete(null);
      refetch();
    } catch (err) {
      console.error("Failed to delete user:", err.message);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Users Management
              </h2>
              <p className="text-gray-600 text-sm">
                Manage and monitor user accounts
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[#B8860B] text-white px-4 py-2 rounded-lg text-sm font-medium">
                Total: {totalUsers || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="px-8 py-6 bg-gray-50 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search users by name or email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B8860B] focus:border-[#B8860B] transition-all duration-200 bg-white shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-8 py-6">
          {/* Loading and Error States */}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <div className="text-red-600 font-semibold mb-2">
                Error Loading Users
              </div>
              <div className="text-red-500 text-sm">{error}</div>
            </div>
          )}

          {/* Users Table */}
          {!error && (
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#B8860B]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      User Name
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">
                      Casks
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <Loader text="Loading users..." />
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                          <div className="text-red-600 font-semibold mb-2">
                            Error Loading Users
                          </div>
                          <div className="text-red-500 text-sm">{error}</div>
                        </div>
                      </td>
                    </tr>
                  ) : users?.length > 0 ? (
                    users.map((user, index) => (
                      <tr
                        key={user.id}
                        className={`hover:bg-gray-50 transition-colors duration-150 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-25"
                        }`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-[#B8860B] flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {(user.name || "U").charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {user.name || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900 font-medium">
                            {user.email || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm font-semibold text-gray-900">
                            {user.casks || "0"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                            {user.status || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 text-gray-600 hover:text-[#B8860B] hover:bg-gray-100 rounded-lg transition-all duration-200"
                              title="Edit user">
                              <RiEditBoxLine className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(user)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Delete user">
                              <RiDeleteBin5Line className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <div className="text-lg font-medium mb-2">
                            No users found
                          </div>
                          <div className="text-sm">
                            Try adjusting your search criteria
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={updatePage}
            loading={loading}
            data={users}
            totalItems={totalUsers}
            itemLabel="users"
            onRefresh={refetch}
            showItemCount={true}
            showRefresh={true}
          />
        </div>

        {/* Edit Modal */}
        <CommonModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedToken(null);
          }}
          title={`Edit User - ${selectedToken?.name || "N/A"}`}>
          {selectedToken && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-semibold text-gray-700">User ID:</span>
                  <span className="text-gray-900 font-medium">
                    {selectedToken.id}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-semibold text-gray-700">Name:</span>
                  <span className="text-gray-900 font-medium">
                    {selectedToken.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-semibold text-gray-700">Email:</span>
                  <span className="text-gray-900 font-medium">
                    {selectedToken.email}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-semibold text-gray-700">Casks:</span>
                  <span className="text-gray-900 font-medium">
                    {selectedToken.casks}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-semibold text-gray-700">Status:</span>
                  <select
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#B8860B] focus:border-[#B8860B] font-medium"
                    value={selectedToken.status}
                    onChange={(e) =>
                      setSelectedToken({
                        ...selectedToken,
                        status: e.target.value,
                      })
                    }>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-6 border-t border-gray-100">
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedToken(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-all duration-200">
                  Cancel
                </button>
                <button
                  onClick={handleUpdateToken}
                  className="flex-1 px-6 py-3 bg-[#B8860B] text-white rounded-lg hover:bg-[#a0730b] font-medium transition-all duration-200">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </CommonModal>

        {/* Delete Confirmation Modal */}
        <CommonModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Delete">
          {tokenToDelete && (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#B8860B]/5">
                <RiDeleteBin5Line className="h-6 w-6 text-[#B8860B]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete User Account
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{tokenToDelete.name}</span>?
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-6 py-2 border border-[#B8860B] rounded-lg hover:bg-gray-100 w-full">
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#a0730b] w-full">
                  Delete User
                </button>
              </div>
            </div>
          )}
        </CommonModal>
      </div>
      <RewardList />
    </>
  );
};

export default Users;
