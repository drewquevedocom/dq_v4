"use client";

import React from "react";

const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const highlightKeywords = (text: string, keywords: string[] | undefined) => {
    if (!keywords || keywords.length === 0) {
        return text;
    }

    const keywordSet = new Set(keywords.map((keyword) => keyword.toLowerCase()));
    const pattern = new RegExp(`\\b(${keywords.map(escapeRegExp).join("|")})\\b`, "gi");
    const parts = text.split(pattern);

    return parts.map((part, index) => {
        const isKeyword = keywordSet.has(part.toLowerCase());
        if (!isKeyword) {
            return <span key={`${part}-${index}`}>{part}</span>;
        }

        return (
            <span
                key={`${part}-${index}`}
                className="font-semibold text-[#D1C4E9] [text-shadow:0_0_15px_rgba(209,196,233,0.5)]"
            >
                {part}
            </span>
        );
    });
};

interface SectionSubtitleProps {
    text: string;
    keywords?: string[];
    className?: string;
    style?: React.CSSProperties;
}

export default function SectionSubtitle({
    text,
    keywords,
    className = "",
    style,
}: SectionSubtitleProps) {
    return (
        <div
            className={`rounded-2xl border border-white/10 bg-[#4B0082]/15 px-5 py-4 text-balance font-tech text-[0.96rem] leading-relaxed text-white backdrop-blur-md [text-shadow:0px_4px_12px_rgba(0,0,0,0.8)] md:px-6 md:py-5 md:text-[1.02rem] ${className}`}
            style={{
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,1))",
                ...style,
            }}
        >
            <p>{highlightKeywords(text, keywords)}</p>
        </div>
    );
}
