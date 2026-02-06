import type { NewsArticle } from "@/types/news";

export const SOURCES = ["The Guardian", "New York Times", "BBC News"] as const;

export const CATEGORIES = [
  "Technology",
  "Sports",
  "Politics",
  "Science",
  "Health",
  "Business",
] as const;

export const mockNews: NewsArticle[] = [
  {
    id: "1",
    title: "AI Breakthroughs Reshape the Tech Landscape in 2026",
    description:
      "Leading tech companies are racing to deploy next-generation AI models that promise to transform industries from healthcare to finance.",
    source: "The Guardian",
    category: "Technology",
    date: "2026-02-05",
  },
  {
    id: "2",
    title: "Champions League Quarter-Finals Draw Delivers Blockbuster Ties",
    description:
      "Europe's elite football clubs learn their fate as the draw pairs defending champions against fierce rivals in a highly anticipated knockout stage.",
    source: "BBC News",
    category: "Sports",
    date: "2026-02-04",
  },
  {
    id: "3",
    title: "Global Leaders Convene for Climate Policy Summit",
    description:
      "Heads of state from over 50 nations gather to negotiate binding emissions targets ahead of the upcoming UN General Assembly session.",
    source: "New York Times",
    category: "Politics",
    date: "2026-02-03",
  },
  {
    id: "4",
    title: "Webb Telescope Detects New Earth-Like Exoplanet in Habitable Zone",
    description:
      "NASA scientists announce the discovery of a rocky planet orbiting a sun-like star just 40 light-years away, with conditions that could support liquid water.",
    source: "The Guardian",
    category: "Science",
    date: "2026-02-02",
  },
  {
    id: "5",
    title: "New Study Links Mediterranean Diet to Lower Heart Disease Risk",
    description:
      "A large-scale longitudinal study finds that adherence to a Mediterranean diet significantly reduces the risk of cardiovascular events in adults over 50.",
    source: "BBC News",
    category: "Health",
    date: "2026-02-01",
  },
  {
    id: "6",
    title: "Central Banks Signal Coordinated Rate Adjustments",
    description:
      "The Federal Reserve and European Central Bank hint at synchronized policy moves as global inflation shows signs of stabilizing after months of uncertainty.",
    source: "New York Times",
    category: "Business",
    date: "2026-01-31",
  },
];
