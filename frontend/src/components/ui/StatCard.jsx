/**
 * StatCard — Reusable metric display card used across panels
 * Usage: <StatCard label="Total Spent" value="₹12,500" icon={<MdMoney />} color="purple" />
 */
export default function StatCard({ label, value, suffix, icon, color = 'purple' }) {
  const colorMap = {
    purple: { bg: 'from-white to-purple-50', border: 'border-purple-100', iconBg: 'bg-purple-500/10', iconColor: 'text-purple-600' },
    green:  { bg: 'from-white to-green-50',  border: 'border-green-100',  iconBg: 'bg-green-500/10',  iconColor: 'text-green-600' },
    blue:   { bg: 'from-white to-blue-50',   border: 'border-blue-100',   iconBg: 'bg-blue-500/10',   iconColor: 'text-blue-600' },
    orange: { bg: 'from-white to-orange-50', border: 'border-orange-100', iconBg: 'bg-orange-500/10', iconColor: 'text-orange-600' },
    red:    { bg: 'from-white to-red-50',    border: 'border-red-100',    iconBg: 'bg-red-500/10',    iconColor: 'text-red-600' },
    amber:  { bg: 'from-white to-amber-50',  border: 'border-amber-100',  iconBg: 'bg-amber-500/10',  iconColor: 'text-amber-600' },
  };
  
  const c = colorMap[color] || colorMap.purple;

  return (
    <div className={`bg-gradient-to-br ${c.bg} p-5 rounded-2xl border ${c.border} shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300`}>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        <h3 className="text-2xl font-black text-gray-800">
          {value}
          {suffix && <span className="text-sm font-light ml-1">{suffix}</span>}
        </h3>
      </div>
      <div className={`p-3 ${c.iconBg} rounded-xl ${c.iconColor} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
  );
}
