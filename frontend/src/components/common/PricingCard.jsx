import { CheckCircle } from "lucide-react";

export default function PricingCard({ plan, onUpgrade, loading, isCurrent }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl border p-8 text-left relative ${plan.highlight ? "border-primary-400 dark:border-primary-600 shadow-lg" : "border-gray-100 dark:border-gray-800"}`}>
      {plan.badge && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">{plan.badge}</span>}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{plan.name}</h3>
      <div className="flex items-end gap-1 mb-6">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{plan.price}</span>
        {plan.period && <span className="text-gray-400 text-sm mb-1">/{plan.period}</span>}
      </div>
      <ul className="space-y-3 mb-8">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <CheckCircle className="h-4 w-4 text-green-500 shrink-0" /> {f}
          </li>
        ))}
      </ul>
      <button onClick={() => onUpgrade?.(plan.id)} disabled={isCurrent || loading}
        className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors ${plan.highlight ? "bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-60" : "border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-60"}`}>
        {isCurrent ? "Current Plan" : plan.cta}
      </button>
    </div>
  );
}
