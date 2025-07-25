import React from 'react';
import { useUser } from '../../context/UserContext';

const CTR_CAMPAIGNS = [
  { name: 'Spring Promo', ctr: 0.32 },
  { name: 'Refi Blast', ctr: 0.27 },
  { name: 'Agent Outreach', ctr: 0.21 },
];

const FUNNEL = [
  { stage: 'Clicks', value: 120 },
  { stage: 'Leads', value: 40 },
  { stage: 'Booked', value: 12 },
];

const CALL_ACTIVITY = [
  { type: 'Inbound', count: 18 },
  { type: 'Outbound', count: 27 },
  { type: 'Missed', count: 3 },
];

const RECOMMENDATIONS = [
  'Follow up with high-CTR campaigns for more conversions.',
  'Schedule a call blitz for new leads in the last 24h.',
  'A/B test subject lines for Agent Outreach.',
];

const AB_TESTS = [
  { name: 'Subject Line A vs B', status: 'Running', uplift: '+6%' },
  { name: 'CTA Button Color', status: 'Completed', uplift: '+3%' },
];

const PARTNER_MAP_PLACEHOLDER = 'Map would be here (UI only)';

const NEW_LEADS = 9;

const ProductionDashboard = () => {
  const { role } = useUser();
  if (role !== 'Production Partner') return null;

  return (
    <section className="max-w-5xl mx-auto my-10 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-6">
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-cyan-900">
        <span className="text-3xl">📊</span> Production Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* CTR by Campaign */}
        <div className="bg-cyan-50 rounded-xl p-6 shadow border border-cyan-100">
          <h3 className="font-semibold mb-4 text-cyan-800">CTR by Campaign</h3>
          <ul className="space-y-2">
            {CTR_CAMPAIGNS.map((c, i) => (
              <li key={i} className="flex justify-between items-center">
                <span>{c.name}</span>
                <span className="font-bold text-cyan-700">{(c.ctr * 100).toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Partner Map (UI placeholder) */}
        <div className="bg-cyan-50 rounded-xl p-6 shadow border border-cyan-100 flex flex-col items-center justify-center">
          <h3 className="font-semibold mb-4 text-cyan-800">Partner Map</h3>
          <div className="w-full h-32 flex items-center justify-center text-cyan-400 bg-cyan-100 rounded-lg">
            {PARTNER_MAP_PLACEHOLDER}
          </div>
        </div>
        {/* New Leads in last 24h */}
        <div className="bg-cyan-50 rounded-xl p-6 shadow border border-cyan-100 flex flex-col items-center justify-center">
          <h3 className="font-semibold mb-2 text-cyan-800">New Leads (last 24h)</h3>
          <span className="text-4xl font-bold text-cyan-700">{NEW_LEADS}</span>
        </div>
        {/* Funnel Chart (UI only) */}
        <div className="bg-cyan-50 rounded-xl p-6 shadow border border-cyan-100">
          <h3 className="font-semibold mb-4 text-cyan-800">Funnel: Clicks → Booked</h3>
          <div className="flex items-end gap-4 h-32">
            {FUNNEL.map((f, i) => (
              <div key={f.stage} className="flex flex-col items-center flex-1">
                <div className="w-8 rounded-t-lg bg-cyan-400 shadow-lg" style={{ height: `${f.value * 1.2}px` }} />
                <span className="mt-2 text-xs font-medium text-cyan-800">{f.stage}</span>
                <span className="text-xs text-cyan-500">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Call Activity Summary */}
        <div className="bg-cyan-50 rounded-xl p-6 shadow border border-cyan-100">
          <h3 className="font-semibold mb-4 text-cyan-800">Call Activity Summary</h3>
          <ul className="space-y-2">
            {CALL_ACTIVITY.map((c, i) => (
              <li key={i} className="flex justify-between items-center">
                <span>{c.type}</span>
                <span className="font-bold text-cyan-700">{c.count}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Actionable Recommendations */}
        <div className="bg-cyan-50 rounded-xl p-6 shadow border border-cyan-100">
          <h3 className="font-semibold mb-4 text-cyan-800">Actionable Recommendations</h3>
          <ul className="list-disc pl-6 text-cyan-700 text-sm space-y-1">
            {RECOMMENDATIONS.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
        {/* A/B Test Tracker */}
        <div className="bg-cyan-50 rounded-xl p-6 shadow border border-cyan-100">
          <h3 className="font-semibold mb-4 text-cyan-800">A/B Test Tracker</h3>
          <table className="min-w-full text-left text-cyan-800 text-sm">
            <thead>
              <tr>
                <th className="py-2 px-4">Test</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Uplift</th>
              </tr>
            </thead>
            <tbody>
              {AB_TESTS.map((test, i) => (
                <tr key={i} className="border-b border-cyan-100">
                  <td className="py-2 px-4 font-semibold">{test.name}</td>
                  <td className="py-2 px-4">{test.status}</td>
                  <td className="py-2 px-4">{test.uplift}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ProductionDashboard; 