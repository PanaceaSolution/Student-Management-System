// src/Select.js
import React from 'react';

const Select = ({ options, selectedValue, onChange, className = '', style = {} }) => {
    return (
        <div className={`max-w-sm mx-auto ${className}`}>
      
            <select
                id="select"
                value={selectedValue}
                onChange={onChange}
                style={style}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;
