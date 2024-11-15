import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { lineSpinner } from "ldrs";

lineSpinner.register();
import React from "react";

const LoadingText = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length === 5) return "";
        return prevDots + ".";
      });
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex items-center flex-col space-y-2 p-4 ">
      <div className="relative z-50 flex flex-col justify-center items-center space-y-5 ">
        <l-line-spinner
          size="50"
          stroke="5"
          speed="1"
          color="blue"
        ></l-line-spinner>
      </div>
      <span className="font-semibold text-lg text-white">Loading{dots}</span>
    </div>
  );
};

export default LoadingText;
