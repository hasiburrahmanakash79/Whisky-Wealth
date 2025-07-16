import { IoArrowBackOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

const CommonBar = ({ currentRoute }) => {
  const navigate = useNavigate();
  const getAddButtonPath = () => {
    return `/${currentRoute.toLowerCase()}/add`;
  };

  // Get the correct button text
  const getAddButtonText = () => {
    return `Add ${currentRoute}`;
  };
  return (
    <div className="flex items-center justify-between gap-2 font-medium text-lg mb-7">
      <div className="flex justify-center items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer"
          title="Go back"
        >
          <IoArrowBackOutline className="text-2xl" />
        </button>
        <span className="capitalize text-2xl font-semibold">
          {currentRoute.replace(/-/g, " ")}
        </span>
      </div>
      <div className="flex  ">
        <Link
          to={getAddButtonPath()}
          className="px-4 py-2 rounded-lg text-sm bg-blue-500 hover:shadow-xl text-white cursor-pointer transition"
        >
          {getAddButtonText()}
        </Link>
      </div>
    </div>
  );
};

export default CommonBar;
