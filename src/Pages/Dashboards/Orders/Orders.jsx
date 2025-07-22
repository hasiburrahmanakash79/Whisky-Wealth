import {Search } from "lucide-react";
import { useState } from "react";
import CommonModal from "../../../components/Common/CommonModal";
import { RiDeleteBin5Line, RiEditBoxLine } from "react-icons/ri";

const Orders = () => {
  const offers = [
    {
      id: 1,
      offerName: "Rare Macallan 30yr",
      type: "Experience",
      price: 10.0,
      status: "Active",
      Deadline: "2025-08-01",
    },
    {
      id: 2,
      offerName: "Glenfiddich VIP Tour",
      type: "Tour",
      price: 15.5,
      status: "Pending",
      Deadline: "2025-07-30",
    },
    {
      id: 3,
      offerName: "Whisky & Jazz Night",
      type: "Event",
      price: 12.99,
      status: "Active",
      Deadline: "2025-08-10",
    },
    {
      id: 4,
      offerName: "Highland Cask Tasting",
      type: "Tasting",
      price: 18.75,
      status: "Active",
      Deadline: "2025-09-01",
    },
    {
      id: 5,
      offerName: "Barrel Ownership Program",
      type: "Ownership",
      price: 1000.0,
      status: "Pending",
      Deadline: "2025-08-15",
    },
    {
      id: 6,
      offerName: "Limited Edition Glenlivet",
      type: "Bottle",
      price: 299.99,
      status: "Active",
      Deadline: "2025-07-25",
    },
    {
      id: 7,
      offerName: "Distillery Dinner Pairing",
      type: "Experience",
      price: 85.0,
      status: "Active",
      Deadline: "2025-08-05",
    },
    {
      id: 8,
      offerName: "Islay Adventure Tour",
      type: "Tour",
      price: 230.0,
      status: "Pending",
      Deadline: "2025-09-12",
    },
    {
      id: 9,
      offerName: "Exclusive Speyside Night",
      type: "Event",
      price: 60.0,
      status: "Active",
      Deadline: "2025-07-28",
    },
    {
      id: 10,
      offerName: "Cask Investment Deal",
      type: "Investment",
      price: 5000.0,
      status: "Active",
      Deadline: "2025-10-01",
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
    <div>
      <div className="flex items-center gap-3">
        <div className="p-6 rounded-lg shadow-sm bg-[#ECF1EA] border border-[#DBDADA] w-full">
          <div className="text-center">
            <p className="text-sm font-medium opacity-80">Total Orders</p>
            <p className="text-3xl font-bold mt-1 text-[#909451]">123</p>
          </div>
        </div>
        <div className="p-6 rounded-lg shadow-sm bg-[#E1F6EB] border border-[#DBDADA] w-full">
          <div className="text-center">
            <p className="text-sm font-medium opacity-80">Pending Orders</p>
            <p className="text-3xl font-bold mt-1 text-[#22C55E]">12</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-8 mb-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search offer"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none w-full"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </span>
        </div>
      </div>
      <div>
        <div className="overflow-x-auto border border-gray-200 rounded-xl p-5">
          <h2 className="text-2xl font-semibold mb-5">Order List</h2>
          <table className="min-w-full rounded-xl text-center overflow-hidden">
            <thead>
              <tr className="text-sm  bg-[#B8860B] text-white">
                <th className="p-4 text-left">User Name</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Budget</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-center">
              {offers?.map((user, idx) => (
                <tr key={idx} className="border-t border-gray-200">
                  <td className="py-4 px-4 text-left">{user?.type}</td>
                  <td className="py-3 px-4 ">
                    {user?.offerName || "N/A"}
                  </td>
                  <td className="py-3 px-4">${user?.price || "N/A"}</td>
                  <td className={`py-3 px-4 `}>
                    <p
                      className={`p-2 rounded-full text-white ${
                        user.status === "Active"
                          ? "bg-green-500 "
                          : "bg-red-500"
                      }`}
                    >
                      {user?.status}
                    </p>
                  </td>
                  <td className="py-3 px-4 flex items-center justify-center gap-5 text-xl">
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
            title={`Edit order - ${selectedToken?.offerName}`}
          >
            {selectedToken && (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Order ID:</span>
                  <span>{selectedToken.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Product Name:</span>
                  <span>{selectedToken.offerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">User Name:</span>
                  <span>{selectedToken.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Budget:</span>
                  <span>${selectedToken.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Deadline:</span>
                  <span>{selectedToken.Deadline}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold">Status:</span>
                  <select
                    className="border border-gray-200 rounded-md px-4 py-2 w-[150px]"
                    value={selectedToken.status}
                    onChange={(e) =>
                      setSelectedToken({
                        ...selectedToken,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancel">Cancel</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-6">
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
                  <button
                    onClick={confirmDelete}
                    className="px-6 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#a0730b] w-full"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </CommonModal>
        </div>
      </div>
    </div>
  );
};

export default Orders;
