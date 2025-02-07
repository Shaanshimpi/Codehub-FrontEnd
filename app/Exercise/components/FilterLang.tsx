"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import React from "react";

function FilterLang({ lang }: { lang: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const langParam = searchParams.get("lang");
    const pathname = usePathname();

    const handleLangChange = (langId: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("lang", langId); // Update or add the lang parameter

        router.push(`${pathname}?${params.toString()}`, { scroll: false }); // Update the URL without full reload
    };

    return (
        <div className="w-[40px] self-stretch">
            <div className="fixed flex flex-col gap-2">
                {lang?.map((item) => (
                    <button
                        key={item.documentId}
                        className={`block w-full py-2 text-white  transition-all flex-grow ${
                            item.documentId === langParam ? "bg-red-500" : "bg-primary-ch"
                          }` }
                        onClick={() => handleLangChange(item.documentId)}
                    >
                        {item.Name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default FilterLang;
