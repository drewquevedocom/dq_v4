"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const CHARACTERS = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;':,.<>/?";

interface MatrixTextRevealProps {
    text: string;
    isActive: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    duration?: number; // total duration in seconds
}

export default function MatrixTextReveal({
    text,
    isActive,
    className = "",
    style,
    children,
    duration = 1.0 // default 1 second
}: MatrixTextRevealProps) {
    const [displayText, setDisplayText] = useState(text);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isActive) {
            setIsCompleted(false);
            setIsAnimating(true);
            let iteration = 0;
            const totalIterations = text.length;
            const intervalMs = (duration * 1000) / totalIterations;

            const interval = setInterval(() => {
                iteration += 1;

                setDisplayText((prev) =>
                    prev
                        .split("")
                        .map((letter, index) => {
                            if (letter === " ") return " ";
                            if (index < iteration) {
                                return text[index];
                            }
                            // random binary or symbol
                            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
                        })
                        .join("")
                );

                if (iteration >= text.length) {
                    clearInterval(interval);
                    setIsCompleted(true);
                    setIsAnimating(false);
                }
            }, intervalMs);

            return () => clearInterval(interval);
        } else {
            setIsCompleted(false);
            setIsAnimating(false);
            setDisplayText(text);
        }
    }, [isActive, text]);

    return (
        <motion.div
            className={className}
            style={style}
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.5 }}
        >
            {isCompleted && children ? children : displayText}
        </motion.div>
    );
}
