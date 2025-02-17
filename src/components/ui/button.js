import React from 'react';

export const Button = ({ children, className, ...props }) => (
  <button
    className={`bg-blue-500 text-white py-2 px-4 rounded-md ${className}`}
    {...props}
  >
    {children}
  </button>
);
