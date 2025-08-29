// Seed data for local usage (no network fetch).
export const prompts = [
  {
    id: "seo-outline",
    title: "SEO Blog Outline From Topic",
    model: "GPT-4o",
    category: "Writing",
    tags: ["#seo", "#outline", "#blog"],
    content: "You are an SEO strategist...\nGiven the topic: {TOPIC}\nProduce an outline with H2/H3, FAQs, and schema suggestions...",
    url: "https://chat.openai.com/",
    createdAt: 1719900000000
  },
  {
    id: "refactor-rust",
    title: "Refactor Rust Module for Testability",
    model: "Claude 3.5",
    category: "Code",
    tags: ["#rust", "#refactor", "#testing"],
    content: "Act as a senior Rust engineer...\nRefactor the module to separate IO from logic...",
    url: "https://claude.ai/",
    createdAt: 1720200000000
  },
  {
    id: "ux-critique",
    title: "Heuristic UX Critique",
    model: "Llama 3",
    category: "Design",
    tags: ["#ux", "#heuristics", "#audit"],
    content: "You are a UX reviewer applying Nielsen heuristics...\nEvaluate: {PAGE_URL}\nReturn prioritized issues with severity and fixes...",
    url: "https://example.com",
    createdAt: 1720500000000
  },
  {
    id: "lit-review",
    title: "Quick Literature Review",
    model: "Gemini",
    category: "Research",
    tags: ["#research", "#summary", "#citations"],
    content: "Given a research question, identify key terms, summarize top sources, and produce a structured brief with citations in APA.",
    url: "https://example.com",
    createdAt: 1720600000000
  }
];

export const tagsCloud = ["#seo", "#typescript", "#ux", "#summarize", "#prompt-injection", "#agents", "#sql", "#course", "#automation"];

