import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { CheckCircle, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { paymentsAPI } from "../services/api";
import toast from "react-hot-toast";

const PLANS = [
  {
    id: "free", name: "Free", price: { monthly: 0, yearly: 0 }, badge: null,
    features: ["10 conversions / day", "5 MB max file size", "All basic tools", "Ads supported"],
    cta: "Current Plan", disabled: true,
  },
  {
    id: "pro_monthly", name: "Pro", price: { monthly: 299, yearly: 2499 }, badge: "Most Popular",
    features: ["Unlimited conversions", "50 MB max file size", "All tools including premium", "No ads", "Priority processing", "Email support"],
    cta: "Upgrade to Pro", disabled: false,
  },
];

export default function Pricing() {
  const { user, isPremium } = useAuth();
  const [yearly, setYearly]   = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleUpgrade(planId) {
    if (!user) return (window.location.href = "/signup");
    setLoading(true);
    try {
      const pid = yearly ? "pro_yearly" : "pro_monthly";
      const { data } = await paymentsAPI.createOrder(pid);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "QuickFileTools",
        description: data.plan.name,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await paymentsAPI.verifyPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            toast.success("Payment successful! You're now Pro 🎉");
            window.location.href = "/dashboard";
          } catch { toast.error("Payment verification failed"); }
        },
        theme: { color: "#2563eb" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  }

  return (
    <>
      <Helmet><title>Pricing — QuickFileTools</title></Helmet>
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Simple Pricing</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Start free. Upgrade when you need more.</p>

        <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-10">
          <button onClick={() => setYearly(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!yearly ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500"}`}>
            Monthly
          </button>
          <button onClick={() => setYearly(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${yearly ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500"}`}>
            Yearly <span className="ml-1 text-xs text-green-600 font-semibold">Save 30%</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {PLANS.map((plan) => (
            <div key={plan.id}
              className={`bg-white dark:bg-gray-900 rounded-2xl border p-8 text-left relative ${plan.badge ? "border-primary-400 dark:border-primary-600 shadow-lg" : "border-gray-100 dark:border-gray-800"}`}>
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">{plan.badge}</span>
              )}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{plan.name}</h2>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ₹{yearly ? plan.price.yearly : plan.price.monthly}
                </span>
                {plan.price.monthly > 0 && <span className="text-gray-400 text-sm mb-1">/{yearly ? "yr" : "mo"}</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => !plan.disabled && handleUpgrade(plan.id)}
                disabled={plan.disabled || isPremium || loading}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors ${plan.badge ? "bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-60" : "border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-60"}`}>
                {isPremium && plan.id !== "free" ? "Current Plan" : plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
