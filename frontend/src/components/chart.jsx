import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Title from "./title";

export const Chart = ({ data }) => {
    return (
        <div className="flex-1 w-full">
            <Title title="Transition Activity"/>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#4ade80" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="expense" stroke="#f87171" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
    
}

export default Chart;