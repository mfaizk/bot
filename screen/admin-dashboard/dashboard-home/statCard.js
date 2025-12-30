import { Video as LucideIcon } from "lucide-react";



export default function StatCard({ title, value, subtitle, icon: Icon, currency }) {
  return (
    <div className="bg-[#12121a] border border-gray-800/50 rounded-2xl p-6  overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-normal">{title}</h3>
        <div className="bg-gray-800/30 p-2 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-semibold text-white">{value}</span>
          {currency && <span className="text-gray-400 text-lg">{currency}</span>}
        </div>
        {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
      </div>
    </div>
  );
}
