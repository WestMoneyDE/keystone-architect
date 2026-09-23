// Curated RSS/Atom feed catalog for the default `rss` NewsProvider.
//
// There is no single "enterprise architecture news" RSS feed, so instead of
// hand-curating 31 distinct per-domain feed lists, this maps a small set of
// real, stable, well-known tech feeds (~12) to the domain clusters they're
// actually relevant to. Several domains share feeds where their topic areas
// overlap (e.g. all Kubernetes/platform-adjacent domains draw from the
// Kubernetes Blog + CNCF Blog + The New Stack).
//
// Feed selection is a judgment call, not verified market data — see the
// plan's "honesty" framing for the news feature (item 8 / ticket 11).

export interface FeedDef {
  name: string;
  url: string;
}

export const FEEDS = {
  kubernetesBlog: { name: "Kubernetes Blog", url: "https://kubernetes.io/feed.xml" },
  cncfBlog: { name: "CNCF Blog", url: "https://www.cncf.io/feed/" },
  awsArchitecture: {
    name: "AWS Architecture Blog",
    url: "https://aws.amazon.com/blogs/architecture/feed/",
  },
  azureUpdates: {
    name: "Azure Updates",
    url: "https://azure.microsoft.com/en-us/updates/feed/",
  },
  gcpBlog: { name: "Google Cloud Blog", url: "https://cloudblog.withgoogle.com/rss/" },
  infoq: { name: "InfoQ", url: "https://feed.infoq.com/" },
  theNewStack: { name: "The New Stack", url: "https://thenewstack.io/feed/" },
  martinFowler: { name: "Martin Fowler", url: "https://martinfowler.com/feed.atom" },
  openaiBlog: { name: "OpenAI Blog", url: "https://openai.com/news/rss.xml" },
  hackerNews: {
    name: "The Hacker News",
    url: "https://feeds.feedburner.com/TheHackersNews",
  },
  confluentBlog: { name: "Confluent Blog", url: "https://www.confluent.io/rss.xml" },
  netflixTechBlog: { name: "Netflix Tech Blog", url: "https://netflixtechblog.com/feed" },
} as const satisfies Record<string, FeedDef>;

type FeedKey = keyof typeof FEEDS;

// Domain slug -> feed keys. Every one of the 31 seeded domains has an entry;
// domains without a directly-matching feed fall back to the closest general
// architecture/engineering feeds (InfoQ, Martin Fowler, The New Stack).
export const DOMAIN_FEEDS: Record<string, FeedKey[]> = {
  "navigation-governance": ["infoq", "martinFowler"],
  "target-roles": ["infoq", "theNewStack"],
  "linux-systems": ["theNewStack", "cncfBlog"],
  "network-foundations": ["theNewStack", "cncfBlog"],
  "enterprise-networking": ["theNewStack", "cncfBlog"],
  "distributed-systems": ["martinFowler", "infoq", "netflixTechBlog"],
  "software-architecture": ["martinFowler", "infoq"],
  "backend-integration": ["infoq", "netflixTechBlog", "confluentBlog"],
  "messaging-workflows": ["confluentBlog", "infoq"],
  "databases-storage": ["infoq", "netflixTechBlog"],
  "data-platforms": ["infoq", "netflixTechBlog", "confluentBlog"],
  "genai-architecture": ["openaiBlog", "gcpBlog", "infoq"],
  "agentic-ai": ["openaiBlog", "infoq"],
  "retrieval-memory": ["openaiBlog", "infoq"],
  "ml-engineering": ["openaiBlog", "infoq"],
  "mlops-evaluation": ["openaiBlog", "cncfBlog"],
  "kubernetes-platform": ["kubernetesBlog", "cncfBlog", "theNewStack"],
  "gpu-inference": ["theNewStack", "openaiBlog"],
  "cloud-foundations": ["awsArchitecture", "azureUpdates", "gcpBlog"],
  aws: ["awsArchitecture"],
  azure: ["azureUpdates"],
  "gcp-multicloud": ["gcpBlog"],
  "devops-supply-chain": ["cncfBlog", "theNewStack", "kubernetesBlog"],
  "security-identity": ["hackerNews", "cncfBlog"],
  "observability-sre": ["theNewStack", "cncfBlog"],
  "enterprise-architecture": ["infoq", "martinFowler"],
  "ai-governance": ["hackerNews", "openaiBlog"],
  "finops-economics": ["awsArchitecture", "theNewStack"],
  "iot-edge": ["theNewStack", "cncfBlog"],
  "commerce-integration": ["infoq", "theNewStack"],
  "architect-practice": ["martinFowler", "infoq"],
};

export function feedsForDomain(domainSlug: string): FeedDef[] {
  const keys = DOMAIN_FEEDS[domainSlug] ?? ["infoq", "theNewStack"];
  return keys.map((k) => FEEDS[k]);
}
