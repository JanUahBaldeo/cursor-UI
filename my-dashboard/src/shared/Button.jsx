import React from 'react';

const Button = ({ children, className = '', ...props }) => (
  <button className={`px-4 py-2 rounded bg-cyan-600 text-white font-semibold shadow hover:bg-cyan-700 transition ${className}`} {...props}>
    {children}
  </button>
);

export default Button; 