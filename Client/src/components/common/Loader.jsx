import { lineSpinner } from "ldrs";

lineSpinner.register();
import React from "react";

const Loader = () => {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
    <div className="h-36 w-36 flex justify-center items-center relative rounded-2xl">
      {/* Overlay */}
      <div className="absolute  rounded-lg "></div>
      
      {/* Loader Container */}
      <div className="relative z-50 flex flex-col justify-center items-center space-y-5 ">
        <l-line-spinner
          size="50"
          stroke="5"
          speed="1"
          color="blue"
        ></l-line-spinner>
        <p className="text-xl font-normal text-white">Please wait ....</p>
      </div>
    </div>
    </div>
  );
};

export default Loader;
