import { Helmet } from "react-helmet-async";

export default function Terms() {
  return (
    <>
      <Helmet><title>Terms & Conditions — QuickFileTools</title></Helmet>
      <div className="max-w-3xl mx-auto px-4 py-16 prose dark:prose-invert prose-sm max-w-none">
        <h1>Terms & Conditions</h1>
        <p className="text-gray-500">Last updated: June 2025</p>

        <h2>1. Acceptance</h2>
        <p>By using QuickFileTools you agree to these terms. If you disagree, please discontinue use.</p>

        <h2>2. Use of Service</h2>
        <p>You may use our tools for lawful purposes only. You must not upload malware, illegal content, or files that violate third-party rights.</p>

        <h2>3. Free Plan Limits</h2>
        <p>Free accounts are limited to 10 conversions per day and 5 MB per file. We reserve the right to adjust limits at any time.</p>

        <h2>4. Pro Subscriptions</h2>
        <p>Pro plans are billed monthly or annually. Subscriptions auto-renew unless cancelled before the renewal date. Refunds are offered within 7 days of purchase if fewer than 5 conversions have been made.</p>

        <h2>5. Intellectual Property</h2>
        <p>You retain all rights to files you upload. We claim no ownership over your content.</p>

        <h2>6. Limitation of Liability</h2>
        <p>QuickFileTools is provided "as is". We are not liable for data loss, indirect damages, or consequential losses arising from use of the service.</p>

        <h2>7. Changes</h2>
        <p>We may update these terms. Continued use after changes constitutes acceptance.</p>

        <h2>8. Contact</h2>
        <p><a href="mailto:legal@quickfiletools.com">legal@quickfiletools.com</a></p>
      </div>
    </>
  );
}
