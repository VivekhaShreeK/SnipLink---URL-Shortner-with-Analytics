import { Monitor, Smartphone, Tablet, Globe, Clock } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const deviceIcon = (type) => {
  switch (type) {
    case 'mobile':
      return <Smartphone className="w-3.5 h-3.5" />;
    case 'tablet':
      return <Tablet className="w-3.5 h-3.5" />;
    case 'desktop':
      return <Monitor className="w-3.5 h-3.5" />;
    default:
      return <Globe className="w-3.5 h-3.5" />;
  }
};

const VisitLog = ({ visits = [] }) => {
  if (visits.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-surface-400">
        No visits recorded yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-200 dark:border-surface-700">
            <th className="text-left py-2.5 px-3 text-xs font-medium text-surface-500 uppercase tracking-wider">
              Time
            </th>
            <th className="text-left py-2.5 px-3 text-xs font-medium text-surface-500 uppercase tracking-wider">
              Browser
            </th>
            <th className="text-left py-2.5 px-3 text-xs font-medium text-surface-500 uppercase tracking-wider">
              Device
            </th>
            <th className="text-left py-2.5 px-3 text-xs font-medium text-surface-500 uppercase tracking-wider">
              Location
            </th>
            <th className="text-left py-2.5 px-3 text-xs font-medium text-surface-500 uppercase tracking-wider">
              Referrer
            </th>
          </tr>
        </thead>
        <tbody>
          {visits.map((visit, i) => (
            <tr
              key={visit._id || i}
              className="border-b border-surface-100 dark:border-surface-800 last:border-0 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors"
            >
              <td className="py-2.5 px-3 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-surface-600 dark:text-surface-400">
                  <Clock className="w-3.5 h-3.5 text-surface-400" />
                  {formatDate(visit.timestamp, true)}
                </div>
              </td>
              <td className="py-2.5 px-3 text-surface-700 dark:text-surface-300">
                {visit.browser}
                <span className="text-surface-400 ml-1 text-xs">/ {visit.os}</span>
              </td>
              <td className="py-2.5 px-3">
                <div className="flex items-center gap-1.5 text-surface-600 dark:text-surface-400 capitalize">
                  {deviceIcon(visit.device)}
                  {visit.device}
                </div>
              </td>
              <td className="py-2.5 px-3 text-surface-700 dark:text-surface-300">
                {visit.city !== 'Unknown' ? `${visit.city}, ` : ''}{visit.country}
              </td>
              <td className="py-2.5 px-3 text-surface-500 truncate max-w-[150px]">
                {visit.referrer}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisitLog;
