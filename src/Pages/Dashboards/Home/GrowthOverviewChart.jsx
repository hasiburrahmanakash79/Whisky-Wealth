import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", teal: 90, olive: 35 },
  { month: "Feb", teal: 30, olive: 70 },
  { month: "Mar", teal: 35, olive: 20 },
  { month: "Apr", teal: 80, olive: 100 },
  { month: "May", teal: 65, olive: 70 },
  { month: "Jun", teal: 95, olive: 92 },
];

const GrowthOverviewChart = () => {
  return (
    <div className="border border-gray-300 p-5 rounded-xl">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Growth Overview</h2>
      <ResponsiveContainer width="100%" height={315}>
        <BarChart data={data} barGap={8}>
          <CartesianGrid vertical={true} strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Bar dataKey="teal" fill="#84D9D2" radius={[4, 4, 0, 0]} />
          <Bar dataKey="olive" fill="#A69D52" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrowthOverviewChart;
