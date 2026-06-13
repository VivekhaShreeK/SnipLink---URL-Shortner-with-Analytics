import { MapPin } from 'lucide-react';

const LocationTable = ({ data = [] }) => {
  if (data.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-surface-400">
        No location data available.
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-200 dark:border-surface-700">
            <th className="text-left py-2.5 px-3 text-xs font-medium text-surface-500 uppercase tracking-wider">
              Location
            </th>
            <th className="text-right py-2.5 px-3 text-xs font-medium text-surface-500 uppercase tracking-wider">
              Visits
            </th>
            <th className="text-right py-2.5 px-3 text-xs font-medium text-surface-500 uppercase tracking-wider">
              %
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr
              key={i}
              className="border-b border-surface-100 dark:border-surface-800 last:border-0 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
            >
              <td className="py-2.5 px-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-surface-400" />
                  <span className="text-surface-700 dark:text-surface-300">
                    {item.city !== 'Unknown' ? `${item.city}, ` : ''}{item.country}
                  </span>
                </div>
              </td>
              <td className="py-2.5 px-3 text-right font-medium text-surface-900 dark:text-white">
                {item.count}
              </td>
              <td className="py-2.5 px-3 text-right text-surface-500">
                {((item.count / total) * 100).toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LocationTable;
