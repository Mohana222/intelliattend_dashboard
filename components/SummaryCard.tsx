import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, colorClass }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 md:p-5 transition-all hover:shadow-lg group">
      <div className="flex items-center justify-between gap-2 md:gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 truncate" title={title}>{title}</p>
          <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight break-all">
            {value}
          </h3>
        </div>
        <div className={`shrink-0 p-2.5 md:p-3 rounded-2xl ${colorClass} bg-opacity-10 text-opacity-100 group-hover:scale-110 transition-transform flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;