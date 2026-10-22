"use client";
import { useEffect, useState } from "react";

export function VisitorCount() {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        fetch("/api/visitors", { method: "POST" })
            .then((r) => r.json())
            .then((d) => setCount(d.count))
            .catch(() => { });
    }, []);

    return (
        <span>
            <span className="tabular-nums">
                Visitor
                <span>
                    <code className="rounded px-2 text-zinc-300">#{count ?? "···"}</code>
                </span>
            </span>
        </span>
    );
}