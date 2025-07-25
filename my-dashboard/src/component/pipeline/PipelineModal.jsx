import React from 'react';

const PipelineModal = ({ card, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
    <div className="bg-white rounded-xl shadow-xl p-6 min-w-[320px] max-w-lg relative">
      <button onClick={onClose} className="absolute top-2 right-4 text-gray-400 hover:text-gray-700 text-2xl">×</button>
      <h2 className="text-xl font-bold mb-2">{card?.borrower} ({card?.loanNumber})</h2>
      <div><strong>Address:</strong> {card?.address}</div>
      <div><strong>Loan Type:</strong> {card?.loanType}</div>
      <div><strong>Stage:</strong> {card?.stage}</div>
      <div><strong>Time in Stage:</strong> {card?.timeInStage} days</div>
      <div><strong>Status:</strong> {card?.status}</div>
      {/* Add CTA dropdown, text/call widget, etc. here */}
    </div>
  </div>
);

export default PipelineModal; 