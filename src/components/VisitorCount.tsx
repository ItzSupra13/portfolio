import { getVisitCount } from "@/lib/visitors";

export async function VisitorCount() {
    const visits = await getVisitCount();
    return (
        <span>
            <span className="tabular-nums">
                visitor <span><code className="rounded pr-2 text-white">#{visits !== null && <span>{visits.toLocaleString()}</span>}</code></span>
            </span>
        </span>
    );
}