import Title from "./title";
import { ResponsiveContainer, PieChart, Tooltip, Legend, Pie, Cell } from "recharts";


const DoughnutChart = ({ dt }) => {
    const data = [
        { name: "Income", value: Number(dt.income) },
        { name: "Expense", value: Number(dt.expense) },
    ];

    return (
        <div className="flex-1 w-full">
            <Title title=" Summary" />
            <ResponsiveContainer width="100%" height={300}>
                <PieChart width={400} height={400}>
                    <Tooltip />
                    <Pie
                        data={data}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                    />
                    <Legend />
                    <Cell name="Income" fill="#8884d8" />
                    <Cell name="Expense" fill="#82ca9d" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DoughnutChart;