import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

const pieData = [
  { name: 'Facebook ads', value: 158, color: '#f87171' },
  { name: 'Health and Careness', value: 222, color: '#a78bfa' },
  { name: 'Lorem ipsum', value: 291, color: '#60a5fa' },
  { name: 'Others', value: 330, color: '#facc15' },
];

const LeadsTable = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const totalLeads = pieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-6 tracking-tight flex items-center gap-2">
        📈 Lead Source Breakdown
      </h2>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="relative w-full max-w-[300px] h-[300px] mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {pieData.map((entry, index) => (
                  <linearGradient id={`grad-${index}`} key={`grad-${index}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={entry.color} />
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.6} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                onMouseEnter={(_, i) => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#grad-${index})`}
                    stroke="#fff"
                    strokeWidth={hoveredIndex === index ? 3 : 2}
                    style={{
                      transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                      filter: hoveredIndex === index ? 'drop-shadow(0 0 6px rgba(0,0,0,0.3))' : 'none',
                      transformOrigin: 'center',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Pie>
              {/* Center Labels */}
              <text
                x="50%"
                y="45%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xl font-bold fill-slate-800 dark:fill-slate-100"
              >
                {totalLeads}
              </text>
              <text
                x="50%"
                y="57%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm fill-slate-500 dark:fill-slate-400"
              >
                Total Leads
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
          {pieData.map((entry, index) => (
            <li key={`legend-${index}`} className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full inline-block shadow-sm"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${entry.color}, ${entry.color}99)`
                }}
              ></span>
              <span className="font-medium">{entry.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-right">
        Last updated: just now
      </div>
    </div>
  );
};

export default LeadsTable; 