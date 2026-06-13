import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-surface-900 dark:text-white">
        {payload[0].name}
      </p>
      <p className="text-xs text-surface-500">
        {payload[0].value} visits ({((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%)
      </p>
    </div>
  );
};

const DeviceChart = ({ data = [], title = 'Device Breakdown' }) => {
  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-surface-400">
        No data available.
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.count, 0);
  const chartData = data.map((d) => ({
    name: d.device || d.browser || d.referrer || 'Unknown',
    value: d.count,
    total,
  }));

  return (
    <div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {chartData.map((item, i) => (
          <div key={item.name} className="flex items-center gap-1.5 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-surface-600 dark:text-surface-400 capitalize">
              {item.name}
            </span>
            <span className="text-surface-400">({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceChart;
