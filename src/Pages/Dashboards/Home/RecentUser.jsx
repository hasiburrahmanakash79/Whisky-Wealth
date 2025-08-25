import { useState } from "react";
import { RiDeleteBin5Line, RiEditBoxLine } from "react-icons/ri";
import CommonModal from "../../../components/Common/CommonModal";
import useUserData from "../../../hook/useUserData";
import apiClient from "../../../lib/api-client";
import Pagination from "../../../Layouts/Pagination";
import Loader from "../../../components/Common/Loader";

const RecentUser = () => {
  const {
    users,
    loading,
    error,
    totalUsers,
    page,
    totalPages,
    updatePage,
    refetch,
  } = useUserData(1, 10, ""); // ✅ fetch first 10 users

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      await apiClient.put(`/users/${selectedUser.id}`, {
        isActive: selectedUser.isActive,
      });
      setIsEditModalOpen(false);
      setSelectedUser(null);
      refetch(); // Refetch user list
    } catch (error) {
      console.error("Update failed:", error);
      // Add error handling (e.g., show a message)
    }
  };
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    console.log("Deleted user:", userToDelete);
    // TODO: Call delete API here
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
    refetch();
  };

  if (error) return <p className="text-red-500">{error}</p>;

  console.log("s", selectedUser);

  return (
    <div>
      <div className="overflow-x-auto border border-gray-200 rounded-xl p-5">
        <h2 className="text-2xl font-semibold mb-5">
          Recent Users ({totalUsers})
        </h2>
        <table className="min-w-full rounded-xl text-center overflow-hidden">
          <thead>
            <tr className="text-sm bg-[#B8860B] text-white">
              <th className="p-4 text-left">User Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Casks</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-center">
            {loading ? (
              <tr>
                <td colSpan="6">
                  <Loader text="Loading..." />
                </td>
              </tr>
            ) : users.length > 0 ? (
              users?.map((user) => (
                <tr key={user.id} className="border-t border-gray-200">
                  <td className="py-3 px-4 text-left">{user?.name || "N/A"}</td>
                  <td className="py-4 px-4">{user?.email}</td>
                  <td className="py-3 px-4">{user?.casks || "N/A"}</td>
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
                  <td className="py-3 px-4 flex items-center justify-center gap-5">
                    <button onClick={() => handleEdit(user)}>
                      <RiEditBoxLine className="cursor-pointer w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteClick(user)}>
                      <RiDeleteBin5Line className="text-red-500 hover:text-red-700 transition cursor-pointer  w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-600">
                  No Data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}

        {/* ✅ Edit Modal */}

        <CommonModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          title={`Edit User `}>
          {selectedUser && (
            <div className="space-y-4">
              {/* Name (Read-only Text) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name:
                </label>
                <p className="w-full  rounded-md p-2 mb-4 bg-gray-100">
                  {selectedUser.name || "N/A"}
                </p>
              </div>

              {/* Email (Read-only Text) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <p className="w-full  rounded-md p-2 mb-4 bg-gray-100">
                  {selectedUser.email || "N/A"}
                </p>
              </div>

              {/* Casks (Read-only Text) - Assuming a custom field; adjust if data source changes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Casks:
                </label>
                <p className="w-full  rounded-md p-2 mb-4 bg-gray-100">
                  {selectedUser.casks || "N/A"}
                </p>
              </div>

              {/* Status (Editable Dropdown) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status:
                </label>
                <select
                  className="w-full border border-blue-300 rounded-md p-2 mb-4"
                  value={selectedUser.isActive ? "true" : "false"} // Use isActive boolean
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      isActive: e.target.value === "true", // Update isActive as boolean
                    })
                  }>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 border rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="px-4 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#A67B0B]">
                  Save
                </button>
              </div>
            </div>
          )}
        </CommonModal>
        {/* ✅ Delete Modal */}
        <CommonModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Delete">
          {userToDelete && (
            <div className="space-y-4 text-center">
              <p className="text-lg">
                Are you sure you want to delete {userToDelete.name}?
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="border px-5 py-3 rounded-md">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="btn-primary">
                  Confirm
                </button>
              </div>
            </div>
          )}
        </CommonModal>
      </div>
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
  );
};

export default RecentUser;
