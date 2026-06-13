import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Rinjani Transport collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: June 2026</p>

      <div className="prose mt-8 max-w-none text-gray-600">
        <h2 className="text-xl font-bold text-gray-900">1. Information We Collect</h2>
        <p className="mt-2 text-sm leading-relaxed">
          We collect personal information you provide when making a booking, including your name, email address,
          phone number, nationality, and travel details. We also collect usage data through cookies and analytics.
        </p>

        <h2 className="mt-6 text-xl font-bold text-gray-900">2. How We Use Your Information</h2>
        <p className="mt-2 text-sm leading-relaxed">
          Your information is used to process bookings, send e-tickets and confirmations, communicate with operators,
          provide customer support, and improve our services. We do not sell your personal data to third parties.
        </p>

        <h2 className="mt-6 text-xl font-bold text-gray-900">3. Data Sharing</h2>
        <p className="mt-2 text-sm leading-relaxed">
          We share necessary booking information with transport operators to fulfill your transfer.
          Payment data is processed by our secure payment providers (PayPal, Stripe, Midtrans) and
          is not stored on our servers.
        </p>

        <h2 className="mt-6 text-xl font-bold text-gray-900">4. Data Security</h2>
        <p className="mt-2 text-sm leading-relaxed">
          We implement industry-standard security measures including SSL encryption, secure payment processing,
          and restricted access to personal data. Regular security audits are conducted.
        </p>

        <h2 className="mt-6 text-xl font-bold text-gray-900">5. Your Rights</h2>
        <p className="mt-2 text-sm leading-relaxed">
          You have the right to access, correct, or delete your personal data. You may also request
          a copy of your data or withdraw consent for marketing communications at any time.
          Contact us at privacy@rinjanitransport.com.
        </p>
      </div>
    </div>
  );
}
