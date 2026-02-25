"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "motion/react";
import { cn } from "@/lib/utils";

type WordItem = {
  text: string;
  tracking: string;
};

interface WordRotateProps {
  words: WordItem[];
  moveDuration?: number; // time it takes to slide
  pauseDuration?: number; // time it waits fully visible
  className?: string;
}

export function WordRotate({
  words,
  moveDuration = 0.8,
  pauseDuration = 900,
  className,
}: WordRotateProps) {
  const controls = useAnimation();
  const [index, setIndex] = useState(0);

  const WORD_HEIGHT = 1.2; 
  const GAP = 0.1;

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const animate = async () => {
      timeout = setTimeout(async () => {
        const nextIndex = (index + 1) % words.length;

        await controls.start({
          y: `-${nextIndex * (WORD_HEIGHT + GAP)}em`,
          transition: {
            duration: moveDuration,
            ease: "easeInOut",
          },
        });

        setIndex(nextIndex);
      }, pauseDuration);
    };

    animate();

    return () => clearTimeout(timeout);
  }, [index, words.length, controls, moveDuration, pauseDuration]);

  return (
    <div
      className="relative overflow-hidden min-w-[250px]"
      style={{ height: `${WORD_HEIGHT}em` }}
    >
      <motion.div animate={controls}>
        {words.map((word, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center justify-center font-sans",
              word.tracking,
              className
            )}
            style={{
              height: `${WORD_HEIGHT}em`,
              marginBottom: `${GAP}em`,
            }}
          >
            {word.text}
          </div>
        ))}
      </motion.div>
    </div>
  );
}