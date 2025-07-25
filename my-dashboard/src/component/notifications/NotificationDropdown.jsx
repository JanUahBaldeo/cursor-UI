import React from 'react';

const NotificationDropdown = ({ notifications, onClose }) => (
  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border z-50">
    {/* Notifications list and actions will go here */}
    <div>NotificationDropdown</div>
    <button onClick={onClose} className="text-xs text-cyan-600 hover:underline">Close</button>
  </div>
);

export default NotificationDropdown; 