import { useState } from 'react';
import CommonModal from '../../../components/Common/CommonModal';
import { RiEditBoxLine } from 'react-icons/ri';
import useReferrals from '../../../hook/useReferrals';

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

  console.log(referrals);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);

  const handleEdit = (referral) => {
    setSelectedReferral(referral);
    setIsEditModalOpen(true);
  };

  const handleUpdateReferral = async () => {
    if (selectedReferral) {
      await updateReferralStatus(selectedReferral.id, selectedReferral.status);
      setIsEditModalOpen(false);
      setSelectedReferral(null);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-3">
        <div className="p-6 rounded-lg shadow-sm bg-[#ECF1EA] border border-[#DBDADA] w-full">
          <div className="text-center">
            <p className="text-sm font-medium opacity-80">Total Referrals</p>
            <p className="text-3xl font-bold mt-1 text-[#909451]">
              {stats?.overall.totalReferrals || 0}
            </p>
          </div>
        </div>
        <div className="p-6 rounded-lg shadow-sm bg-[#E1F6EB] border border-[#DBDADA] w-full">
          <div className="text-center">
            <p className="text-sm font-medium opacity-80">Completed Referrals</p>
            <p className="text-3xl font-bold mt-1 text-[#22C55E]">
              {stats?.overall.completedReferrals || 0}
            </p>
          </div>
        </div>
        <div className="p-6 rounded-lg shadow-sm bg-[#F1EBE8] border border-[#DBDADA] w-full">
          <div className="text-center">
            <p className="text-sm font-medium opacity-80">Pending Referrals</p>
            <p className="text-3xl font-bold mt-1 text-[#C35E40]">
              {stats?.overall.pendingReferrals || 0}
            </p>
          </div>
        </div>
        <div className="p-6 rounded-lg shadow-sm bg-[#ECF1EA] border border-[#DBDADA] w-full">
          <div className="text-center">
            <p className="text-sm font-medium opacity-80">Total Rewards ($)</p>
            <p className="text-3xl font-bold mt-1 text-[#909451]">
              {stats?.overall.totalRewards || 0}
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="overflow-x-auto border border-gray-200 rounded-xl p-5">
          <div className="flex justify-between mb-5">
            <h2 className="text-2xl font-semibold">Referrals List</h2>
            <div className="flex gap-4">
              <select
                className="border border-gray-200 rounded-md px-4 py-2"
                value={status}
                onChange={(e) => updateStatus(e.target.value)}
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="">All</option>
              </select>
              <input
                className="border border-gray-200 rounded-md px-4 py-2"
                value={search}
                onChange={(e) => updateSearch(e.target.value)}
                placeholder="Search referrals"
              />
            </div>
          </div>
          <table className="min-w-full rounded-xl text-center overflow-hidden">
            <thead>
              <tr className="text-sm bg-[#B8860B] text-white">
                <th className="p-4 text-left">Referrer</th>
                <th className="p-4">Referee</th>
                <th className="p-4">Reward ($)</th>
                <th className="p-4">Status</th>
                <th className="p-4">Completed Date</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-center">
              {referrals?.map((referral, idx) => (
                <tr key={idx} className="border-t border-gray-200">
                  <td className="py-3 px-4 text-left">
                    {referral?.referrerName || 'N/A'}
                  </td>
                  <td className="py-4 px-4">
                    {referral?.refereeName} ({referral?.refereeEmail})
                  </td>
                  <td className="py-3 px-4">
                    ${referral?.rewardAmount} {referral?.currency}
                  </td>
                  <td className="py-3 px-4">
                    <p
                      className={`p-2 rounded-full text-white ${
                        referral.status === 'completed'
                          ? 'bg-green-500'
                          : 'bg-slate-500'
                      }`}
                    >
                      {referral?.status}
                    </p>
                  </td>
                  <td className="py-3 px-4">{referral?.completedDate}</td>
                  <td className="py-3 px-4 flex items-center justify-center gap-5 text-xl">
                    <button onClick={() => handleEdit(referral)}>
                      <RiEditBoxLine className="cursor-pointer" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => updatePage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-[#B8860B] text-white rounded-lg disabled:bg-gray-300"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => updatePage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-[#B8860B] text-white rounded-lg disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <CommonModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedReferral(null);
        }}
        title={`Edit Referral - ${selectedReferral?.referrerName}`}
      >
        {selectedReferral && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-semibold">Referral ID:</span>
              <span>{selectedReferral.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Referrer:</span>
              <span>{selectedReferral.referrerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Referee:</span>
              <span>{selectedReferral.refereeName} ({selectedReferral.refereeEmail})</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Reward:</span>
              <span>${selectedReferral.rewardAmount} {selectedReferral.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Completed Date:</span>
              <span>{selectedReferral.completedDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Status:</span>
              <select
                className="border border-gray-200 rounded-md px-4 py-2 w-[150px]"
                value={selectedReferral.status}
                onChange={(e) =>
                  setSelectedReferral({
                    ...selectedReferral,
                    status: e.target.value,
                  })
                }
              >
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
                className="px-6 py-2 border border-[#B8860B] rounded-lg hover:bg-gray-100 w-full"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateReferral}
                className="px-6 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#a0730b] w-full"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </CommonModal>
    </div>
  );
};

export default Referrals;