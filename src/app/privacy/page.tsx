import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy | The Ready Consult", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" updated="September 10, 2026" sections={[
    { title: "What we collect", paragraphs: ["When you contact us or a business we support, we may process your name, phone number, email address, message content, and related conversation details. We also collect basic website usage data through analytics tools."] },
    { title: "How we use information", paragraphs: ["We use this information to deliver requested services, route inquiries, support customer conversations, improve our services, protect our systems, and meet legal obligations. We do not sell personal information."] },
    { title: "Messaging and platform data", paragraphs: ["When a client uses our WhatsApp lead-management service, we process WhatsApp Platform Data only to receive and organize inquiries, notify the responsible business, and enable that business to respond. Each client controls its customer conversations."] },
    { title: "Service providers and retention", paragraphs: ["We use service providers for messaging, hosting, analytics, and business operations. They may process information only to provide those services. We retain information only as long as reasonably needed for the service, security, recordkeeping, and legal requirements."] },
    { title: "Your choices", paragraphs: ["You may request access, correction, or deletion of your personal information by emailing team@thereadyconsult.com. We may need to verify your identity before completing a request."] },
    { title: "Contact", paragraphs: ["Questions about this policy can be sent to team@thereadyconsult.com."] },
  ]} />;
}
