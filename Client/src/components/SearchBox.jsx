import React from "react";
import { Search } from "lucide-react";

const SearchBox = ({
  placeholder = "Search here....",
  onChange,
  className = "",
}) => {
  return (
    <form>
      <div className="relative w-full">
        <input
          type="search"
          id="search-dropdown"
          className="block p-2.5 pl-10 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
          placeholder={placeholder}
          onChange={onChange}
          required
        />
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </span>
      </div>
    </form>
  );
};

export default SearchBox; 