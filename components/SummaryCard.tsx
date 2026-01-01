import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, colorClass }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 transition-all hover:shadow-lg group">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 md:mb-2 truncate" title={title}>{title}</p>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tighter truncate">{value}</h3>
        </div>
        <div className={`shrink-0 p-3 md:p-4 rounded-2xl ${colorClass} bg-opacity-10 text-opacity-100 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
