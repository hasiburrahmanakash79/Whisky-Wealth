import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import apiClient from "../../../lib/api-client";
import toast from "react-hot-toast";
import CommonModal from "../../../components/Common/CommonModal";
import { RiDeleteBin5Line, RiEditBoxLine } from "react-icons/ri";
import Pagination from "../../../Layouts/Pagination";
import Loader from "../../../components/Common/Loader";

const Orders = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tokenToDelete, setTokenToDelete] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPurchases: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 20,
  });

  // Fetch purchases
  const fetchPurchases = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(
        `/purchases?page=${page}&limit=${pagination.limit}`
      );
      const {
        purchases,
        stats,
        pagination: apiPagination,
      } = response.data.data;
      setPurchases(purchases);
      setFilteredPurchases(purchases);
      setStats({
        totalPurchases: stats.overall.totalPurchases,
        deliveredOrders:
          stats.byStatus.find((s) => s._id === "Delivered")?.count || 0,
        pendingOrders:
          stats.byStatus.find((s) => s._id === "Pending")?.count || 0,
      });
      setPagination({
        current: apiPagination.current,
        pages: apiPagination.pages,
        total: apiPagination.total,
        limit: apiPagination.limit,
      });
    } catch (error) {
      console.error(
        "Fetch Purchases Error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Failed to fetch purchases."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases(pagination.current);
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = purchases.filter(
      (purchase) =>
        purchase.user.fullName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        purchase.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPurchases(filtered);
  }, [searchQuery, purchases]);

  const handleEdit = (token) => {
    setSelectedToken(token);
    setIsEditModalOpen(true);
  };

  const handleUpdateToken = async () => {
    if (!selectedToken) return;
    setIsLoading(true);
    const notesString =
      Array.isArray(selectedToken.notes) && selectedToken.notes.length === 0
        ? ""
        : typeof selectedToken.notes === "string"
        ? selectedToken.notes
        : selectedToken.notes.join(", "); // if somehow array of strings
    try {
      await apiClient.put(`/purchases/${selectedToken._id}/status`, {
        status: selectedToken.status,
        notes: notesString || "",
        caskProgress: selectedToken.caskProgress,
        manualPaymentStatus: selectedToken.manualPaymentStatus,
      });

      // Update purchases state
      setPurchases((prev) =>
        prev.map((p) =>
          p._id === selectedToken._id
            ? {
                ...p,
                status: selectedToken.status,
                caskProgress: selectedToken.caskProgress,
                manualPaymentStatus: selectedToken.manualPaymentStatus,
                notes: selectedToken.notes,
              }
            : p
        )
      );

      // Also update filteredPurchases
      setFilteredPurchases((prev) =>
        prev.map((p) =>
          p._id === selectedToken._id
            ? {
                ...p,
                status: selectedToken.status,
                caskProgress: selectedToken.caskProgress,
                manualPaymentStatus: selectedToken.manualPaymentStatus,
                notes: selectedToken.notes,
              }
            : p
        )
      );

      toast.success("Order updated successfully!");
      setIsEditModalOpen(false);
      setSelectedToken(null);
    } catch (error) {
      console.error(
        "Update Purchase Error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to update order.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (token) => {
    setTokenToDelete(token);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!tokenToDelete) return;
    setIsLoading(true);
    try {
      await apiClient.delete(`/purchases/${tokenToDelete._id}`);
      setPurchases((prev) => prev.filter((p) => p._id !== tokenToDelete._id));
      setFilteredPurchases((prev) =>
        prev.filter((p) => p._id !== tokenToDelete._id)
      );
      setStats((prev) => ({
        ...prev,
        totalPurchases: prev.totalPurchases - 1,
        pendingOrders:
          tokenToDelete.status === "Pending"
            ? prev.pendingOrders - 1
            : prev.pendingOrders,
      }));
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
      toast.success("Order deleted successfully!");
      setIsDeleteModalOpen(false);
      setTokenToDelete(null);
    } catch (error) {
      console.error(
        "Delete Purchase Error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to delete order.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= pagination.pages &&
      newPage !== pagination.current
    ) {
      setPagination((prev) => ({ ...prev, current: newPage }));
      fetchPurchases(newPage);
    }
  };

  console.log("selectedToken", selectedToken);
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="p-6 rounded-lg shadow-sm bg-[#F2F5EF] border border-[#DBDADA] w-full sm:w-1/2">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
            <p className="text-3xl font-bold mt-1 text-[#909451]">
              {isLoading ? "Loading..." : stats.totalPurchases}
            </p>
          </div>
        </div>
        <div className="p-6 rounded-lg shadow-sm bg-[#E1F6EB] border border-[#DBDADA] w-full sm:w-1/2">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">
              Total Pending Orders
            </p>
            <p className="text-3xl font-bold mt-1 text-[#22C55E]">
              {isLoading ? "Loading..." : stats.pendingOrders}
            </p>
          </div>
        </div>
        <div className="p-6 rounded-lg shadow-sm bg-[#ECF1EA] border border-[#DBDADA] w-full sm:w-1/2">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">
              Total Delivered Orders
            </p>
            <p className="text-3xl font-bold mt-1 text-[#22C55E]">
              {isLoading ? "Loading..." : stats.deliveredOrders}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8  mb-4">
        <div className="relative flex-1 max-w-md ">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search oder ..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-all duration-200"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="overflow-x-auto border shadow-lg border-[#DBDADA] rounded-xl p-5 bg-white">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-5 text-gray-800">
          Order List
        </h2>

        <>
          <table className="min-w-full rounded-xl text-center">
            <thead>
              <tr className="text-sm bg-[#B8860B] text-white">
                <th className="p-4 text-left">User Name</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Budget</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="5">
                    <Loader text="Loading orders..." />
                  </td>
                </tr>
              ) : filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-600">
                    No purchases found.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((purchase) => (
                  <tr key={purchase._id} className="border-t border-[#DBDADA]">
                    <td className="py-4 px-4 text-left">
                      {purchase.user.fullName}
                    </td>
                    <td className="py-3 px-4">{purchase.title}</td>
                    <td className="py-3 px-4">{purchase.investmentAmount}</td>
                    <td className="py-3 px-4">
                      <p
                        className={`inline-block px-3 py-1 rounded-full text-white text-xs sm:text-sm ${
                          purchase.status === "Active"
                            ? "bg-green-500"
                            : purchase.status === "Pending"
                            ? "bg-yellow-500"
                            : purchase.status === "Delivered"
                            ? "bg-blue-500"
                            : "bg-red-500"
                        }`}>
                        {purchase.status}
                      </p>
                    </td>
                    <td className="py-3 px-4 flex items-center justify-center gap-3 sm:gap-5 text-lg">
                      <button
                        onClick={() => handleEdit(purchase)}
                        disabled={isLoading}>
                        <RiEditBoxLine className="cursor-pointer text-[#B8860B] hover:text-[#A67C00]" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(purchase)}
                        disabled={isLoading}>
                        <RiDeleteBin5Line className="text-red-500 hover:text-red-700 cursor-pointer" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      </div>
      <Pagination
        currentPage={pagination.current}
        totalPages={pagination.pages}
        onPageChange={handlePageChange}
        loading={isLoading}
        data={filteredPurchases}
        totalItems={pagination.total}
        itemLabel="orders"
        onRefresh={() => fetchPurchases(pagination.current)}
        showItemCount={true}
        showRefresh={true}
      />
      <CommonModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedToken(null);
        }}
        title={`Edit Order`}>
        {selectedToken && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm sm:text-base">
              <span className="font-semibold">User Name:</span>
              <span>{selectedToken.personalInfo?.fullName}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="font-semibold">Email:</span>
              <span>{selectedToken.personalInfo?.email}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="font-semibold">Prefer Con:</span>
              <span>{selectedToken.personalInfo?.preferredContactMethod}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="font-semibold">Phone Number:</span>
              <span>{selectedToken?.personalInfo?.phoneNumber}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="font-semibold">Product:</span>
              <span>{selectedToken?.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm sm:text-base">
                Progress:
              </span>
              <select
                className="border border-[#B0B0B0] rounded-full px-4 py-2 w-32 outline-none sm:w-40 text-sm sm:text-base focus:ring-2 focus:ring-[#B8860B]"
                value={selectedToken.caskProgress}
                onChange={(e) =>
                  setSelectedToken({
                    ...selectedToken,
                    caskProgress: e.target.value,
                  })
                }>
                <option value="Ready">Ready</option>
                <option value="Maturing">Maturing</option>
              </select>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="font-semibold">First Purchase:</span>
              <span>{selectedToken.isFirstPurchase ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="font-semibold">Budget:</span>
              <span>{selectedToken.investmentAmount}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="font-semibold">Points:</span>
              <span>{selectedToken.referralPointsAmount || 0}</span>
            </div>
            <div className="flex flex-col text-sm sm:text-base">
              <span className="font-semibold mb-1">Notes:</span>
              <textarea
                className="border border-[#B0B0B0] rounded-lg px-4 py-2 w-full min-h-[50px] text-sm sm:text-base focus:ring-2 focus:ring-[#B8860B] outline-none"
                value={
                  Array.isArray(selectedToken.notes) &&
                  selectedToken.notes.length > 0
                    ? selectedToken.notes[selectedToken.notes.length - 1]
                        ?.content || ""
                    : selectedToken.notes || ""
                }
                onChange={(e) =>
                  setSelectedToken({
                    ...selectedToken,
                    notes: e.target.value,
                  })
                }
                placeholder="Enter notes here"
              />
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="font-semibold">Deadline:</span>
              <span>
                {new Date(
                  new Date(selectedToken.submittedDate).getTime() +
                    selectedToken.daysLeft * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm sm:text-base">
                Payment:
              </span>
              <select
                className="border border-[#B0B0B0] rounded-full px-4 py-2 w-32 outline-none sm:w-40 text-sm sm:text-base focus:ring-2 focus:ring-[#B8860B]"
                value={selectedToken.manualPaymentStatus}
                onChange={(e) =>
                  setSelectedToken({
                    ...selectedToken,
                    manualPaymentStatus: e.target.value,
                  })
                }>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
                <option value="Delivered">Delivered</option>
                <option value="due">Due</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm sm:text-base">
                Status:
              </span>
              <select
                className="border border-[#B0B0B0] rounded-full px-4 py-2 w-32 outline-none sm:w-40 text-sm sm:text-base focus:ring-2 focus:ring-[#B8860B]"
                value={selectedToken.status}
                onChange={(e) =>
                  setSelectedToken({
                    ...selectedToken,
                    status: e.target.value,
                  })
                }>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Delivered">Delivered</option>
                <option value="Reject">Reject</option>
              </select>
            </div>
            <div className="flex items-center gap-4 pt-6">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedToken(null);
                }}
                className="px-6 py-2 border border-[#B8860B] rounded-full hover:bg-gray-100 w-full text-sm sm:text-base"
                disabled={isLoading}>
                Cancel
              </button>
              <button
                onClick={handleUpdateToken}
                className="px-6 py-2 bg-[#B8860B] text-white rounded-full hover:bg-[#A67C00] w-full text-sm sm:text-base disabled:bg-[#A67C00]/60"
                disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </CommonModal>

      <CommonModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete">
        {tokenToDelete && (
          <div className="space-y-4 text-center">
            <p className="text-sm sm:text-base">
              Are you sure you want to delete order{" "}
              <strong>{tokenToDelete.title}</strong> for{" "}
              <strong>{tokenToDelete.user.fullName}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2 border border-[#B0B0B0] rounded-full hover:bg-gray-100 w-full text-sm sm:text-base"
                disabled={isLoading}>
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-[#B8860B] text-white rounded-full hover:bg-[#A67C00] w-full text-sm sm:text-base disabled:bg-[#A67C00]/60"
                disabled={isLoading}>
                {isLoading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        )}
      </CommonModal>
    </div>
  );
};

export default Orders;
