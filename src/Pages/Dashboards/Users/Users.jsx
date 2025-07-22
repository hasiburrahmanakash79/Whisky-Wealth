import { useState } from "react";
import { RiDeleteBin5Line, RiEditBoxLine } from "react-icons/ri";
import CommonModal from "../../../components/Common/CommonModal";

const Users = () => {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      casks: "10",
      status: "Active",
      role: "User",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane@example.com",
      casks: "21",
      status: "Active",
      role: "Admin",
    },
    {
      id: 3,
      name: "Bob Smith",
      email: "bob@example.com",
      casks: "32",
      status: "Inactive",
      role: "User",
    },
    {
      id: 4,
      name: "Alice Johnson",
      email: "alice@example.com",
      casks: "43",
      status: "Active",
      role: "User",
    },
    {
      id: 5,
      name: "Mike Brown",
      email: "mike@example.com",
      casks: "54",
      status: "Inactive",
      role: "Moderator",
    },
    {
      id: 6,
      name: "Emily Davis",
      email: "emily@example.com",
      casks: "65",
      status: "Active",
      role: "User",
    },
    {
      id: 7,
      name: "David Lee",
      email: "david@example.com",
      casks: "76",
      status: "Active",
      role: "User",
    },
  ];

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tokenToDelete, setTokenToDelete] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);

  const handleEdit = (token) => {
    setSelectedToken(token);
    setIsEditModalOpen(true);
  };

  const handleUpdateToken = () => {
    console.log("Updated token:", selectedToken);
    setIsEditModalOpen(false);
    setSelectedToken(null);
    // TODO: Update the token in your list or via API
  };

  const handleDeleteClick = (token) => {
    setTokenToDelete(token);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    console.log("Deleted user:", tokenToDelete);
    // TODO: Remove token from list or trigger API call here
    setIsDeleteModalOpen(false);
    setTokenToDelete(null);
  };

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-xl p-5">
      <h2 className="text-2xl font-semibold mb-5">Users</h2>
      <table className="min-w-full rounded-xl text-center overflow-hidden">
        <thead>
          <tr className="text-sm  bg-[#B8860B] text-white">
            <th className="p-4 text-left">User Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Casks</th>
            <th className="p-4">Status</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-center">
          {users?.map((user, idx) => (
            <tr key={idx} className="border-t border-gray-200">
              <td className="py-3 px-4 text-left">{user?.name || "N/A"}</td>
              <td className="py-4 px-4">{user?.email}</td>
              <td className="py-3 px-4">{user?.casks || "N/A"}</td>
              <td className={`py-3 px-4 `}>
                <p
                  className={`p-2 rounded-full text-white ${
                    user.status === "Active" ? "bg-green-500 " : "bg-slate-500"
                  }`}
                >
                  {user?.status}
                </p>
              </td>
              <td className="py-6 px-4 flex items-center justify-center  gap-5 text-xl">
                <button onClick={() => handleEdit(user)}>
                  <RiEditBoxLine className="cursor-pointer" />
                </button>
                <button onClick={() => handleDeleteClick(user)}>
                  <RiDeleteBin5Line className="text-red-500 hover:text-red-700 transition cursor-pointer" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CommonModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedToken(null);
        }}
        title={`Edit User - ${selectedToken?.name}`}
      >
        {selectedToken && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-semibold">Ticket ID:</span>
              <span>{selectedToken.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Name:</span>
              <span>{selectedToken.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Email:</span>
              <span>{selectedToken.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Casks:</span>
              <span>{selectedToken.casks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Status:</span>
              <select
                className="border border-gray-200 outline-none rounded-md px-4 py-2 w-[150px]"
                value={selectedToken.status}
                onChange={(e) =>
                  setSelectedToken({ ...selectedToken, status: e.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedToken(null);
                }}
                className="px-6 py-2 border border-[#B8860B] rounded-lg hover:bg-gray-100 w-full"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateToken}
                className="px-6 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#a0730b] w-full"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </CommonModal>

      {/* ✅ Delete Confirmation Modal */}
      <CommonModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        {tokenToDelete && (
          <div className="space-y-4 text-center">
            <p className="text-lg">Are you sure you want to delete?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2 border border-[#B8860B] rounded-lg hover:bg-gray-100 w-full"
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-6 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#a0730b] w-full">
                Confirm
              </button>
            </div>
          </div>
        )}
      </CommonModal>
    </div>
  );
};

export default Users;
