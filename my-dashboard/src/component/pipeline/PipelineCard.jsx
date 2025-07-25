import React from 'react';

const PipelineCard = ({ card, onClick }) => (
  <div onClick={onClick} className="rounded-xl shadow p-4 bg-white mb-2 cursor-pointer">
    <div>{card.borrower}</div>
    <div>{card.loanType}</div>
    <div>{card.status}</div>
    {/* Add more fields as needed */}
  </div>
);

export default PipelineCard; 