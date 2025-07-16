import { useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";

const WeeklyActivity = () => {
  const [selectedRange, setSelectedRange] = useState("Daily");

  const dailyData = [
    { date: "Mon", score: 3 },
    { date: "Tue", score: 5 },
    { date: "Wed", score: 2 },
    { date: "Thu", score: 6 },
    { date: "Fri", score: 4 },
    { date: "Sat", score: 7 },
    { date: "Sun", score: 3 },
  ];

  const weeklyData = [
    { date: "Week 1", score: 5 },
    { date: "Week 2", score: 8 },
    { date: "Week 3", score: 6 },
    { date: "Week 4", score: 9 },
    { date: "Week 5", score: 4 },
    { date: "Week 6", score: 7 },
  ];

  const monthlyData = [
    { date: "Jan", score: 4 },
    { date: "Feb", score: 7 },
    { date: "Mar", score: 3 },
    { date: "Apr", score: 6 },
    { date: "May", score: 5 },
    { date: "Jun", score: 8 },
    { date: "Jul", score: 4 },
    { date: "Aug", score: 9 },
    { date: "Sep", score: 2 },
    { date: "Oct", score: 6 },
    { date: "Nov", score: 3 },
    { date: "Dec", score: 7 },
  ];

  const getChartData = () => {
    if (selectedRange === "Daily") return dailyData;
    if (selectedRange === "Weekly") return weeklyData;
    return monthlyData;
  };

  const chartData = getChartData();
  const xLabels = chartData.map((item) => item.date);
  const scores = chartData.map((item) => item.score);

return (
    <div className="border border-gray-300 p-5 rounded-xl">
        <div className="pb-3 flex items-center justify-between">
            <h4 className="font-semibold text-lg">Token Selling Activity</h4>
            <select
                className="text-sm px-2 py-1 rounded-md outline-none text-gray-500"
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value)}
            >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
            </select>
        </div>

        <LineChart
            height={300}
            xAxis={[
                {
                    scaleType: "point",
                    data: xLabels,
                    tickLabelStyle: {
                        fontSize: 12,
                        fill: "#999",
                    },
                },
            ]}
            yAxis={[
                {
                    tickMinStep: 1,
                    tickLabelStyle: {
                        fontSize: 12,
                        fill: "#999",
                    },
                },
            ]}
            grid={{ horizontal: true, vertical: false }}
            series={[
                {
                    data: scores,
                    color: "#3B82F6",
                    curve: "monotone",
                },
            ]}
            margin={{ top: 20, right: 20, bottom: 10, left: 0 }}
            sx={{
                ".MuiLineElement-root": {
                    strokeWidth: 1,
                    
                },
                ".MuiMarkElement-root": {
                    display: "none",
                },
                ".MuiChartsAxis-root .MuiChartsAxis-line": {
                    stroke: "#E6E6E666",
                },
                ".MuiChartsGrid-root .MuiChartsGrid-line": {
                    stroke: "#E6E6E666",
                },
            }}
        />
    </div>
);
};

export default WeeklyActivity;
