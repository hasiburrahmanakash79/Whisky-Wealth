import { useEffect } from "react";

const CommonModal = ({ isOpen, onClose, title, children }) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup when modal unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-40 flex justify-center items-center z-50 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-black text-lg cursor-pointer"
        >
          ✕
        </button>
        <div className="p-10">
          <h2 className="text-xl font-semibold text-center my-4 text-black">
            {title}
          </h2>

          <div className="text-sm text-gray-700">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
