import { useState } from "react";
import { RiEditBoxLine } from "react-icons/ri";
import CommonModal from "../../../components/Common/CommonModal";
import useUserData from "../../../hook/useUserData";
import Loader from "../../../components/Common/Loader";
import Pagination from "../../../Layouts/Pagination";
import apiClient from "../../../lib/api-client";

const RewardList = () => {
  const {
    rewardData,
    loading,
    totalUsers,
    page,
    totalPages,
    updatePage,
    refetch,
  } = useUserData();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tokenToDelete, setTokenToDelete] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);

  const handleEdit = (token) => {
    setSelectedToken(token);
    setIsEditModalOpen(true);
  };

  const handleInputChange = (field, value) => {
    setSelectedToken((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateToken = async () => {
    if (!selectedToken) return;

    try {
      const payload = {
        userId: selectedToken.id, // ধরে নিচ্ছি user.id আসছে rewardData থেকে
        points: Number(selectedToken.referralPoints),
        type: "manual_adjustment", // আপনি চাইলে dropdown করতে পারেন
        description: selectedToken.description || "",
        adminNotes: selectedToken.adminNotes || "",
      };

      console.log("Payload Sent:", payload);

      await apiClient.post("/referrals/admin/manual-points", payload);

      alert("Points updated successfully ✅");

      setIsEditModalOpen(false);
      setSelectedToken(null);

      // 🔄 ডাটা রিফ্রেশ করতে
      refetch();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update points ❌");
    }
  };

  const confirmDelete = () => {
    console.log("Deleted user:", tokenToDelete);
    // TODO: Remove token from list or trigger API call here
    setIsDeleteModalOpen(false);
    setTokenToDelete(null);
  };
  console.log("referralPoints", rewardData);
  return (
    <>
      <div className="overflow-x-auto border border-gray-200 rounded-xl p-5 mt-10">
        <h2 className="text-2xl font-semibold mb-5">Reward List</h2>
        <table className="min-w-full rounded-xl text-center overflow-hidden">
          <thead>
            <tr className="text-sm  bg-[#B8860B] text-white">
              <th className="p-4 text-left">User Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Casks</th>
              <th className="p-4">Invest</th>
              <th className="p-4">Point</th>
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
            ) : rewardData.length > 0 ? (
              rewardData?.map((user, idx) => (
                <tr key={idx} className="border-t border-gray-200">
                  <td className="py-3 px-4 text-left">
                    {user?.fullName || "N/A"}
                  </td>
                  <td className="py-4 px-4">{user?.email}</td>
                  <td className="py-3 px-4">{user?.totalReferrals || 0}</td>
                  <td className="py-3 px-4">
                    {user?.totalInvestmentAmount || 0}
                  </td>
                  <td className="py-3 px-4">{user?.referralPoints || 0}</td>

                  <td className="py-3 px-4 flex items-center justify-center gap-5">
                    <button onClick={() => handleEdit(user)}>
                      <RiEditBoxLine className="cursor-pointer w-5 h-5" />
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

        <CommonModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedToken(null);
          }}
          title={`Manual Point Adjustment - ${
            selectedToken?.fullName || "N/A"
          }`}>
          {selectedToken && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center py-3  border-gray-100">
                  <span className="font-semibold text-gray-700">Points : </span>
                  <input
                    type="number"
                    value={selectedToken.referralPoints}
                    onChange={(e) =>
                      handleInputChange("referralPoints", e.target.value)
                    }
                    className=" border border-[#E6E6E6] py-2 rounded-lg px-2"
                  />
                </div>
                <div className="flex justify-between items-center py-3  border-gray-100">
                  <span className="font-semibold text-gray-700">
                    Describtion:
                  </span>
                  <input
                    type="text"
                    value={selectedToken.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className=" border border-[#E6E6E6] py-2 rounded-lg px-2"
                  />
                </div>
                <div className="flex justify-between items-center py-3 border-gray-100">
                  <span className="font-semibold text-gray-700">
                    Admin Notes:
                  </span>
                  <input
                    type="text"
                    value={selectedToken.adminNotes}
                    onChange={(e) =>
                      handleInputChange("adminNotes", e.target.value)
                    }
                    className=" border border-[#E6E6E6] py-2 rounded-lg px-2"
                  />
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

        {/* ✅ Delete Confirmation Modal */}
        <CommonModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Delete">
          {tokenToDelete && (
            <div className="space-y-4 text-center">
              <p className="text-lg">Are you sure you want to delete?</p>
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
        data={rewardData}
        totalItems={totalUsers}
        itemLabel="Reward"
        onRefresh={refetch}
        showItemCount={true}
        showRefresh={true}
      />
    </>
  );
};

export default RewardList;
