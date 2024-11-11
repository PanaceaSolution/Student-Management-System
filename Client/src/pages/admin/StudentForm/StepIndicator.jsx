// components/StepIndicator.js
import React from "react";

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <ol className="flex items-center  max-w-7xl justify-evenly p-0 mb-2 space-x-1 text-sm font-medium text-center text-gray-500 bg-green-200 border border-gray-200 rounded-sm shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4 rtl:space-x-reverse">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <li
            key={index}
            className={`flex items-center ${
              isActive
                ? "text-blue-600 dark:text-blue-500"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <span
              className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0 ${
                isCompleted
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-500 dark:border-gray-400"
              }`}
            >
              {index + 1}
            </span>
            <span className={isActive ? "font-bold" : ""}>{step}</span>
            {index < steps.length - 1 && (
              <svg
                className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 12 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m7 9 4-4-4-4M1 9l4-4-4-4"
                />
              </svg>
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default StepIndicator;

