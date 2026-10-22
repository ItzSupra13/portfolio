import { NextRequest, NextResponse } from "next/server";

const CLI = /^(curl|wget|httpie|xh|fetch)\b/i;

export function proxy(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";

  if (req.nextUrl.pathname === "/" && CLI.test(ua)) {
    return NextResponse.rewrite(new URL("/terminal", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: "/" };