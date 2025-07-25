import React, { useState } from 'react';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'workflow', message: 'Zapier: Loan file sync failed.', time: '2m ago', unread: true },
  { id: 2, type: 'preapproval', message: 'Pre-approval expiring in 1 day for John Doe.', time: '1h ago', unread: true },
  { id: 3, type: 'inactive', message: 'Loan #1234 inactive for 4 days.', time: '3h ago', unread: false },
  { id: 4, type: 'missingdoc', message: 'Missing W-2 for Jane Smith.', time: 'Today', unread: false },
];

const ICONS = {
  workflow: '⚠️',
  preapproval: '⏰',
  inactive: '🛑',
  missingdoc: '📄',
};

const NotificationDropdown = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  if (!open) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-gray-200 z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="font-semibold text-cyan-900">Notifications</span>
        <button onClick={handleMarkAllRead} className="text-xs text-cyan-600 hover:underline">Mark all as read</button>
      </div>
      <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100">
        {notifications.length === 0 && (
          <li className="px-4 py-6 text-center text-gray-400">No notifications</li>
        )}
        {notifications.map(n => (
          <li key={n.id} className={`flex items-start gap-3 px-4 py-3 ${n.unread ? 'bg-cyan-50' : ''}`}>
            <span className="text-xl">{ICONS[n.type]}</span>
            <div className="flex-1">
              <div className="text-sm text-cyan-900 font-medium">{n.message}</div>
              <div className="text-xs text-cyan-500 mt-1">{n.time}</div>
            </div>
            {n.unread && <span className="w-2 h-2 rounded-full bg-cyan-500 mt-1" />}
          </li>
        ))}
      </ul>
      <div className="px-4 py-2 text-right">
        <button onClick={onClose} className="text-xs text-cyan-600 hover:underline">Close</button>
      </div>
    </div>
  );
};

export default NotificationDropdown; 