import React from "react";

// List of Tailwind CSS background color classes for the timeline markers
const tailwindColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
];

const getRandomColorClass = () => {
  const randomIndex = Math.floor(Math.random() * tailwindColors.length);
  return tailwindColors[randomIndex];
};

const RecentActivity = () => {
  return (
    <div className="p-4">
      <ol className="relative border-s border-gray-200 dark:border-gray-700">
        {
      [
        {
          "date": "January 2023",
          "title": "Application UI code in Tailwind CSS",
          "description": "Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce & Marketing pages."
        },
        {
          "date": "March 2022",
          "title": "E-Commerce UI code in Tailwind CSS",
          "description": "Get started with dozens of web components and interactive elements built on top of Tailwind CSS."
        },
        {
          "date": "February 2023",
          "title": "Mobile App UI in React Native",
          "description": "Develop an engaging mobile application with intuitive UI components."
        },
        {
          "date": "April 2022",
          "title": "Landing Page Design in Adobe XD",
          "description": "Design user-friendly landing pages that drive conversions."
        },
        {
          "date": "May 2022",
          "title": "Marketing UI design in Figma",
          "description": "All of the pages and components are first designed in Figma and we keep a parity between the two versions even as we update the project."
        },
        {
          "date": "June 2023",
          "title": "Admin Panel with React",
          "description": "Implement a powerful admin panel for managing users and content."
        },
        {
          "date": "July 2022",
          "title": "User Profile Page with Tailwind",
          "description": "Build a responsive user profile page that showcases user data."
        },
        {
          "date": "August 2022",
          "title": "Website Redesign Project",
          "description": "Redesign existing websites for improved user experience and accessibility."
        },
        {
          "date": "September 2023",
          "title": "Dashboard UI with Chart.js",
          "description": "Create an interactive dashboard with real-time data visualizations."
        },
        {
          "date": "October 2022",
          "title": "Data Visualization with D3.js",
          "description": "Visualize complex data with easy-to-understand graphics and charts."
        }
      ]
      .map((activity, index) => (
          <li key={index} className="mb-10 ms-4">
            <div
              className={`absolute w-3 h-3 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 ${getRandomColorClass()}`}
            />
            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              {activity.date}
            </time>
            <h3 className="text-md font-semibold text-gray-900 dark:text-white">
              {activity.title}
            </h3>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              {activity.description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RecentActivity;
