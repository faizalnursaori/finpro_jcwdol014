import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center my-4">
      <button
        className="btn"
        onClick={handlePrevClick}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span className="mx-2 my-2">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="btn"
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};
