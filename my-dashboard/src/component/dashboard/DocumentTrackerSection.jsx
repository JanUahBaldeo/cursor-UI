import React, { useState } from 'react';
import DocumentChecklist from './DocumentChecklist';
import { useUser } from '../../context/UserContext';

const MOCK_DOCS = [
  { name: 'W-2 Form', status: 'REQUIRED', date: '2024-05-01', checked: false, stage: 'Application', daysSince: 2 },
  { name: 'Bank Statement', status: 'RECEIVED', date: '2024-04-29', checked: true, stage: 'Application', daysSince: 0 },
  { name: 'Pay Stub', status: 'PENDING', date: '2024-04-28', checked: false, stage: 'Processing', daysSince: 3 },
  { name: 'ID Proof', status: 'REQUIRED', date: '2024-04-27', checked: false, stage: 'Underwriting', daysSince: 4 },
  { name: 'Tax Return', status: 'RECEIVED', date: '2024-04-25', checked: true, stage: 'Processing', daysSince: 0 },
];

const STAGE_OPTIONS = ['All', 'Application', 'Processing', 'Underwriting'];
const DAYS_OPTIONS = ['All', '1', '2', '3', '4+'];

const DocumentTrackerSection = () => {
  const { role } = useUser();
  const [stage, setStage] = useState('All');
  const [days, setDays] = useState('All');

  // Role-aware: visible for all roles (customize as needed)
  if (!role) return null;

  // Filter logic
  let filteredDocs = MOCK_DOCS;
  if (stage !== 'All') filteredDocs = filteredDocs.filter(doc => doc.stage === stage);
  if (days !== 'All') {
    if (days === '4+') filteredDocs = filteredDocs.filter(doc => doc.daysSince >= 4);
    else filteredDocs = filteredDocs.filter(doc => doc.daysSince === Number(days));
  }

  return (
    <section className="max-w-2xl mx-auto my-10 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-cyan-900">
        <span className="text-3xl">🗂️</span> Document Tracker
      </h2>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select value={stage} onChange={e => setStage(e.target.value)} className="px-3 py-1.5 rounded-full border border-cyan-200 bg-white text-cyan-900 text-sm">
          {STAGE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
        </select>
        <select value={days} onChange={e => setDays(e.target.value)} className="px-3 py-1.5 rounded-full border border-cyan-200 bg-white text-cyan-900 text-sm">
          {DAYS_OPTIONS.map(opt => <option key={opt}>{opt === 'All' ? 'All Days' : `${opt} Days`}</option>)}
        </select>
        <button className="ml-auto px-4 py-1.5 rounded-full bg-cyan-600 text-white font-semibold shadow hover:bg-cyan-700 transition">Upload</button>
        <button className="px-4 py-1.5 rounded-full bg-cyan-100 text-cyan-700 font-semibold shadow hover:bg-cyan-200 transition">Download</button>
      </div>
      {/* Checklist */}
      <DocumentChecklist documents={filteredDocs} accentColor="#06b6d4" />
      {/* Age of missing docs */}
      <div className="mt-6">
        <h4 className="text-md font-semibold mb-2 text-cyan-800">Age of Missing Documents</h4>
        <ul className="list-disc pl-6 text-cyan-700 text-sm">
          {filteredDocs.filter(doc => doc.status !== 'RECEIVED').map((doc, i) => (
            <li key={i}>{doc.name}: <span className="font-bold">{doc.daysSince} day(s)</span> since requested</li>
          ))}
          {filteredDocs.filter(doc => doc.status !== 'RECEIVED').length === 0 && (
            <li>All required documents received.</li>
          )}
        </ul>
      </div>
    </section>
  );
};

export default DocumentTrackerSection; 