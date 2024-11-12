import { lineSpinner } from "ldrs";

lineSpinner.register();
import React from "react";

const Loader = () => {
  return (
    <div className="h-36 w-36 flex justify-center items-center relative z-50 rounded-2xl">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-40"></div>
      
      {/* Loader Container */}
      <div className="relative z-50 flex justify-center items-center">
        <l-line-spinner
          size="50"
          stroke="5"
          speed="1"
          color="white"
        ></l-line-spinner>
      </div>
    </div>
  );
};

export default Loader;
