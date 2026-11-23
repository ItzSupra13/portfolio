import { NextResponse } from "next/server";

// app/feed/route.ts  ->  https://asterdev.vercel.app/rss
//
// Same URL, two outputs:
//   - feed readers   -> RSS XML
//   - browsers       -> a styled HTML page (chosen by the Accept header)
// This replaces the old trick of styling the XML with XSLT, which Chrome
// stopped supporting on stable in Nov 2026.

const esc = (s: string) =>
    s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

const rfc822 = (d: string) => new Date(d).toUTCString();

const SITE = {
    title: "Supratim Chakraborty",
    description: "Kernel and inference engineering projects, written from scratch.",
    email: "itzasterdev@gmail.com",
};

// newest first. `date` is the day you shipped it (ISO format).
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
        date: "2026-01-01",
    },
    {
        title: "back2sq1",
        path: "/back2sq1",
        description: "16-bit computer from scratch. runs tetris and python.",
        date: "2027-03-01",
    },
];

function xmlFeed(origin: string) {
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

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.title)}</title>
    <link>${esc(origin)}</link>
    <description>${esc(SITE.description)}</description>
    <language>en</language>
    <managingEditor>${esc(SITE.email)} (${esc(SITE.title)})</managingEditor>
    <lastBuildDate>${rfc822(items[0].date)}</lastBuildDate>
    <atom:link href="${esc(origin)}/feed" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>
`;
}

function htmlPage(origin: string) {
    const feedUrl = `${origin}/feed`;

    const cards = items
        .map(
            (it) => `
      <a class="card" href="${esc(origin + it.path)}">
        <time>${it.date}</time>
        <h2>${esc(it.title)}</h2>
        <p>${esc(it.description)}</p>
      </a>`
        )
        .join("");

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(SITE.title)} · feed</title>
<link rel="alternate" type="application/rss+xml" title="${esc(SITE.title)}" href="${esc(feedUrl)}">
<style>
  :root {
    --bg: #0b0714; --panel: #130d22;
    --accent: #a78bfa; --muted: #7c5cbf; --soft: #c4b5fd;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; background: var(--bg); color: var(--soft);
    font: 15px/1.6 ui-monospace, "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
    background-image: radial-gradient(60rem 30rem at 50% -10%, #2a1458 0%, transparent 70%);
  }
  main { max-width: 640px; margin: 0 auto; padding: 56px 20px 80px; }
  .prompt { color: var(--muted); font-size: 13px; }
  h1 {
    margin: 4px 0 6px; font-size: 30px; letter-spacing: -0.5px;
    background: linear-gradient(90deg, #fff, var(--soft));
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .lede { margin: 0 0 28px; opacity: .8; }
  .sub {
    border: 1px solid var(--muted); border-radius: 12px; padding: 14px 16px;
    background: var(--panel); margin-bottom: 36px;
  }
  .sub p { margin: 0 0 10px; font-size: 13px; opacity: .85; }
  .url { display: flex; gap: 8px; }
  .url code {
    flex: 1; padding: 8px 10px; border-radius: 8px; background: #000;
    color: #fff; overflow-x: auto; white-space: nowrap; font-size: 13px;
  }
  button {
    cursor: pointer; border: 0; border-radius: 8px; padding: 0 14px;
    background: var(--accent); color: #1a0b3a; font: inherit; font-weight: 700;
  }
  button:hover { background: var(--soft); }
  .label { color: var(--accent); font-weight: 700; margin: 0 0 12px; }
  .label::after { content: " " "─────────────────────────────"; color: var(--muted); font-weight: 400; }
  .card {
    display: block; text-decoration: none; color: inherit;
    border: 1px solid #2a1f45; border-radius: 12px; padding: 14px 16px;
    margin-bottom: 12px; background: var(--panel);
    transition: border-color .15s, transform .15s;
  }
  .card:hover { border-color: var(--accent); transform: translateX(4px); }
  .card time { font-size: 12px; color: var(--muted); }
  .card h2 { margin: 2px 0 4px; font-size: 17px; color: #fff; }
  .card h2::before { content: "▸ "; color: var(--accent); }
  .card p { margin: 0; font-size: 14px; opacity: .8; }
  footer { margin-top: 36px; font-size: 12px; color: var(--muted); }
  footer a { color: var(--accent); }
</style>
</head>
<body>
<main>
  <div class="prompt">$ curl -H "Accept: application/rss+xml" ${esc(feedUrl)}</div>
  <h1>${esc(SITE.title)}</h1>
  <p class="lede">${esc(SITE.description)}</p>

  <div class="sub">
    <p>This is an RSS feed. Paste the link into a feed reader (Feedly, NetNewsWire, Inoreader...) and new projects show up there automatically.</p>
    <div class="url">
      <code id="u">${esc(feedUrl)}</code>
      <button id="c" type="button">copy</button>
    </div>
  </div>

  <p class="label">latest</p>
  ${cards}

  <footer>← <a href="${esc(origin)}">back to the site</a></footer>
</main>
<script>
  document.getElementById("c").addEventListener("click", function () {
    var b = this;
    navigator.clipboard.writeText(document.getElementById("u").textContent).then(function () {
      b.textContent = "copied";
      setTimeout(function () { b.textContent = "copy"; }, 1500);
    });
  });
</script>
</body>
</html>`;
}

export function GET(req: Request) {
    const origin = new URL(req.url).origin;
    const accept = req.headers.get("accept") ?? "";
    const fetchDest = req.headers.get("sec-fetch-dest");

    // Real browsers navigating to the page send "Sec-Fetch-Dest: document".
    // Online feed viewers / fetchers don't, even if their Accept header
    // mentions text/html, so they fall through to XML.
    // Fallback for old browsers without Sec-Fetch: Accept must *start* with text/html.
    const wantsHtml =
        fetchDest !== null
            ? fetchDest === "document"
            : accept.trim().startsWith("text/html");

    const body = wantsHtml ? htmlPage(origin) : xmlFeed(origin);

    return new NextResponse(body, {
        headers: {
            "Content-Type": wantsHtml
                ? "text/html; charset=utf-8"
                : "application/rss+xml; charset=utf-8",
            // the CDN may not key its cache on these headers, so don't let it
            // store one version and serve it to the other kind of client
            Vary: "Accept, Sec-Fetch-Dest",
            "Cache-Control": "no-cache",
        },
    });
}