import { Helmet } from "react-helmet-async";

export default function Privacy() {
  return (
    <>
      <Helmet><title>Privacy Policy — QuickFileTools</title></Helmet>
      <div className="max-w-3xl mx-auto px-4 py-16 prose dark:prose-invert prose-sm max-w-none">
        <h1>Privacy Policy</h1>
        <p className="text-gray-500">Last updated: June 2025</p>

        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly (name, email on signup), usage data (which tools you use, file sizes processed), and standard server logs (IP address, browser type).</p>

        <h2>2. File Handling</h2>
        <p>Files you upload are processed on our servers and stored temporarily on Cloudinary. <strong>All uploaded files are automatically deleted within 1 hour</strong> of processing. We do not read, analyse, or share your file contents.</p>

        <h2>3. Cookies</h2>
        <p>We use essential cookies for authentication and optional analytics cookies (Google Analytics) to understand site usage. You may opt out of analytics cookies via your browser settings.</p>

        <h2>4. Third-Party Services</h2>
        <p>We use Firebase (authentication), Cloudinary (file storage), Razorpay (payments), and Google Analytics. Each service has its own privacy policy.</p>

        <h2>5. Advertising</h2>
        <p>Free-plan users see ads served by Google AdSense. We do not share personal information with advertisers. Premium users see no ads.</p>

        <h2>6. Data Retention</h2>
        <p>Account data is retained while your account is active. You may request deletion at any time by emailing support@quickfiletools.com.</p>

        <h2>7. Contact</h2>
        <p>For privacy concerns: <a href="mailto:privacy@quickfiletools.com">privacy@quickfiletools.com</a></p>
      </div>
    </>
  );
}
