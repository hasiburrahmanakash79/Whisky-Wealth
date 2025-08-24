import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import CommonModal from "../../../components/Common/CommonModal";
import { RiEditBoxLine } from "react-icons/ri";
import useReferrals from "../../../hook/useReferrals";
import Pagination from "../../../Layouts/Pagination";
import Loader from "../../../components/Common/Loader";

const Referrals = () => {
  const {
    referrals,
    loading,
    error,
    stats,
    page,
    totalPages,
    status,
    search,
    updateStatus,
    updateSearch,
    updatePage,
    updateReferralStatus,
  } = useReferrals();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [localSearch, setLocalSearch] = useState(search);

  const handleEdit = (referral) => {
    setSelectedReferral(referral);
    setIsEditModalOpen(true);
  };

  const handleUpdateReferral = async () => {
    if (selectedReferral) {
      try {
        await updateReferralStatus(
          selectedReferral.id,
          selectedReferral.status
        );
        toast.success("Referral updated successfully!");
        setIsEditModalOpen(false);
        setSelectedReferral(null);
      } catch (err) {
        toast.error(err.message || "Failed to update referral");
      }
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      updateSearch(localSearch);
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [localSearch, updateSearch]);

  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-5 p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-6 rounded-lg shadow-sm bg-[#ECF1EA] border border-[#DBDADA] w-full">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Referrals</p>
            <p className="text-3xl font-bold mt-1 text-[#909451]">
              {stats?.overall.totalReferrals || 0}
            </p>
          </div>
        </div>
        <div className="p-6 rounded-lg shadow-sm bg-[#E1F6EB] border border-[#DBDADA] w-full">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">
              Completed Referrals
            </p>
            <p className="text-3xl font-bold mt-1 text-[#22C55E]">
              {stats?.overall.completedReferrals || 0}
            </p>
          </div>
        </div>
        <div className="p-6 rounded-lg shadow-sm bg-[#F1EBE8] border border-[#DBDADA] w-full">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">
              Pending Referrals
            </p>
            <p className="text-3xl font-bold mt-1 text-[#C35E40]">
              {stats?.overall.pendingReferrals || 0}
            </p>
          </div>
        </div>
        <div className="p-6 rounded-lg shadow-sm bg-[#ECF1EA] border border-[#DBDADA] w-full">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">
              Total Rewards ($)
            </p>
            <p className="text-3xl font-bold mt-1 text-[#909451]">
              {stats?.overall.totalRewards || 0}
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="overflow-x-auto border shadow-lg border-[#DBDADA] rounded-xl p-5 bg-white">
          <div className="flex justify-between mb-5">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Referrals List
            </h2>
            <div className="flex gap-4">
              <select
                className="border border-[#B0B0B0] rounded-md px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-[#B8860B]"
                value={status}
                onChange={(e) => updateStatus(e.target.value)}>
                <option value="">All</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
              <div className="relative">
                <input
                  className="border border-[#B0B0B0] rounded-md px-4 py-2 pl-10 text-sm sm:text-base focus:ring-2 focus:ring-[#B8860B]"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search referrals"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="w-5 h-5" />
                </span>
              </div>
            </div>
          </div>
          <table className="min-w-full rounded-xl text-center">
            <thead>
              <tr className="text-sm bg-[#B8860B] text-white">
                <th className="p-4 text-left">Referrer</th>
                <th className="p-4">Referrals</th>
                <th className="p-4">Code</th>
                <th className="p-4">Status</th>
                <th className="p-4">Completed Date</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6">
                    <Loader text="Loading Referrals ..." />
                  </td>
                </tr>
              ) : referrals.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-600">
                    No referrals found.
                  </td>
                </tr>
              ) : (
                referrals.map((referral) => (
                  <tr key={referral.id} className="border-t border-[#DBDADA]">
                    <td className="py-3 px-4 text-left">
                      {referral.referrerName}
                    </td>
                    <td className="py-3 px-4">{referral.refereeName}</td>
                    <td className="py-3 px-4">{referral.referralCode}</td>
                    <td className="py-3 px-4">
                      <p
                        className={`inline-block px-3 py-1 rounded-full text-white text-xs sm:text-sm ${
                          referral.status === "completed"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}>
                        {referral.status}
                      </p>
                    </td>
                    <td className="py-3 px-4">{referral.completedDate}</td>
                    <td className="py-3 px-4 flex items-center justify-center gap-3 sm:gap-5 text-lg">
                      <button
                        onClick={() => handleEdit(referral)}
                        disabled={loading}>
                        <RiEditBoxLine className="cursor-pointer text-[#B8860B] hover:text-[#A67C00]" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={updatePage}
          loading={loading}
          data={referrals}
          totalItems={stats?.overall.totalReferrals || 0}
          itemLabel="referrals"
          showItemCount={true}
          showRefresh={false}
        />
      </div>

      <CommonModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedReferral(null);
        }}
        title={`Edit Referral - ${
          selectedReferral?.referrerName || "Referral"
        }`}>
        {selectedReferral && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm sm:text-base">
              <span className="font-semibold">Referral ID:</span>
              <span>{selectedReferral.id}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="font-semibold">Referrer:</span>
              <span>{selectedReferral.referrerName}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="font-semibold">Referee:</span>
              <span>
                {selectedReferral.refereeName} ({selectedReferral.refereeEmail})
              </span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="font-semibold">Reward:</span>
              <span>
                ${selectedReferral.rewardAmount} {selectedReferral.currency}
              </span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="font-semibold">Completed Date:</span>
              <span>{selectedReferral.completedDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm sm:text-base">
                Status:
              </span>
              <select
                className="border border-[#B0B0B0] rounded-md px-4 py-2 w-[150px] text-sm sm:text-base focus:ring-2 focus:ring-[#B8860B]"
                value={selectedReferral.status}
                onChange={(e) =>
                  setSelectedReferral({
                    ...selectedReferral,
                    status: e.target.value,
                  })
                }>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="flex items-center gap-4 pt-6">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedReferral(null);
                }}
                className="px-6 py-2 border border-[#B8860B] rounded-md hover:bg-gray-100 w-full text-sm sm:text-base"
                disabled={loading}>
                Cancel
              </button>
              <button
                onClick={handleUpdateReferral}
                className="px-6 py-2 bg-[#B8860B] text-white rounded-md hover:bg-[#A67C00] w-full text-sm sm:text-base disabled:bg-gray-300"
                disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </CommonModal>
    </div>
  );
};

export default Referrals;
