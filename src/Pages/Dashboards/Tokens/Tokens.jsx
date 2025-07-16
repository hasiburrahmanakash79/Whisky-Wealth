import { useState } from "react";
import {
  RiArrowLeftLine,
  RiCopperCoinLine,
  RiDeleteBin5Line,
  RiEditBoxLine,
} from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import CommonModal from "../../../components/Common/CommonModal";

const tokens = [
  {
    id: 1,
    username: "Albert Einstein",
    email: "albert.einstein@example.com",
    tokenNumber: "TK-983217",
    lastRefillDate: "2025-06-01",
  },
  {
    id: 2,
    username: "Maya Angelou",
    email: "maya.angelou@example.com",
    tokenNumber: "TK-874561",
    lastRefillDate: "2025-06-05",
  },
  {
    id: 3,
    username: "Steve Jobs",
    email: "steve.jobs@example.com",
    tokenNumber: "TK-345902",
    lastRefillDate: "2025-06-10",
  },
  {
    id: 4,
    username: "Confucius",
    email: "confucius@example.com",
    tokenNumber: "TK-220198",
    lastRefillDate: "2025-06-15",
  },
  {
    id: 5,
    username: "Helen Keller",
    email: "helen.keller@example.com",
    tokenNumber: "TK-119374",
    lastRefillDate: "2025-06-20",
  },
];


const Tokens = () => {
  const navigate = useNavigate();
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
        <button
          className="text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <RiArrowLeftLine />
        </button>
        <h1 className="text-2xl font-semibold">Tokens</h1>
      </div>
      <div className="grid grid-cols-3 gap-7 my-10">
        <div className="rounded-2xl p-10 text-white bg-[#2898FF]">
          <div className="flex items-center justify-center gap-5">
            <RiCopperCoinLine className="text-4xl" />
            <div className="space-y-3">
              <p className="text-lg">This Month Sell</p>
              <h1 className="text-3xl font-semibold">120</h1>
            </div>
          </div>
        </div>
        <div className="rounded-2xl p-10 text-white bg-[#9B30FF]">
          <div className="flex items-center justify-center gap-5">
            <RiCopperCoinLine  className="text-4xl" />
            <div className="space-y-3">
              <p className="text-lg">Last Month Sell</p>
              <h1 className="text-3xl font-semibold">233</h1>
            </div>
          </div>
        </div>
        <div className="rounded-2xl p-10 text-white bg-[#FF3EC8]">
          <div className="flex items-center justify-center gap-5">
            <RiCopperCoinLine  Line className="text-4xl" />
            <div className="space-y-3">
              <p className="text-lg">Tokens Used This Month</p>
              <h1 className="text-3xl font-semibold">300</h1>
            </div>
          </div>
        </div>
      </div>

      <table className="min-w-full rounded-xl text-left overflow-hidden">
        <thead>
          <tr className="text-sm  bg-[#B7C8FF]">
            <th className="p-4"></th>
            <th className="p-4">Username</th>
            <th className="p-4">Email</th>
            <th className="p-4">Token</th>
            <th className="p-4">Last Refill</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {tokens.map((token, index) => (
            <tr key={token?.id} className="border-t border-gray-200">
              <td className="py-3 px-4">{index + 1}</td>
              <td className="py-3 px-4 text-left hover:text-blue-500 hover:underline">
                <Link to={`/author/${token?._id}`}>{token?.username}</Link>
              </td>
              <td className="py-3 px-4">{token?.email}</td>
              <td className="py-3 px-4">{token?.tokenNumber}</td>
              <td className="py-3 px-4">{token?.lastRefillDate}</td>
              <td className="py-3 px-4 flex items-center gap-5">
                <button onClick={() => handleEdit(token)}>
                  <RiEditBoxLine className="cursor-pointer" />
                </button>
                <button onClick={() => handleDeleteClick(token)}>
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
        title="Edit token"
      >
        {selectedToken && (
          <>
            <input
              type="text"
              placeholder="Author Name"
              className="w-full border border-blue-300 rounded-md p-2 mb-4"
            />
            <select
              name="category"
              className="w-full border border-blue-300 rounded-md p-2 mb-4"
              value={selectedToken.category}
              onChange={(e) =>
                setSelectedToken({ ...selectedToken, category: e.target.value })
              }
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="sad">Sad</option>
              <option value="success">Success</option>
              <option value="motivation">Motivation</option>
              <option value="life">Life</option>
              <option value="love">Love</option>
              <option value="happiness">Happiness</option>
            </select>

            <textarea
              rows={4}
              className="w-full border border-blue-300 rounded-md p-2"
              placeholder="Edit token"
              value={selectedToken.token}
              onChange={(e) =>
                setSelectedToken({ ...selectedToken, token: e.target.value })
              }
            />

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="border px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button onClick={handleUpdateToken} className="btn-primary">
                Save
              </button>
            </div>
          </>
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
                className="border px-5 py-3 rounded-md"
              >
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
  );
};

export default Tokens;
