import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const seen = req.cookies.get("visited");

  // returning visitor: just read. New visitor: increment.
  const count = seen
    ? Number(await redis.get("visitors")) || 0
    : await redis.incr("visitors");

  const res = NextResponse.json({ count });
  if (!seen) {
    res.cookies.set("visited", "1", {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }
  return res;
}