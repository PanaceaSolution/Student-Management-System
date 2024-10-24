import React from "react";

// List of Tailwind CSS text color classes
const tailwindColors = [
  "text-red-700",
  "text-blue-700",
  "text-green-700",
  "text-yellow-700",
  "text-purple-700",
  "text-pink-700",
  "text-indigo-700",
  "text-teal-700",
];

const getRandomColorClass = () => {
  const randomIndex = Math.floor(Math.random() * tailwindColors.length);
  return tailwindColors[randomIndex];
};

const Notice = () => {
  return (
    <>
      {Array.from({ length: 15 }).map((_, index) => (
        <div key={index} className="px-2 border-b-2 p-3">
          <span className="text-xs font-semibold ">{new Date().toDateString()}</span>
          <p className="text-sm flex gap-2">
        <span className={getRandomColorClass()}>    Creating database</span> <span>5 min ago</span>
          </p>
          <p >
            Sukraj Chaudhary joined the party with Ashutosh.
          </p>
        </div>
      ))}
    </>
  );
};

export default Notice;
