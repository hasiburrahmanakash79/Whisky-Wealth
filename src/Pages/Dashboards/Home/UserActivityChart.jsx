import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = [
  "#E15750",
  "#A69D52",
  "#84D9D2",
  "#C35E40",
  "#909451",
  "#22C55E",
];

const UserActivityChart = ({ data }) => {
  const chartData = data.recentActivity.map((activity) => ({
    name: activity._id,
    value: activity.count,
  }));

  return (
    <div className="border border-gray-300 p-5 rounded-xl">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Recent Activity
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            labelLine={false}
            dataKey="value">
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm">
        {chartData.map((entry, index) => (
          <div key={entry.name} className="flex items-center space-x-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
            <span className="text-gray-600">
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserActivityChart;
