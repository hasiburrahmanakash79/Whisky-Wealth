// components/Common/Loader.jsx

const Loader = ({ text = "Loading...", size = 10, color = "#B8860B" }) => {
  return (
    <div className="flex justify-center items-center gap-2 py-6">
      <svg
        className={`animate-spin h-${size} w-${size}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        style={{ color }}>
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <span className="text-gray-600">{text}</span>
    </div>
  );
};

export default Loader;
