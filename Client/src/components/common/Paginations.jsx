import React from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";

const Paginations = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPaginationItems = () => {
    const items = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      if (currentPage > 2) {
        items.push(1);
        if (currentPage > 3) items.push("..."); 
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        items.push(i);
      }
      
      if (currentPage < totalPages - 1) {
        if (currentPage < totalPages - 2) items.push("...");
        items.push(totalPages);
      }
    }

    return items;
  };

  return (
    <div>
      <ol className="flex justify-center md:justify-end gap-1 text-xs font-medium p-4">
        <li>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="inline-flex size-8 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-900 disabled:opacity-50"
          >
            <span className="sr-only">Prev Page</span>
            <ChevronLeft />
          </button>
        </li>

        {getPaginationItems().map((item, index) => (
          <li key={index}>
            {typeof item === 'number' ? (
              <button
                onClick={() => onPageChange(item)}
                className={`block size-8 text-sm font-semibold rounded-full border text-center leading-8 ${
                  currentPage === item
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-100 bg-white text-gray-900"
                }`}
              >
                {item}
              </button>
            ) : (
              <span className="block size-8 rounded-full text-center leading-8 text-gray-900">
                {item}
              </span>
            )}
          </li>
        ))}

        <li>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="inline-flex size-8 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-900 disabled:opacity-50"
          >
            <span className="sr-only">Next Page</span>
            <ChevronRight />
          </button>
        </li>
      </ol>
    </div>
  );
};

export default Paginations;
