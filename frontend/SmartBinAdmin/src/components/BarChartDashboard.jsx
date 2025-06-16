import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#DD0000', '#34D399' ];

const BarChartDashboard = ({data}) => {
    return (
        <div className="w-full max-w-2xl mx-auto mt-20">

        <ResponsiveContainer width="80%" height={230}>
            <BarChart data={data}>
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value">
                {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Bar>
            </BarChart>
        </ResponsiveContainer>
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-500">Status Count of Devices</h2>
        </div>
    );
}

export default BarChartDashboard
