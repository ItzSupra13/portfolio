import { NextResponse } from "next/server";

const ESC = "\x1b";
const R = `${ESC}[0m`, B = `${ESC}[1m`, D = `${ESC}[2m`;
const rgb = (r: number, g: number, b: number) => `${ESC}[38;2;${r};${g};${b}m`;

const ACCENT = rgb(167, 139, 250); // violet-400, headings and links
const MUTED = rgb(124, 92, 191);  // box borders, dividers
const SOFT = rgb(196, 181, 253); // lavender, secondary text
const WHITE = rgb(255, 255, 255);

// visible length: ignores color codes and OSC 8 hyperlinks
const vis = (s: string) =>
    s.replace(/\x1b\[[0-9;]*m|\x1b\]8;;[^\x1b]*\x1b\\/g, "").length;
const pad = (s: string, n: number) => s + " ".repeat(Math.max(0, n - vis(s)));

// clickable link (iTerm2, kitty, WezTerm, Windows Terminal, GNOME Terminal...)
const link = (url: string, text = url) =>
    `${ESC}]8;;${url}${ESC}\\${text}${ESC}]8;;${ESC}\\`;

function gradient(text: string, from: number[], to: number[]) {
    const chars = [...text];
    return (
        chars
            .map((c, i) => {
                const t = chars.length > 1 ? i / (chars.length - 1) : 0;
                const [r, g, b] = from.map((v, k) => Math.round(v + (to[k] - v) * t));
                return `${rgb(r, g, b)}${c}`;
            })
            .join("") + R
    );
}

const section = (title: string) =>
    `\n  ${B}${ACCENT}${title}${R} ${MUTED}${"─".repeat(46 - title.length)}${R}\n`;

// generate with https://patorjk.com/software/taag/ (font: ANSI Shadow) and paste here
const BANNER = [
    "            _____ _______ ______ _____    _____  ________      __",
    "     ╱╲    ╱ ____│__   __│  ____│  __ ╲  │  __ ╲│  ____╲ ╲    ╱ ╱",
    "    ╱  ╲  │ (___    │ │  │ │__  │ │__) │ │ │  │ │ │__   ╲ ╲  ╱ ╱ ",
    "   ╱ ╱╲ ╲  ╲___ ╲   │ │  │  __│ │  _  ╱  │ │  │ │  __│   ╲ ╲╱ ╱  ",
    "  ╱ ____ ╲ ____) │  │ │  │ │____│ │ ╲ ╲  │ │__│ │ │____   ╲  ╱   ",
    " ╱_╱    ╲_╲_____╱   │_│  │______│_│  ╲_╲ │_____╱│______│   ╲╱    "


];

const projects = [
    ["matmul++", "optimized matmul on gpu to SOTA", "/gemm-optimization"],
    ["bandits", "pytorch & pygame portable custom rl library", "/bandits"],
    ["back2sq1", "16-bit computer from scratch. runs tetris and python.", "/back2sq1"],
    // ["infi", "a lightweight local-first llm inference engine", "infi"],
];

const links = [
    ["github", "https://github.com/ItzSupra13"],
    ["linkedin", "https://linkedin.com/in/supratim13"],
    ["x", "https://x.com/aster_dev_"],
    ["resume", "https://asterdev.vercel.app/resume.pdf"],// For jobs
    // ["cv", "https://asterdev.vercel.app/cv.pdf"], // For academia
];

export function GET(req: Request) {
    const origin = new URL(req.url).origin;
    const host = origin.replace(/^https?:\/\//, "");

    const banner = BANNER.map((l) =>
        gradient(l, [124, 58, 237], [221, 214, 254])
    ).join("\n");

    const mix = (from: number[], to: number[], t: number) =>
        rgb(...(from.map((v, k) => Math.round(v + (to[k] - v) * t)) as [number, number, number]));

    function box(lines: string[], title = "") {
        const w = Math.max(...lines.map(vis), 44) + 4;
        const total = lines.length + 2;
        const from = [124, 58, 237], to = [221, 214, 254]; // violet -> lavender
        const bc = (i: number) => mix(from, to, i / (total - 1)); // border color per row

        const top =
            `${bc(0)}╭─ ${R}${B}${WHITE}${title}${R}${bc(0)} ${"─".repeat(w - vis(title) - 3)}╮${R}`;
        const body = lines.map(
            (l, i) => `${bc(i + 1)}│${R}  ${pad(l, w - 4)}  ${bc(i + 1)}│${R}`
        );
        const bottom = `${bc(total - 1)}╰${"─".repeat(w)}╯${R}`;

        return [top, ...body, bottom].join("\n");
    }

    const row = (label: string, value: string) =>
        `${MUTED}${pad(label, 7)}${R}${value}`;

    const card = box(
        [
            `${SOFT}$${R} ${D}whoami${R}`,
            `${B}${gradient("Supratim Chakraborty", [255, 255, 255], [196, 181, 253])}`,
            "",
            `${MUTED}${"─".repeat(44)}${R}`,
            row("role", `${SOFT}Wannabe Kernel and Inference engineer${R}`),
            row("stack", `${SOFT}C++ · Python · Cuda${R}`),
            row("based", `${SOFT}Kolkata, IN${R}`),
            row("status", `${WHITE}available${R} ${SOFT}for work${R}`),
            row("mail", link("mailto:itzasterdev@gmail.com", "itzasterdev@gmail.com")),
        ],
        "whoami.sh"
    );

    const projectRows = projects
        .map(
            ([n, d, p]) =>
                `  ${WHITE}▸${R} ${B}${SOFT}${pad(link(origin + p, n), 11)}${R}${D}${d}${R}`
        )
        .join("\n");

    const linkRows = links
        .map(([n, u]) => `  ${ACCENT}▸${R} ${pad(n, 11)}${link(u, u.replace(/^https?:\/\//, ""))}`)
        .join("\n");

    const out = [
        "",
        banner,
        "",
        card,
        section("projects"),
        projectRows,
        section("links"),
        linkRows,
        "",
        `  ${D}curious enough to check me out via terminal? goddamn ive made it :)${R}`,
        `  ${MUTED}$${R} ${D}open ${origin} for the full disclosure${R}`,
        "",
    ].join("\n");

    return new NextResponse(out, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            Vary: "User-Agent",
            "Cache-Control": "public, s-maxage=3600",
        },
    });
}