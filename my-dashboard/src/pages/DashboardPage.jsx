// src/pages/DashboardPage.jsx
import React, { useState } from 'react';
import PipelineSection from '../component/dashboard/PipelineSection';
import TaskBoard from '../component/tasks/TaskBoard';
import MarketingSection from '../component/dashboard/MarketingSection';
import CalendarSection from '../component/calendar/CalendarSection';
import CommunicationLog from '../component/communication/CommunicationLog';
import DocumentTracker from '../component/documents/DocumentTracker';
import ProductionDashboard from '../component/production/ProductionDashboard';
import NotificationDropdown from '../component/notifications/NotificationDropdown';
import Button from '../shared/Button';

const userRoles = ['Loan Officer', 'LOA', 'Production Partner'];

const DashboardPage = () => {
  const [currentRole, setCurrentRole] = useState('Loan Officer');
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="p-6">
      {/* Role Switcher */}
      <div className="flex gap-4 mb-6 items-center">
        <span className="font-semibold">Role:</span>
        <select
          value={currentRole}
          onChange={e => setCurrentRole(e.target.value)}
          className="border rounded px-3 py-1"
        >
          {userRoles.map(role => (
            <option key={role}>{role}</option>
          ))}
        </select>
        <Button onClick={() => setShowNotifications(s => !s)}>
          Notifications
        </Button>
      </div>
      {/* Notifications Dropdown */}
      {showNotifications && (
        <NotificationDropdown notifications={[]} onClose={() => setShowNotifications(false)} />
      )}
      {/* Main Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <PipelineSection role={currentRole} />
          <TaskBoard role={currentRole} />
        </div>
        <div>
          <MarketingSection role={currentRole} />
          <CalendarSection role={currentRole} />
          <CommunicationLog role={currentRole} />
          <DocumentTracker role={currentRole} />
          <ProductionDashboard role={currentRole} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;