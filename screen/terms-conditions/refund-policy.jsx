"use client"
import React from "react";

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-20 sm:pt-30 pb-10 md:pb-20 space-y-10">
      <section>
        <h1 className="text-4xl font-bold mb-4">💳 Refund &amp; Cancellation Policy — Qbots</h1>
        <p className="text-lg opacity-80">Last Updated: <strong>October 2025</strong></p>
        <p className="mt-4 opacity-90">
          At Qbots, we are committed to providing a transparent, fair, and user-focused experience.
          Before subscribing or funding your account, please review this Refund and Cancellation Policy carefully.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">1. Cancellation Policy</h2>

        <h3 className="font-medium mt-3">1.1 Subscription Services</h3>
        <p className="opacity-90">
          Users may cancel their subscription (Starter, Pro, or any other plan) at any time from their account settings.
          Cancellation will take effect at the end of the current billing cycle — meaning access remains active until the period expires.
          No prorated refunds are issued for partial months, unused features, or early cancellations.
        </p>

        <h3 className="font-medium mt-3">1.2 One-Week Free Trial</h3>
        <p className="opacity-90">
          Qbots may offer a free trial period to allow users to explore features before committing to a paid plan.
          Once the trial ends and a subscription is activated, the plan is considered confirmed and non-refundable.
        </p>

        <h3 className="font-medium mt-3">1.3 One-Time Purchases / Credits</h3>
        <p className="opacity-90">
          Any purchases of platform credits, API add-ons, or Fuel Wallet funding are final and cannot be canceled once processed.
          As these services are delivered instantly, cancellations are not permitted after confirmation.
        </p>

        <h3 className="font-medium mt-3">1.4 Promotional Offers</h3>
        <p className="opacity-90">
          Purchases made under promotional offers, discount codes, or limited-time campaigns are non-cancellable and non-refundable.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">2. Refund Policy</h2>

        <h3 className="font-medium mt-3">2.1 Digital &amp; Automated Services</h3>
        <p className="opacity-90">
          Due to the digital and algorithmic nature of Qbots’ services (e.g., automated trading bots, API integrations, or dashboard access), all sales are final.
          Once a subscription or Fuel Wallet payment has been processed, no refunds will be provided for any reason, except as specified below.
        </p>

        <h3 className="font-medium mt-3">2.2 Failed Transactions</h3>
        <p className="opacity-90">
          If a transaction fails and your payment is debited but services are not activated, the amount will be automatically refunded within 5–7 business days after verification.
          If you do not receive a refund within this period, please contact us with your transaction details for assistance.
        </p>

        <h3 className="font-medium mt-3">2.3 Duplicate Payments</h3>
        <p className="opacity-90">
          If you are charged more than once for the same transaction, Qbots will verify the issue and refund the duplicate charge to your original payment method within 5–10 business days.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">3. Exceptions (Refunds in Special Cases)</h2>
        <p className="opacity-90">
          Refunds may be considered only under exceptional circumstances, such as:
        </p>
        <ul className="list-disc pl-6 opacity-90 space-y-2 mt-2">
          <li>A technical error or platform malfunction caused by Qbots that prevented access to paid features.</li>
          <li>Extended downtime exceeding 48 continuous hours that directly impacts trading operations (excluding exchange/API-related issues).</li>
          <li>Regulatory or legal restrictions that make the service unavailable in your region after purchase.</li>
        </ul>
        <p className="opacity-90 mt-3">
          To qualify for an exception, a written refund request must be submitted within 3 business days of the issue arising, with evidence such as transaction IDs or screenshots.
          All refund requests will be reviewed by our billing team, and outcomes will be communicated via email. Approval is at the sole discretion of Qbots.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">4. Non-Refundable Scenarios</h2>
        <p className="opacity-90">
          Refunds will not be issued in the following cases:
        </p>
        <ul className="list-disc pl-6 opacity-90 space-y-2 mt-2">
          <li>Dissatisfaction due to market losses or unfavorable trading results.</li>
          <li>Misconfigured trading settings or API connection errors made by the user.</li>
          <li>Exchange downtime or third-party service interruptions.</li>
          <li>Expired subscriptions or partial usage of services.</li>
          <li>User account termination or suspension for violating Terms of Service or Fair Use policies.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">5. Contact for Cancellations or Refunds</h2>
        <p className="opacity-90">
          For any questions or refund-related concerns, please reach out to our support team:
        </p>
        <p className="opacity-90 mt-2">
          📧 Email: <a className="text-indigo-600 underline" href="mailto:support@qbots.trade">support@qbots.trade</a>
        </p>
        <p className="opacity-90 mt-1">
          🕒 Support Hours: Monday to Friday, 10:00 AM – 6:00 PM (UTC)
        </p>
        <p className="opacity-90 mt-2">We aim to respond to all refund or billing inquiries within 2–3 business days.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">6. Policy Updates</h2>
        <p className="opacity-90">
          Qbots reserves the right to update or modify this Refund &amp; Cancellation Policy at any time to reflect changes in business processes or regulatory requirements.
          Updates will be published on this page with a revised “Last Updated” date. Continued use of the Platform after updates constitutes acceptance of the new terms.
        </p>
      </section>
    </div>
  );
}
