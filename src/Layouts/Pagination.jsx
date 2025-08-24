const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
  error = false,
  data = [],
  totalItems = 0,
  onRefresh,
  showPageNumbers = true,
  showItemCount = true,
  showRefresh = false,
  itemLabel = "items",
  maxVisiblePages = 5,
  className = "",
  size = "md", // sm, md, lg
}) => {
  // Size configurations
  const sizeClasses = {
    sm: {
      button: "px-2 py-1 text-xs",
      text: "text-xs",
    },
    md: {
      button: "px-4 py-2 text-sm",
      text: "text-sm",
    },
    lg: {
      button: "px-6 py-3 text-base",
      text: "text-base",
    },
  };

  const sizeConfig = sizeClasses[size] || sizeClasses.md;

  // Generate page numbers to display
  const getVisiblePageNumbers = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const visiblePages = getVisiblePageNumbers();

  // Don't render if loading, error, or no data (when showItemCount is true)
  if (showItemCount && (loading || error || !data?.length)) {
    return null;
  }

  // // Don't render if no pages
  // if (totalPages <= 1) {
  //   return null;
  // }

  return (
    <div className={`flex justify-between items-center mt-4 ${className}`}>
      {/* Left side - Item count (optional) */}
      <div className={sizeConfig.text}>
        {showItemCount && data?.length > 0 ? (
          <>
            Showing {data.length} of {totalItems} {itemLabel}
          </>
        ) : (
          <span></span> // Empty space to maintain layout
        )}
      </div>

      {/* Right side - Navigation controls */}
      <div className="flex gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className={`${sizeConfig.button} border border-[#B8860B] rounded-lg disabled:opacity-50 hover:bg-[#B8860B] hover:text-white transition-colors disabled:cursor-not-allowed`}>
          Previous
        </button>

        {/* Page Numbers */}
        {showPageNumbers && (
          <>
            {/* First page indicator */}
            {visiblePages[0] > 1 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  disabled={loading}
                  className={`${sizeConfig.button} border border-[#B8860B] rounded-lg hover:bg-[#B8860B] hover:text-white transition-colors disabled:cursor-not-allowed`}>
                  1
                </button>
                {visiblePages[0] > 2 && (
                  <span
                    className={`${sizeConfig.text} px-2 py-2 text-gray-500`}>
                    ...
                  </span>
                )}
              </>
            )}

            {/* Visible page numbers */}
            {visiblePages.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                disabled={loading}
                className={`${
                  sizeConfig.button
                } rounded-lg transition-colors disabled:cursor-not-allowed ${
                  pageNum === currentPage
                    ? "bg-[#B8860B] text-white"
                    : "border border-[#B8860B] hover:bg-[#B8860B] hover:text-white"
                }`}>
                {pageNum}
              </button>
            ))}

            {/* Last page indicator */}
            {visiblePages[visiblePages.length - 1] < totalPages && (
              <>
                {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                  <span
                    className={`${sizeConfig.text} px-2 py-2 text-gray-500`}>
                    ...
                  </span>
                )}
                <button
                  onClick={() => onPageChange(totalPages)}
                  disabled={loading}
                  className={`${sizeConfig.button} border border-[#B8860B] rounded-lg hover:bg-[#B8860B] hover:text-white transition-colors disabled:cursor-not-allowed`}>
                  {totalPages}
                </button>
              </>
            )}
          </>
        )}

        {/* Page info (when page numbers are hidden) */}
        {!showPageNumbers && (
          <span className={`${sizeConfig.button}`}>
            Page {currentPage} of {totalPages}
          </span>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className={`${sizeConfig.button} border border-[#B8860B] rounded-lg disabled:opacity-50 hover:bg-[#B8860B] hover:text-white transition-colors disabled:cursor-not-allowed`}>
          Next
        </button>

        {/* Refresh Button */}
        {showRefresh && onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`${sizeConfig.button} bg-[#B8860B] text-white rounded-lg hover:bg-[#a0730b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}>
            Refresh
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
