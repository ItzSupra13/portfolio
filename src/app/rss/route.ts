import { NextResponse } from "next/server";

// escape characters that are illegal inside XML text
const esc = (s: string) =>
    s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

// RSS wants RFC-822 dates, which is exactly what toUTCString() gives
const rfc822 = (d: string) => new Date(d).toUTCString();

const SITE = {
    title: "Supratim Chakraborty",
    description: "Kernel and inference engineering projects, written from scratch.",
    email: "itzasterdev@gmail.com",
};

// newest first. `date` is when you published/finished it (ISO format).
// add a new entry here whenever you ship something and the feed updates itself.
const items = [
    {
        title: "matmul++",
        path: "/gemm-optimization",
        description: "optimized matmul on gpu to SOTA",
        date: "2026-12-01",
    },
    {
        title: "bandits",
        path: "/bandits",
        description: "pytorch & pygame portable custom rl library",
        date: "2026-12-12",
    },
    {
        title: "back2sq1",
        path: "/back2sq1",
        description: "16-bit computer from scratch. runs tetris and python.",
        date: "2027-02-01",
    },
];

export function GET(req: Request) {
    const origin = new URL(req.url).origin;

    const itemsXml = items
        .map((it) => {
            const url = origin + it.path;
            return `    <item>
      <title>${esc(it.title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <description>${esc(it.description)}</description>
      <pubDate>${rfc822(it.date)}</pubDate>
    </item>`;
        })
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.title)}</title>
    <link>${esc(origin)}</link>
    <description>${esc(SITE.description)}</description>
    <language>en</language>
    <managingEditor>${esc(SITE.email)} (${esc(SITE.title)})</managingEditor>
    <lastBuildDate>${rfc822(items[0].date)}</lastBuildDate>
    <atom:link href="${esc(origin)}/rss" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>
`;

    return new NextResponse(xml, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
        },
    });
}