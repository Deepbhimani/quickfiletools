import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Mail, MessageSquare } from "lucide-react";
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
      <Helmet><title>Contact — QuickFileTools</title></Helmet>
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <MessageSquare className="h-10 w-10 text-primary-500 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Contact Us</h1>
          <p className="text-gray-500 dark:text-gray-400">Have a question or feedback? We'd love to hear from you.</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors">
              {loading ? "Sending…" : "Send Message"}
            </button>
          </form>

          <div className="flex items-center gap-2 justify-center mt-6 text-sm text-gray-400">
            <Mail className="h-4 w-4" />
            <span>Or email us: <a href="mailto:support@quickfiletools.com" className="text-primary-600 hover:underline">support@quickfiletools.com</a></span>
          </div>
        </div>
      </div>
    </>
  );
}
