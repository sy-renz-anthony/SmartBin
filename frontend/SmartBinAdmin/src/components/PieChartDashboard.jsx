import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import CustomToolTip from './CustomToolTip';

import assets from '../assets/assets'; 

const PieChartDashboard = ({data}) => {
    const COLORS = ['#60A5FA', '#34D399', '#FBBF24'];

    return (
    <div className="w-full max-w-lg mx-auto my-5">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-500">Garbage Types Distribution for the last 7 days</h2>
      {data === null || data === undefined || data.length <1?
        <div className="grid grid-cols-1 justify-items-center mt-7">
          <img src={assets.cautionPic} className="w-40 h-40" />
          <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">
            No SmartBin record of usage found from the last 7 days!
          </h2>
        </div>
      :<ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={90}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomToolTip />} />
          <Legend 
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={(value, entry) => `${data[value]._id}: ${entry.payload.value}`}
          />
        </PieChart>
      </ResponsiveContainer>}
    </div>
  );
}

export default PieChartDashboard
