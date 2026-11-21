const BASE = "https://api.vercel.com/v1/query/web-analytics/visits/count";

export async function getVisitCount(): Promise<number | null> {
    const token = process.env.VERCEL_ACCESS_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;

    if (!token || !projectId) {
        console.error("analytics: VERCEL_ACCESS_TOKEN or VERCEL_PROJECT_ID is missing");
        return null;
    }

    const params = new URLSearchParams({ projectId });

    try {
        const res = await fetch(`${BASE}?${params}`, {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 3600 },
        });
        if (!res.ok) {
            console.error("analytics api:", res.status, await res.text());
            return null;
        }

        const json = await res.json();

        // console.log("analytics api response:", JSON.stringify(json));
        const n = json?.data?.visitors;
        return typeof n === "number" ? n : null;
    } catch (e) {
        console.error("analytics api failed:", e);
        return null;
    }
}