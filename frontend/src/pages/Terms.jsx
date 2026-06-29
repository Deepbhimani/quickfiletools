import { Helmet } from "react-helmet-async";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions — QuickFileTools</title>
        <meta name="description" content="Read the QuickFileTools terms and conditions. Understand your rights and responsibilities when using our free file tools." />
        <link rel="canonical" href="https://www.quickfiletools.xyz/terms" />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 py-16 prose dark:prose-invert prose-sm max-w-none">
        <h1>Terms & Conditions</h1>
        <p className="text-gray-500">Last updated: June 2025</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using QuickFileTools at www.quickfiletools.xyz, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please discontinue use of the site immediately.</p>

        <h2>2. Description of Service</h2>
        <p>QuickFileTools provides free browser-based file processing tools including image compression, format conversion, PDF merging, PDF splitting, and related utilities. All tools are provided free of charge with no account registration required.</p>

        <h2>3. Acceptable Use</h2>
        <p>You may use QuickFileTools for lawful purposes only. You must not:</p>
        <ul>
          <li>Upload files containing malware, viruses, or malicious code</li>
          <li>Upload content that is illegal, defamatory, or infringes third-party intellectual property rights</li>
          <li>Attempt to reverse-engineer, overload, or disrupt the service</li>
          <li>Use automated scripts or bots to make bulk requests without prior written permission</li>
          <li>Upload files you do not have the right to process or distribute</li>
        </ul>

        <h2>4. File Uploads and Data</h2>
        <p>You retain full ownership and all rights to any files you upload to QuickFileTools. We claim no ownership over your content. Uploaded files are processed solely to complete the operation you requested and are automatically deleted from our servers within 1 hour. We do not use your files for any other purpose.</p>

        <h2>5. No Registration Required</h2>
        <p>QuickFileTools does not require you to create an account. All tools are accessible directly without providing personal information. File processing limits may apply to prevent abuse and ensure service availability for all users.</p>

        <h2>6. Advertising</h2>
        <p>QuickFileTools is free to use and is supported by advertising. By using the site, you acknowledge that advertisements may be displayed. Ads are served by Google AdSense and are subject to Google's own terms and privacy policies.</p>

        <h2>7. Intellectual Property</h2>
        <p>The QuickFileTools name, logo, website design, and underlying software are the intellectual property of QuickFileTools. You may not copy, reproduce, or distribute any part of the site without prior written permission. User-uploaded file content remains the property of the uploader at all times.</p>

        <h2>8. Disclaimer of Warranties</h2>
        <p>QuickFileTools is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, error-free, or produce results that meet your specific requirements. You use the service at your own risk.</p>

        <h2>9. Limitation of Liability</h2>
        <p>To the fullest extent permitted by law, QuickFileTools and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to data loss, loss of profits, or service interruption, arising from your use of or inability to use the service.</p>

        <h2>10. Third-Party Services</h2>
        <p>QuickFileTools uses third-party services including Cloudinary, Google Analytics, Google AdSense, and MongoDB Atlas. Use of these services is subject to their respective terms and privacy policies. We are not responsible for the practices of third-party providers.</p>

        <h2>11. Changes to Terms</h2>
        <p>We reserve the right to update these Terms and Conditions at any time. The date at the top of this page reflects the most recent revision. Continued use of the site after any changes constitutes your acceptance of the updated terms.</p>

        <h2>12. Governing Law</h2>
        <p>These terms are governed by applicable law. Any disputes arising from use of QuickFileTools shall be resolved in accordance with the laws of the jurisdiction in which the service operates.</p>

        <h2>13. Contact</h2>
        <p>For legal enquiries, please contact us at: <a href="mailto:legal@quickfiletools.xyz">legal@quickfiletools.xyz</a></p>
      </div>
    </>
  );
}