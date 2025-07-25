import React from 'react';

const PipelineMetrics = ({ metrics }) => (
  <div className="flex gap-6 mb-6">
    {metrics.map(m => (
      <div key={m.stage} className="bg-white rounded-xl shadow p-4 min-w-[120px] text-center">
        <div className="font-bold text-cyan-700 text-lg mb-1">{m.stage}</div>
        <div className="text-xs text-gray-500 mb-1">Total: <span className="font-semibold text-gray-700">{m.total}</span></div>
        <div className="text-xs text-gray-500 mb-1">Avg Time: <span className="font-semibold text-gray-700">{m.avgTime}d</span></div>
        <div className="text-xs text-gray-500">Conversion: {m.conversion}</div>
      </div>
    ))}
  </div>
);

export default PipelineMetrics; 