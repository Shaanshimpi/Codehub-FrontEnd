// Structured Data (Schema.org) Utilities for SEO

export interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

/**
 * Generate BreadcrumbList structured data
 * Used for navigation breadcrumbs in search results
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Organization structured data
 * Used for the main organization/company info
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CodeHub",
    url: "https://codehubindia.in",
    logo: "https://codehubindia.in/assets/logo-sqr.png",
    description:
      "Premier coding institute in Nashik offering comprehensive programming education",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nashik",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    sameAs: [
      "https://facebook.com/codehubindia",
      "https://twitter.com/codehubindia",
      "https://instagram.com/codehubindia",
    ],
  };
}

/**
 * Generate Course structured data
 * Used for tutorial listing pages
 */
export function generateCourseSchema(data: {
  name: string;
  description: string;
  url: string;
  provider: string;
  teaches?: string[];
  educationalLevel?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: data.name,
    description: data.description,
    url: data.url,
    provider: {
      "@type": "Organization",
      name: data.provider,
      url: "https://codehubindia.in",
    },
    educationalLevel: data.educationalLevel || "Beginner",
    teaches: data.teaches || [],
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT20H",
      },
    ],
  };
}

/**
 * Generate LearningResource structured data
 * Used for individual tutorial pages
 */
export function generateLearningResourceSchema(data: {
  name: string;
  description: string;
  url: string;
  teaches: string;
  timeRequired?: string;
  difficulty?: string;
  lessons?: { name: string; position: number }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: data.name,
    description: data.description,
    url: data.url,
    educationalLevel: data.difficulty || "Beginner",
    inLanguage: "en",
    learningResourceType: "Tutorial",
    teaches: data.teaches,
    timeRequired: data.timeRequired || "PT30M",
    interactivityType: "active",
    author: {
      "@type": "Organization",
      name: "CodeHub",
    },
    hasPart:
      data.lessons?.map((lesson) => ({
        "@type": "LearningResource",
        name: lesson.name,
        position: lesson.position,
      })) || [],
  };
}

/**
 * Generate SoftwareApplication structured data
 * Used for AI tools like Vivy Chat
 */
export function generateSoftwareAppSchema(data: {
  name: string;
  description: string;
  url: string;
  category: string;
  features?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: data.name,
    applicationCategory: data.category,
    description: data.description,
    url: data.url,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: data.features || [],
  };
}

/**
 * Generate Offer structured data
 * Used for Gold membership page
 */
export function generateOfferSchema(data: {
  name: string;
  description: string;
  url: string;
  itemName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: data.name,
    description: data.description,
    url: data.url,
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    itemOffered: {
      "@type": "Product",
      name: data.itemName,
      description: data.description,
    },
  };
}

/**
 * Generate WebPage structured data
 * Used for general pages
 */
export function generateWebPageSchema(data: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: data.name,
    description: data.description,
    url: data.url,
    publisher: {
      "@type": "Organization",
      name: "CodeHub",
      url: "https://codehubindia.in",
    },
  };
}

/**
 * Generate ItemList structured data
 * Used for listing pages (exercises, tutorials)
 */
export function generateItemListSchema(data: {
  name: string;
  description: string;
  items: { name: string; url: string; position: number }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: data.name,
    description: data.description,
    itemListElement: data.items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };
}

/**
 * Generate FAQPage structured data
 * Used for pages with frequently asked questions
 */
export function generateFAQSchema(
  faqs: { question: string; answer: string }[],
) {
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

/**
 * Generate VideoObject structured data
 * Used for pages with video tutorials
 */
export function generateVideoSchema(data: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: data.name,
    description: data.description,
    thumbnailUrl: data.thumbnailUrl,
    uploadDate: data.uploadDate,
    duration: data.duration || "PT10M",
    contentUrl: data.contentUrl,
  };
}

/**
 * Generate Article structured data
 * Used for tutorial/blog content pages
 */
export function generateArticleSchema(data: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.headline,
    description: data.description,
    image: data.image,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: {
      "@type": "Organization",
      name: data.author,
    },
    publisher: {
      "@type": "Organization",
      name: "CodeHub",
      logo: {
        "@type": "ImageObject",
        url: "https://codehubindia.in/assets/logo-sqr.png",
      },
    },
    url: data.url,
  };
}
