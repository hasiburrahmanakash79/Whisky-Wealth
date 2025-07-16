import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { RiArrowLeftLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import CommonModal from "../../../components/Common/CommonModal";

const Challenge = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddChallenge = () => {
    // handle form submission here
    console.log("Title:", title);
    console.log("Description:", description);
    setIsModalOpen(false);
    setTitle("");
    setDescription("");

  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 mb-6">
          <button className="text-2xl cursor-pointer" onClick={() => navigate(-1)}>
            <RiArrowLeftLine />
          </button>
          <h1 className="text-2xl font-semibold">Challenges</h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 bg-blue-500/20 py-2 px-4 rounded-full"
        >
          <FaPlus className="text-sm" />
          Add New
        </button>
      </div>
      <div className="rounded-xl border border-blue-400 p-5 space-y-5 mt-10">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="border border-blue-500 p-5 rounded-xl">
            <h1 className="font-semibold">Gratitude Reset</h1>
            <p className="text-xs">
              Spot what’s still good, strong, and true today.
            </p>
          </div>
        ))}
      </div>

      <CommonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Challenge"
      >
        <input
          type="text"
          placeholder="Title"
          className="w-full border border-blue-300 rounded-md p-2 mb-4"
        />
        <textarea
          placeholder="Description"
          className="w-full border border-blue-300 rounded-md p-2"
          rows={4}
        />
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="border px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button onClick={handleAddChallenge} className="btn-primary">
            Save
          </button>
        </div>
      </CommonModal>
    </div>
  );
};

export default Challenge;
