// src/Button.js
import React from "react";

const Button = ({ type, onClick, children }) => {
  const baseClasses =
    "inline-block rounded border border-current transition focus:outline-none ";

  const typeClasses = {
    edit: "text-green-600 hover:shadow-xl active:text-green-500 px-7 py-2 text-base",
    delete:
      "text-red-600 hover:shadow-xl active:text-red-500 px-7 py-2 text-base",
    default: "text-indigo-600 active:text-indigo-500 text-base",
    create: "bg-[#233255CC] text-[#FFFFFF] text-base px-3 py-1 sm:py-2",
    print: "bg-[#233255CC] text-[#FFFFFF] text-base px-3 py-1 sm:py-2",
  };

  return (
    <button
      type="button"
      className={`${baseClasses} ${typeClasses[type] || typeClasses.default}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
