import React from 'react';

const Input = ({ className = '', ...props }) => (
  <input className={`border rounded px-3 py-2 focus:ring-2 focus:ring-cyan-400 outline-none ${className}`} {...props} />
);
 
export default Input; 