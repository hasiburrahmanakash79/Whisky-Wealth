import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Inactive Users", value: 58 },
  { name: "Active Users", value: 180 },
];

const COLORS = ["#E15750", "#A69D52"];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy }) => {
  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="middle"
      className="text-sm font-semibold fill-gray-800"
    >
      {/* Center label (optional) */}
    </text>
  );
};

const UserActivityChart = () => {
  return (
    <div className="border border-gray-300 p-5 rounded-xl">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">User Activity</h2>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            labelLine={false}
            label={renderCustomizedLabel}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#E15750" }}></span>
          <span className="text-gray-600">Inactive Users: {data[0].value}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#A69D52" }}></span>
          <span className="text-gray-600">Active Users: {data[1].value}</span>
        </div>
      </div>
    </div>
  );
};

export default UserActivityChart;
