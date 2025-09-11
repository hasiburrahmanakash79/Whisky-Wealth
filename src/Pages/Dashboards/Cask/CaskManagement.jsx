import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Loader from "../../../components/Common/Loader";
import toast from "react-hot-toast";
import apiClient from "../../../lib/api-client";
import { RiDeleteBin5Line, RiEditBoxLine } from "react-icons/ri";
import Pagination from "../../../Layouts/Pagination";
import CommonModal from "../../../components/Common/CommonModal";
import useUserData from "../../../hook/useUserData";

const CaskManagement = () => {
  const { users } = useUserData();
  const [casks, setCasks] = useState([]);
  const [filteredCasks, setFilteredCasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [caskToDelete, setCaskToDelete] = useState(null);
  const [selectedCask, setSelectedCask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalCasks: 0,
    readyCasks: 0,
    maturingCasks: 0,
    totalValue: 0,
    avgValue: 0,
    totalGain: 0,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 10,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCask, setNewCask] = useState({
    name: "",
    distillery: "",
    year: "",
    volume: "",
    abv: "",
    location: "",
    estimatedValue: "",
    currentValue: "",
    purchasePrice: "",
    status: "Ready",
    owner: "",
    caskImages: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Update newCask state
      setNewCask({ ...newCask, caskImages: file });
    }
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setNewCask({ ...newCask, caskImages: null });
  };

  const handleAddCask = async () => {
    if (!newCask.owner) {
      toast.error("Please select a user!");
      return;
    }
    setIsLoading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      Object.keys(newCask).forEach((key) => {
        if (newCask[key] !== null && newCask[key] !== "") {
          formData.append(key, newCask[key]);
        }
      });

      const response = await apiClient.post("/casks", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setCasks((prev) => [response.data.data.cask, ...prev]);
      setFilteredCasks((prev) => [response.data.data.cask, ...prev]);
      toast.success("Cask added successfully!");
      setIsAddModalOpen(false);

      // Reset form
      setNewCask({
        name: "",
        distillery: "",
        year: "",
        volume: "",
        abv: "",
        location: "",
        estimatedValue: "",
        purchasePrice: "",
        status: "Ready",
        owner: "",
        currentValue: "200",
        caskImages: null,
      });

      // Clean up image preview
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Add Cask Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to add cask.");
    } finally {
      setIsLoading(false);
    }
  };

  console.log(users, "Users");

  // Fetch casks
  const fetchCasks = async (page = 1, search = "") => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(
        `/casks?page=${page}&limit=${pagination.limit}&search=${search}`
      );
      const { casks, stats, pagination: apiPagination } = response.data.data;
      setCasks(casks);
      setFilteredCasks(casks);
      setStats({
        totalCasks: stats.totalCasks,
        readyCasks: stats.readyCasks,
        maturingCasks: stats.maturingCasks,
        totalValue: stats.totalValue,
        avgValue: stats.avgValue,
        totalGain: stats.totalGain,
      });
      setPagination({
        current: apiPagination.current,
        pages: apiPagination.pages,
        total: apiPagination.total,
        limit: apiPagination.limit,
      });
    } catch (error) {
      console.error(
        "Fetch Casks Error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to fetch casks.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCasks(pagination.current, searchQuery);
  }, []);

  // Handle search with debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== "") {
        fetchCasks(1, searchQuery);
      } else {
        fetchCasks(pagination.current, "");
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Filter casks locally for immediate feedback
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCasks(casks);
      return;
    }

    const filtered = casks.filter(
      (cask) =>
        cask.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cask.distillery.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCasks(filtered);
  }, [searchQuery, casks]);

  const handleEdit = (cask) => {
    setSelectedCask({ ...cask, notes: cask.notes || "" });
    setIsEditModalOpen(true);
  };

  const handleUpdateCask = async () => {
    if (!selectedCask) return;
    setIsLoading(true);
    try {
      await apiClient.put(`/casks/${selectedCask._id}/appreciation`, {
        status: selectedCask.status,
        notes: selectedCask.notes || "",
      });
      setCasks((prev) =>
        prev.map((c) =>
          c._id === selectedCask._id
            ? { ...c, status: selectedCask.status, notes: selectedCask.notes }
            : c
        )
      );
      setFilteredCasks((prev) =>
        prev.map((c) =>
          c._id === selectedCask._id
            ? { ...c, status: selectedCask.status, notes: selectedCask.notes }
            : c
        )
      );
      toast.success("Cask updated successfully!");
      setIsEditModalOpen(false);
      setSelectedCask(null);
    } catch (error) {
      console.error(
        "Update Cask Error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to update cask.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (cask) => {
    setCaskToDelete(cask);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!caskToDelete) return;
    setIsLoading(true);
    try {
      await apiClient.delete(`/casks/${caskToDelete._id}`);
      setCasks((prev) => prev.filter((c) => c._id !== caskToDelete._id));
      setFilteredCasks((prev) =>
        prev.filter((c) => c._id !== caskToDelete._id)
      );
      setStats((prev) => ({
        ...prev,
        totalCasks: prev.totalCasks - 1,
        readyCasks:
          caskToDelete.status === "Ready"
            ? prev.readyCasks - 1
            : prev.readyCasks,
        maturingCasks:
          caskToDelete.status === "Maturing"
            ? prev.maturingCasks - 1
            : prev.maturingCasks,
        totalValue: prev.totalValue - caskToDelete.currentValue,
        totalGain: prev.totalGain - caskToDelete.calculatedGain,
      }));
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
      toast.success("Cask deleted successfully!");
      setIsDeleteModalOpen(false);
      setCaskToDelete(null);
    } catch (error) {
      console.error(
        "Delete Cask Error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to delete cask.");
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
      fetchCasks(newPage, searchQuery);
    }
  };

  // Chart component for appreciation data
  const AppreciationChart = ({ data }) => {
    if (!data || !data.length) return null;

    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = Math.min(...data.map((d) => d.value));

    return (
      <div className="mt-4 p-4 border rounded-lg">
        <h4 className="font-semibold mb-3">Value Appreciation Over Time</h4>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{item.month}</span>
              <div className="flex items-center gap-2">
                <div
                  className="bg-[#B8860B] h-2 rounded"
                  style={{
                    width: `${
                      ((item.value - minValue) / (maxValue - minValue)) * 100
                    }px`,
                    minWidth: "20px",
                  }}
                />
                <span className="text-sm font-medium">
                  ${item.value.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Stats Cards */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
        <div className="p-6 rounded-lg shadow-sm bg-[#F2F5EF] border border-[#DBDADA] w-full sm:w-1/3">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Casks</p>
            <p className="text-3xl font-bold mt-1 text-[#909451]">
              {isLoading ? "Loading..." : stats.totalCasks}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-sm bg-[#E1F6EB] border border-[#DBDADA] w-full sm:w-1/3">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Ready Casks</p>
            <p className="text-3xl font-bold mt-1 text-[#22C55E]">
              {isLoading ? "Loading..." : stats.readyCasks}
            </p>
          </div>
        </div>
        <div className="p-6 rounded-lg shadow-sm bg-[#ECF1EA] border border-[#DBDADA] w-full sm:w-1/3">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Maturing Casks</p>
            <p className="text-3xl font-bold mt-1 text-[#22C55E]">
              {isLoading ? "Loading..." : stats.maturingCasks}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search casks..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-all duration-200"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border shadow-lg border-[#DBDADA] rounded-xl p-5 bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-5 text-gray-800">
            Cask List
          </h2>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#A67C00]"
            >
              + Add Cask
            </button>
          </div>
        </div>

        <table className="min-w-full rounded-xl text-center">
          <thead>
            <tr className="text-sm bg-[#B8860B] text-white">
              <th className="p-4 text-left">Cask Name</th>
              <th className="p-4">Distillery</th>
              <th className="p-4">Year</th>
              <th className="p-4">Volume</th>
              <th className="p-4">ABV</th>
              <th className="p-4">Current Value</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr>
                <td colSpan="8">
                  <Loader text="Loading casks..." />
                </td>
              </tr>
            ) : filteredCasks.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-6 text-center text-gray-600">
                  No casks found.
                </td>
              </tr>
            ) : (
              filteredCasks.map((cask) => (
                <tr
                  key={cask._id}
                  className="border-t border-[#DBDADA] hover:bg-gray-50"
                >
                  <td className="py-4 px-4 text-left font-medium">
                    {cask.name}
                  </td>
                  <td className="py-3 px-4">{cask.distillery}</td>
                  <td className="py-3 px-4">{cask.year}</td>
                  <td className="py-3 px-4">{cask.volume}</td>
                  <td className="py-3 px-4">{cask.abv}</td>
                  <td className="py-3 px-4 font-medium">
                    ${cask.currentValue?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-white text-xs sm:text-sm
    ${
      cask.status === "Ready"
        ? "bg-green-600"
        : cask.status === "Maturing"
        ? "bg-yellow-600"
        : cask.status === "Experience"
        ? "bg-blue-600"
        : "bg-gray-500"
    }`}
                    >
                      {cask.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-3">
                      <RiEditBoxLine
                        className="cursor-pointer text-[#B8860B] hover:text-[#A67C00] text-lg"
                        onClick={() => handleEdit(cask)}
                      />
                      <RiDeleteBin5Line
                        className="text-red-500 hover:text-red-700 cursor-pointer text-lg"
                        onClick={() => handleDeleteClick(cask)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={pagination.current}
        totalPages={pagination.pages}
        onPageChange={handlePageChange}
        loading={isLoading}
        data={filteredCasks}
        totalItems={pagination.total}
        itemLabel="casks"
        onRefresh={() => fetchCasks(pagination.current, searchQuery)}
        showItemCount={true}
        showRefresh={true}
      />

      <CommonModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
          }
          setNewCask({
            name: "",
            distillery: "",
            year: "",
            volume: "",
            abv: "",
            location: "",
            estimatedValue: "",
            currentValue: "",
            purchasePrice: "",
            status: "Ready",
            owner: "",
            caskImages: null,
          });
        }}
        title="Add New Cask"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cask Image
            </label>

            {/* Image Preview */}
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Cask preview"
                  className="w-full h-40 object-cover rounded-xl border-2 border-gray-300"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  type="button"
                >
                  ×
                </button>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {newCask.caskImages?.name}
                </div>
              </div>
            ) : (
              /* Upload Area */
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-10 h-10 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5.002 5.002 0 0115 8h1a5 5 0 010 10H9a4 4 0 01-2-.536z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag & drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    name="caskImages"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            )}
          </div>
<div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <div className="relative">
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#B8860B]/20 focus:border-[#B8860B] transition-colors bg-white appearance-none"
                  value={newCask.type}>
                  <option value="cask">Cask</option>
                  <option value="bottle">Bottle</option>
                  <option value="experience">Experience</option>
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          <div className=" grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Owner
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newCask.owner}
                onChange={(e) =>
                  setNewCask({ ...newCask, owner: e.target.value })
                }
              >
                <option value="">Select User</option>
                {users?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cask Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newCask.name}
                onChange={(e) =>
                  setNewCask({ ...newCask, name: e.target.value })
                }
                placeholder="Enter cask name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distillery
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newCask.distillery}
                onChange={(e) =>
                  setNewCask({ ...newCask, distillery: e.target.value })
                }
                placeholder="Enter distillery name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newCask.year}
                onChange={(e) =>
                  setNewCask({ ...newCask, year: e.target.value })
                }
                placeholder="Enter year"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Volume
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newCask.volume}
                onChange={(e) =>
                  setNewCask({ ...newCask, volume: e.target.value })
                }
                placeholder="e.g. 2000L"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ABV
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newCask.abv}
                onChange={(e) =>
                  setNewCask({ ...newCask, abv: e.target.value })
                }
                placeholder="e.g. 40%"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newCask.location}
                onChange={(e) =>
                  setNewCask({ ...newCask, location: e.target.value })
                }
                placeholder="Enter location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newCask.status}
                onChange={(e) =>
                  setNewCask({ ...newCask, status: e.target.value })
                }
              >
                <option value="Ready">Ready</option>
                <option value="Maturing">Maturing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Price
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newCask.currentValue}
                onChange={(e) =>
                  setNewCask({ ...newCask, currentValue: e.target.value })
                }
                placeholder="Enter current price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Price
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newCask.purchasePrice}
                onChange={(e) =>
                  setNewCask({ ...newCask, purchasePrice: e.target.value })
                }
                placeholder="Enter purchase price"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                if (imagePreview) {
                  URL.revokeObjectURL(imagePreview);
                  setImagePreview(null);
                }
                setNewCask({
                  name: "",
                  distillery: "",
                  year: "",
                  volume: "",
                  abv: "",
                  location: "",
                  estimatedValue: "",
                  currentValue: "",
                  purchasePrice: "",
                  status: "Ready",
                  owner: "",
                  caskImages: null,
                });
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCask}
              className="px-6 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#A67C00] flex-1 disabled:bg-[#A67C00]/60"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Add Cask"}
            </button>
          </div>
        </div>
      </CommonModal>

      {/* Edit Modal */}
      <CommonModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCask(null);
        }}
        title="Edit Cask"
      >
        {selectedCask && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Cask Name:</span>
                <p className="text-gray-600">{selectedCask.name}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Distillery:</span>
                <p className="text-gray-600">{selectedCask.distillery}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Year:</span>
                <p className="text-gray-600">{selectedCask.year}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Volume:</span>
                <p className="text-gray-600">{selectedCask.volume}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">ABV:</span>
                <p className="text-gray-600">{selectedCask.abv}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Current Value:
                </span>
                <p className="text-gray-600">
                  ${selectedCask.currentValue?.toLocaleString()}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Gain:</span>
                <p className="text-gray-600">
                  {selectedCask.gain} ({selectedCask.gainPercentage})
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Purchase Date:
                </span>
                <p className="text-gray-600">
                  {new Date(selectedCask.purchaseDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-700">Status:</span>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 flex-1 outline-none focus:ring-2 focus:ring-[#B8860B] focus:border-[#B8860B]"
                value={selectedCask.status}
                onChange={(e) =>
                  setSelectedCask({ ...selectedCask, status: e.target.value })
                }
              >
                <option value="Ready">Ready</option>
                <option value="Maturing">Maturing</option>
              </select>
            </div>

            <div>
              <span className="font-semibold text-gray-700 block mb-2">
                Notes:
              </span>
              <textarea
                className="border border-gray-300 rounded-lg px-3 py-2 w-full min-h-[80px] outline-none focus:ring-2 focus:ring-[#B8860B] focus:border-[#B8860B]"
                value={selectedCask.notes || ""}
                onChange={(e) =>
                  setSelectedCask({ ...selectedCask, notes: e.target.value })
                }
                placeholder="Enter notes here..."
              />
            </div>

            {/* Appreciation Chart */}
            {selectedCask.appreciationData && (
              <AppreciationChart data={selectedCask.appreciationData} />
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedCask(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex-1"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCask}
                className="px-6 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#A67C00] flex-1 disabled:bg-[#A67C00]/60"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </CommonModal>

      {/* Delete Modal */}
      <CommonModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCaskToDelete(null);
        }}
        title="Confirm Delete"
      >
        {caskToDelete && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-gray-700">
                Are you sure you want to delete cask{" "}
                <strong>{caskToDelete.name}</strong> from{" "}
                <strong>{caskToDelete.distillery}</strong>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCaskToDelete(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex-1"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex-1 disabled:bg-red-400"
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete Cask"}
              </button>
            </div>
          </div>
        )}
      </CommonModal>
    </div>
  );
};

export default CaskManagement;
