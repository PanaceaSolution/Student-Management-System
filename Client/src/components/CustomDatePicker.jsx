import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const CustomDatePicker = ({ selected, onChange, placeholder }) => {
   return (
      <DatePicker
         selected={selected}
         onChange={onChange}
         dateFormat="yyyy/MM/dd"
         placeholderText={placeholder}
         className="flex h-10 w-full rounded-md border border-gray-600 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
   );
};