import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Data Deletion Instructions | The Ready Consult", alternates: { canonical: "/data-deletion" } };

export default function DataDeletionPage() {
  return <LegalPage title="Data Deletion Instructions" updated="September 10, 2026" sections={[
    { title: "Request deletion", paragraphs: ["Email team@thereadyconsult.com with the subject “Data deletion request.” Include the name, phone number or email address associated with the data and the business you contacted so we can locate the correct record."] },
    { title: "What happens next", paragraphs: ["We will acknowledge the request, verify that you are authorized to make it, and delete or anonymize eligible information from systems we control. We will normally complete verified requests within 30 days and will tell you if more time is required."] },
    { title: "Information we may retain", paragraphs: ["We may retain limited information when required for security, fraud prevention, legal compliance, dispute resolution, or financial recordkeeping. Information held independently by a client or third-party platform must be requested from that organization directly."] },
  ]} />;
}
