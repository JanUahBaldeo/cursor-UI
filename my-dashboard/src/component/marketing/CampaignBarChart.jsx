import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

const CampaignBarChart = () => {
  const [activePoint, setActivePoint] = useState(null);

  const lineData = [
    { name: 'Jan', value: 30 },
    { name: 'Feb', value: 45 },
    { name: 'Mar', value: 60 },
    { name: 'Apr', value: 75 },
    { name: 'May', value: 90 },
    { name: 'Jun', value: 110 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setActivePoint(null), 3000);
    return () => clearTimeout(timer);
  }, [activePoint]);

  const axisColor = '#64748b';
  const tooltipBg = '#ffffff';
  const tooltipText = '#0f172a';

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white tracking-tight flex items-center gap-2">
          📊 Top Performing Campaigns
        </h2>
        <div className="flex flex-wrap gap-3">
          <button className="text-xs sm:text-sm text-white bg-gradient-to-r from-teal-500 to-teal-700 px-5 py-2 rounded-full shadow hover:scale-105 transition-all">
            Filter ⚙️
          </button>
        </div>
      </div>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            onMouseMove={(e) => setActivePoint(e?.activePayload?.[0]?.payload?.name)}>
            <XAxis dataKey="name" stroke={axisColor} />
            <YAxis stroke={axisColor} />
            <Tooltip contentStyle={{ background: tooltipBg, color: tooltipText, borderRadius: '8px' }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={({ cx, cy }) => (
                <circle
                  key={`${cx}-${cy}`}
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill="white"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                />
              )}
              activeDot={{ r: 8 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {activePoint && (
        <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-2">
          Hovering: {activePoint}
        </div>
      )}
    </div>
  );
};

export default CampaignBarChart; 