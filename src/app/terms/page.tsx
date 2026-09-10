import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms of Service | The Ready Consult", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return <LegalPage title="Terms of Service" updated="September 10, 2026" sections={[
    { title: "Using our services", paragraphs: ["You may use our websites and services only for lawful business purposes. You are responsible for the accuracy of information you provide and for maintaining access to your accounts."] },
    { title: "Client communications", paragraphs: ["Our messaging tools help businesses receive, organize, and respond to customer inquiries. The client business remains responsible for its messages, customer relationships, required notices, and compliance with applicable messaging rules."] },
    { title: "Third-party services", paragraphs: ["Our services may rely on third-party platforms such as WhatsApp and Meta. Their own terms and availability also apply, and we cannot guarantee uninterrupted operation of services outside our control."] },
    { title: "Intellectual property", paragraphs: ["Our website, branding, and original materials remain our property unless a written client agreement states otherwise. You may not copy or redistribute them without permission."] },
    { title: "Service limits", paragraphs: ["Services are provided under the scope and terms of the applicable client agreement. To the extent permitted by law, we are not liable for indirect or consequential losses arising from use of the website or third-party platforms."] },
    { title: "Contact", paragraphs: ["Questions about these terms can be sent to team@thereadyconsult.com."] },
  ]} />;
}
