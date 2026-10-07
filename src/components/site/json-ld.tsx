import { GITHUB_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

type Thing = Record<string, unknown>;

/** Structured data for search engines. `<` is escaped so content can never close the script tag. */
export function JsonLd({ data }: { data: Thing | Thing[] }) {
  const json = JSON.stringify(Array.isArray(data) ? { "@context": "https://schema.org", "@graph": data } : { "@context": "https://schema.org", ...data });
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }} />;
}

export const organization: Thing = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: [GITHUB_URL],
};

export const website: Thing = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en",
};

export const softwareApplication: Thing = {
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#app`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Invoicing software",
  operatingSystem: "Web browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "PDF invoices with four templates",
    "Automatic invoice numbering",
    "Any currency",
    "Reverse-charge and export tax notes",
    "Partial payments and overdue tracking",
    "Saved clients and team workspaces",
    "Optional AI to fill in client details and draft line items",
  ],
  screenshot: `${SITE_URL}/opengraph-image`,
  license: "https://opensource.org/licenses/MIT",
  isAccessibleForFree: true,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export function faqPage(faqs: readonly (readonly [string, string])[]): Thing {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}

export function breadcrumbs(items: [name: string, path: string][]): Thing {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [["Home", "/"] as const, ...items].map(([name, path], i) => ({
      "@type": "ListItem", position: i + 1, name, item: `${SITE_URL}${path === "/" ? "" : path}`,
    })),
  };
}
