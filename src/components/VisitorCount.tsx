import { getVisitCount } from "@/lib/visitors";

export async function VisitorCount() {
    const visits = await getVisitCount();
    return (
        <span>
            <span className="tabular-nums">
                <span><code className="rounded ">{visits !== null && <span>{visits.toLocaleString()}</span>}</code> views</span>
            </span>
        </span>
    );
}