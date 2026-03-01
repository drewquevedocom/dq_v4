"use client";

import { motion } from "framer-motion";
import React from "react";

interface SectionTitleProps {
    title: string;
    pulseWord?: string;
    className?: string;
    titleClassName?: string;
}

export default function SectionTitle({
    title,
    pulseWord,
    className = "",
    titleClassName = "text-[clamp(1.9rem,5vw,4.8rem)]",
}: SectionTitleProps) {
    return (
        <div className={`w-full ${className}`}>
            <h2
                className={`font-tech uppercase leading-[0.88] tracking-tight text-white ${titleClassName}`}
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8), 0 0 15px rgba(155, 127, 216, 0.4)" }}
            >
                <div className="inline-block rounded-xl backdrop-blur-[8px] bg-black/10 p-2 md:p-4 text-center md:text-left">
                    <span>
                        {title.split('\n').map((line, lineIndex) => (
                            <React.Fragment key={lineIndex}>
                                {pulseWord
                                    ? line.split(new RegExp(`(${pulseWord})`, "gi")).map((part, i) =>
                                        part.toLowerCase() === pulseWord.toLowerCase() ? (
                                            <motion.span
                                                key={`${lineIndex}-${i}`}
                                                animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
                                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                                className="inline-block origin-center"
                                            >
                                                {part}
                                            </motion.span>
                                        ) : (
                                            <span key={`${lineIndex}-${i}`}>{part}</span>
                                        )
                                    )
                                    : line}
                                {lineIndex < title.split('\n').length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </span>
                </div>
            </h2>
        </div>
    );
}
