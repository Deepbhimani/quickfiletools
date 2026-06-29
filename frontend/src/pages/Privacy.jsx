import { Helmet } from "react-helmet-async";

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — QuickFileTools</title>
        <meta name="description" content="Read the QuickFileTools privacy policy. Learn how we handle your files, data, and cookies." />
        <link rel="canonical" href="https://www.quickfiletools.xyz/privacy" />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 py-16 prose dark:prose-invert prose-sm max-w-none">
        <h1>Privacy Policy</h1>
        <p className="text-gray-500">Last updated: June 2025</p>

        <h2>1. Information We Collect</h2>
        <p>We do not require account registration to use QuickFileTools. We collect standard server logs (IP address, browser type, pages visited) and usage data (which tools are used, approximate file sizes processed). We do not collect your name, email address, or any personal information unless you contact us directly.</p>

        <h2>2. File Handling</h2>
        <p>Files you upload are processed on our servers and stored temporarily. <strong>All uploaded files are automatically deleted within 1 hour</strong> of processing. We do not read, analyse, share, or sell your file contents. Files are never used for training, profiling, or any purpose other than completing the tool operation you requested.</p>

        <h2>3. Cookies</h2>
        <p>We use essential cookies required for the site to function correctly. We also use optional analytics cookies (Google Analytics) to understand how the site is used in aggregate — this data is anonymised and does not identify individual users. You may opt out of analytics cookies via your browser settings or a browser extension such as uBlock Origin.</p>

        <h2>4. Advertising</h2>
        <p>QuickFileTools is free to use and is supported by advertising served by Google AdSense. Google may use cookies to serve ads based on your prior visits to this and other websites. You can opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer">Google's Ad Settings</a>. We do not share personal information with advertisers directly.</p>

        <h2>5. Third-Party Services</h2>
        <p>We use the following third-party services to operate the site:</p>
        <ul>
          <li><strong>Cloudinary</strong> — temporary file storage during processing</li>
          <li><strong>Google Analytics</strong> — anonymised usage analytics</li>
          <li><strong>Google AdSense</strong> — advertising</li>
          <li><strong>MongoDB Atlas</strong> — database infrastructure</li>
        </ul>
        <p>Each service operates under its own privacy policy. We encourage you to review these if you have concerns.</p>

        <h2>6. Data Retention</h2>
        <p>We do not retain personal data. Uploaded files are deleted within 1 hour. Server logs are retained for a maximum of 30 days for security and diagnostic purposes, after which they are deleted automatically.</p>

        <h2>7. Children's Privacy</h2>
        <p>QuickFileTools is not directed at children under the age of 13. We do not knowingly collect any information from children. If you believe a child has submitted information through our site, please contact us and we will delete it promptly.</p>

        <h2>8. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. The date at the top of this page reflects when it was last revised. Continued use of the site after changes constitutes acceptance of the updated policy.</p>

        <h2>9. Contact</h2>
        <p>For privacy concerns or data deletion requests, email us at: <a href="mailto:privacy@quickfiletools.xyz">privacy@quickfiletools.xyz</a></p>
      </div>
    </>
  );
}