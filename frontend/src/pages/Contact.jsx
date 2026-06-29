import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Mail, MessageSquare, Clock, HelpCircle, Wrench } from "lucide-react";
import toast from "react-hot-toast";

export default function Contact() {
  const [form, setForm]       = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      toast.success("Message sent! We'll reply within 24 hours.");
      setForm({ name: "", email: "", message: "" });
    } catch { toast.error("Failed to send. Please email us directly."); }
    finally { setLoading(false); }
  }

  return (
    <>
      <Helmet>
        <title>Contact Us — QuickFileTools</title>
        <meta name="description" content="Get in touch with the QuickFileTools team. We respond to all queries within 24 hours." />
        <link rel="canonical" href="https://www.quickfiletools.xyz/contact" />
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <MessageSquare className="h-10 w-10 text-primary-500 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Contact Us</h1>
          <p className="text-gray-500 dark:text-gray-400">Have a question, feedback, or a tool suggestion? We'd love to hear from you.</p>
        </div>

        {/* ── Contact reasons ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: <HelpCircle className="h-5 w-5 text-primary-500" />, title: "General questions", desc: "How a tool works, supported formats, file size limits." },
            { icon: <Wrench className="h-5 w-5 text-amber-500" />,       title: "Report an issue",   desc: "A tool isn't working correctly or produced an unexpected result." },
            { icon: <Clock className="h-5 w-5 text-green-500" />,        title: "Tool suggestions",  desc: "Tell us which file tool you'd like us to add next." },
          ].map((r) => (
            <div key={r.title} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
              <div className="mb-2">{r.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{r.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{r.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your question, issue, or suggestion in as much detail as you like..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors">
              {loading ? "Sending…" : "Send Message"}
            </button>
          </form>

          <div className="flex items-center gap-2 justify-center mt-6 text-sm text-gray-400">
            <Mail className="h-4 w-4" />
            <span>Or email us directly: <a href="mailto:support@quickfiletools.xyz" className="text-primary-600 hover:underline">support@quickfiletools.xyz</a></span>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">We typically respond within 24 hours on business days.</p>
        </div>
      </div>
    </>
  );
}