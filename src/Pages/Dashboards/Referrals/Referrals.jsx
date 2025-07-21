import { useState } from "react";
import CommonModal from "../../../components/Common/CommonModal";
import { RiDeleteBin5Line, RiEditBoxLine } from "react-icons/ri";

const Referrals = () => {
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
      status: "Inactive",
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
      status: "Inactive",
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
      status: "Inactive",
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [tokenToDelete, setTokenToDelete] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [newOffer, setNewOffer] = useState({});

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

  const handleAddOffer = () => {
    console.log("New Offer Submitted:", newOffer);
    setIsAddModalOpen(false);
    setNewOffer({});
    // TODO: Push newOffer to your list or call an API
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-3">
        <div className="p-6 rounded-lg shadow-sm bg-[#ECF1EA] border border-[#DBDADA] w-full">
            <div className="text-center">
              <p className="text-sm font-medium opacity-80">Total Offers</p>
              <p className="text-3xl font-bold mt-1 text-[#909451]">123</p>
            </div>
        </div>
        <div className="p-6 rounded-lg shadow-sm bg-[#E1F6EB] border border-[#DBDADA] w-full">
            <div className="text-center">
              <p className="text-sm font-medium opacity-80">Active Offers</p>
              <p className="text-3xl font-bold mt-1 text-[#22C55E]">12</p>
            </div>
        </div>
        <div className="p-6 rounded-lg shadow-sm bg-[#F1EBE8] border border-[#DBDADA] w-full">
            <div className="text-center">
              <p className="text-sm font-medium opacity-80">Active Offers</p>
              <p className="text-3xl font-bold mt-1 text-[#C35E40]">12</p>
            </div>
        </div>
        <div className="p-6 rounded-lg shadow-sm bg-[#ECF1EA] border border-[#DBDADA] w-full">
            <div className="text-center">
              <p className="text-sm font-medium opacity-80">Active Offers</p>
              <p className="text-3xl font-bold mt-1 text-[#909451]">12</p>
            </div>
        </div>
      </div>
      <div>
        <div className="overflow-x-auto border border-gray-200 rounded-xl p-5">
          <h2 className="text-2xl font-semibold mb-5">Referrals List</h2>
          <table className="min-w-full rounded-xl text-center overflow-hidden">
            <thead>
              <tr className="text-sm  bg-[#B8860B] text-white">
                <th className="p-4 text-left">Referrer</th>
                <th className="p-4">Referee</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Deadline</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-center">
              {offers?.map((user, idx) => (
                <tr key={idx} className="border-t border-gray-200">
                  <td className="py-3 px-4 text-left">
                    {user?.offerName || "N/A"}
                  </td>
                  <td className="py-4 px-4">{user?.type}</td>
                  <td className="py-3 px-4">${user?.price || "N/A"}</td>
                  <td className={`py-3 px-4 `}>
                    <p
                      className={`p-2 rounded-full text-white ${
                        user.status === "Active"
                          ? "bg-green-500 "
                          : "bg-slate-500"
                      }`}
                    >
                      {user?.status}
                    </p>
                  </td>
                  <td className="py-3 px-4">{user?.Deadline || "N/A"}</td>
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
            title={`Edit Offer - ${selectedToken?.offerName}`}
          >
            {selectedToken && (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Offer ID:</span>
                  <span>{selectedToken.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Offer Name:</span>
                  <span>{selectedToken.offerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Type:</span>
                  <span>{selectedToken.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Price:</span>
                  <span>${selectedToken.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Deadline:</span>
                  <span>{selectedToken.Deadline}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold">Status:</span>
                  <select
                    className="border rounded-md px-4 py-2 w-[150px]"
                    value={selectedToken.status}
                    onChange={(e) =>
                      setSelectedToken({
                        ...selectedToken,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
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

          <CommonModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setNewOffer({});
            }}
            title="Add Offer"
          >
            <div className="space-y-4 text-sm">
              {/* Type */}
              <div>
                <label className="block mb-1 font-medium">Type</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={newOffer.type || ""}
                  onChange={(e) =>
                    setNewOffer({ ...newOffer, type: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  <option value="Cask">Cask</option>
                  <option value="Tour">Tour</option>
                  <option value="Event">Event</option>
                  <option value="Ownership">Ownership</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>

              {/* Upload Image */}
              <div>
                <label className="block mb-1 font-medium">Upload Image</label>
                <input
                  type="file"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Cask Type */}
              <div>
                <label className="block mb-1 font-medium">Cask Type</label>
                <input
                  type="text"
                  placeholder="Sherry Hogshead"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={newOffer.caskType || ""}
                  onChange={(e) =>
                    setNewOffer({ ...newOffer, caskType: e.target.value })
                  }
                />
              </div>

              {/* Distillery & Description */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Distillery</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={newOffer.distillery || ""}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, distillery: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Description</label>
                  <input
                    type="text"
                    placeholder="Write here"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={newOffer.description || ""}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, description: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Vintage Year, ABV, Volume */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Vintage Year</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={newOffer.vintageYear || ""}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, vintageYear: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">ABV (%)</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={newOffer.abv || ""}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, abv: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Volume (L)</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={newOffer.volume || ""}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, volume: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Storage Location */}
              <div>
                <label className="block mb-1 font-medium">
                  Storage Location
                </label>
                <input
                  type="text"
                  placeholder="Speyside Warehouse A"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={newOffer.storage || ""}
                  onChange={(e) =>
                    setNewOffer({ ...newOffer, storage: e.target.value })
                  }
                />
              </div>

              {/* Valuation */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">
                    Purchase Value ($)
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={newOffer.purchaseValue || ""}
                    onChange={(e) =>
                      setNewOffer({
                        ...newOffer,
                        purchaseValue: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">
                    Current Value ($)
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={newOffer.currentValue || ""}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, currentValue: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="block mb-1 font-medium">Deadline</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={newOffer.deadline || ""}
                  onChange={(e) =>
                    setNewOffer({ ...newOffer, deadline: e.target.value })
                  }
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-4 pt-6">
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setNewOffer({});
                  }}
                  className="px-6 py-2 border border-[#B8860B] rounded-lg hover:bg-gray-100 w-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOffer}
                  className="px-6 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#a0730b] w-full"
                >
                  Save
                </button>
              </div>
            </div>
          </CommonModal>
        </div>
      </div>
    </div>
  );
};

export default Referrals;