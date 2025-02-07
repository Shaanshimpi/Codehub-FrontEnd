"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import React from "react";

function FilterTopic({ topics }: { topics: any }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const topicParam = searchParams.get("topic"); // Get the active topic from URL

    const handleFilterClick = (topicId: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("topic", topicId); // Update or add the topic parameter

        router.push(`${pathname}?${params.toString()}`, { scroll: false }); // Update the URL without full reload
    };

    return (
        <div className="fixed bottom-0 bg-white text-black text-lg w-[100%] p-2 flex h-[50px] items-center gap-3 overflow-x-scroll overflow-y-visible topic-bar">
            {topics?.map((topic) => (
                <button 
                    key={topic.documentId} 
                    className={`px-3 py-1 rounded h-[100%] whitespace-nowrap ${
                        topic.documentId === topicParam ? "bg-red-500 text-white" : "bg-gray-200"
                    }`}
                    onClick={() => handleFilterClick(topic.documentId)}
                >
                    {topic.Name}
                </button>
            ))}
        </div>
    );
}

export default FilterTopic;
