import { getAuthorByName } from "./authors";

const SITE_URL = "https://www.thereadyconsult.com";
const ORG_NAME = "The Ready Consult";

export function blogPostSchema(
  title: string,
  description: string,
  url: string,
  image: string,
  datePublished: string,
  dateModified?: string,
  authorName?: string
) {
  const author = authorName ? getAuthorByName(authorName) : null;
  const authorBlock = author
    ? {
        "@type": "Person",
        "@id": `${SITE_URL}/author/${author.slug}#person`,
        name: author.name,
        jobTitle: author.jobTitle,
        url: `${SITE_URL}/author/${author.slug}`,
        image: `${SITE_URL}${author.image}`,
        sameAs: author.sameAs,
        knowsAbout: author.knowsAbout,
        worksFor: {
          "@type": "Organization",
          name: ORG_NAME,
          url: SITE_URL,
        },
      }
    : {
        "@type": "Organization",
        name: ORG_NAME,
        url: SITE_URL,
      };

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: authorBlock,
    publisher: {
      "@type": "Organization",
      name: ORG_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
    },
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function howToSchema(
  name: string,
  description: string,
  steps: { name: string; text: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
