import MetricCard from '../../shared/MetricCard';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';

const metrics = [
  {
    title: 'Email Open Rate',
    value: '58%',
    trend: '+18%',
    delta: '+3.8k this week',
    bg: 'mint',
    data: [{ value: 35 }, { value: 48 }, { value: 44 }, { value: 58 }, { value: 60 }, { value: 65 }, { value: 58 }],
  },
  {
    title: 'Click-Through Rate',
    value: '24%',
    trend: '+12%',
    delta: '+1.2k this week',
    bg: 'lemon',
    data: [{ value: 18 }, { value: 20 }, { value: 22 }, { value: 26 }, { value: 28 }, { value: 24 }, { value: 27 }],
  },
  {
    title: 'Contact Growth Tracker',
    value: '1.5k',
    trend: '+9%',
    delta: '+140 this week',
    bg: 'sky',
    data: [{ value: 900 }, { value: 1000 }, { value: 1200 }, { value: 1300 }, { value: 1350 }, { value: 1400 }, { value: 1500 }],
  },
  {
    title: 'Lead Sources',
    value: '4',
    trend: '+1',
    delta: 'New: Social',
    bg: 'rose',
    data: [{ value: 1 }, { value: 2 }, { value: 2 }, { value: 3 }, { value: 4 }],
  },
];

const topCampaigns = [
  { name: 'Spring Promo', opens: 120 },
  { name: 'Refi Blast', opens: 95 },
  { name: 'First-Time Buyer', opens: 80 },
  { name: 'Agent Outreach', opens: 60 },
];

const leadsTable = [
  { name: 'John Doe', campaign: 'Spring Promo', opens: 22 },
  { name: 'Jane Smith', campaign: 'Refi Blast', opens: 19 },
  { name: 'Sam Patel', campaign: 'First-Time Buyer', opens: 17 },
  { name: 'Alex Lee', campaign: 'Agent Outreach', opens: 15 },
  { name: 'Chris Green', campaign: 'Spring Promo', opens: 14 },
];

const campaignOptions = ['All', ...topCampaigns.map(c => c.name)];

import { useState } from 'react';

const MarketingSection = () => {
  const { role } = useUser();
  const [campaignFilter, setCampaignFilter] = useState('All');
  const [showHighOpen, setShowHighOpen] = useState(false);

  if (role !== 'Loan Officer' && role !== 'Production Partner') return null;

  // Filtered leads for table
  let filteredLeads = leadsTable;
  if (campaignFilter !== 'All') {
    filteredLeads = filteredLeads.filter(l => l.campaign === campaignFilter);
  }
  if (showHighOpen) {
    filteredLeads = filteredLeads.filter(l => l.opens >= 18);
  }

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-1">
      <div className="max-w-7xl mx-auto overflow-hidden rounded-2xl relative">
        {/* Animated Gradient Background (Teal-themed) */}
        <div
          className="absolute inset-0 z-0 animate-gradient-x bg-[length:300%_300%]
          bg-gradient-to-r from-[#007B84] via-[#01818E] to-[#00A7B5]"
        />
        {/* Foreground Content */}
        <div className="relative z-10 px-6 sm:px-8 py-10 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Metric Cards */}
            <div className="col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {metrics.map((m, i) => (
                <MetricCard key={i} {...m} />
              ))}
            </div>
            {/* Purpose Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              whileHover={{ scale: 1.02 }}
              className="col-span-1 relative text-center bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-md border border-white/20 transition-all"
            >
              {/* Icon Glow */}
              <div className="mb-4 mx-auto w-12 h-12 rounded-full flex items-center justify-center 
                bg-white/20 text-white shadow-inner ring-2 ring-white/30">
                🎯
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                Marketing Purpose
              </h3>
              <p className="mb-4 text-white/90 text-sm sm:text-base leading-relaxed">
                The goal is to build a <strong className="text-white">WORKDESK</strong> — a clean, intentional space where tasks and campaigns feel like progress, not clutter.
              </p>
              <p className="text-white/70 text-sm leading-relaxed">
                Every metric should be <span className="font-semibold text-white">actionable</span>.
                This is your command center — not a report. Use the numbers to guide your next move with clarity and confidence.
              </p>
            </motion.div>
          </div>
          {/* Actionable Filters */}
          <div className="flex flex-wrap gap-4 mt-10 mb-6 items-center">
            <label className="flex items-center gap-2 text-white/90">
              <input
                type="checkbox"
                checked={showHighOpen}
                onChange={e => setShowHighOpen(e.target.checked)}
                className="accent-cyan-500"
              />
              Show contacts with high open count
            </label>
            <select
              value={campaignFilter}
              onChange={e => setCampaignFilter(e.target.value)}
              className="px-3 py-1.5 rounded-full border border-white/30 bg-white/20 text-white text-sm"
            >
              {campaignOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>
          {/* Bar Chart: Top Campaigns */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-md border border-white/20 mb-8">
            <h4 className="text-lg font-semibold mb-4">Top Campaigns (Opens)</h4>
            <div className="w-full h-48 flex items-end gap-6">
              {topCampaigns.map((c, i) => (
                <div key={c.name} className="flex flex-col items-center flex-1">
                  <div
                    className="w-8 sm:w-12 rounded-t-lg bg-cyan-400 shadow-lg"
                    style={{ height: `${c.opens * 1.5}px` }}
                  />
                  <span className="mt-2 text-xs sm:text-sm font-medium text-white/90">{c.name}</span>
                  <span className="text-xs text-cyan-100">{c.opens} opens</span>
                </div>
              ))}
            </div>
          </div>
          {/* Table: Ranked leads by open activity */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-md border border-white/20">
            <h4 className="text-lg font-semibold mb-4">Leads by Open Activity</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-white/90">
                <thead>
                  <tr>
                    <th className="py-2 px-4">Lead</th>
                    <th className="py-2 px-4">Campaign</th>
                    <th className="py-2 px-4">Opens</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, i) => (
                    <tr key={i} className="border-b border-white/10">
                      <td className="py-2 px-4 font-semibold">{lead.name}</td>
                      <td className="py-2 px-4">{lead.campaign}</td>
                      <td className="py-2 px-4">{lead.opens}</td>
                    </tr>
                  ))}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-white/60">No leads found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingSection;
