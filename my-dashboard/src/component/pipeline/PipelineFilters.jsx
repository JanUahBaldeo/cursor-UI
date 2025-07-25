import React from 'react';

const PipelineFilters = ({ filters, setFilters }) => (
  <div className="flex gap-4 mb-4">
    {/* Example filter controls */}
    <input
      type="text"
      placeholder="Search by borrower..."
      className="border rounded px-2 py-1"
      value={filters.search || ''}
      onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
    />
    {/* Add more filter controls as needed */}
  </div>
);

export default PipelineFilters; 