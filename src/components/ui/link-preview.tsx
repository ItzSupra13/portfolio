"use client";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import React, { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

type LinkPreviewProps = {
  children: React.ReactNode;
  url?: string;
  imageSrc: string;
  className?: string;
  width?: number;
  height?: number;
};

export const LinkPreview = ({
  children,
  url,
  imageSrc,
  className,
  width = 200,
  height = 125,
}: LinkPreviewProps) => {
  const [isOpen, setOpen] = useState(false);

  // Start OFFSCREEN to prevent snap from top-left
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  const springConfig = { stiffness: 180, damping: 22 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (event: React.MouseEvent) => {
    mouseX.set(event.clientX - width / 2);
    mouseY.set(event.clientY - height / 2 - 20); // slight lift
  };

  return (
    <HoverCardPrimitive.Root openDelay={50} closeDelay={100} onOpenChange={setOpen}>
      <HoverCardPrimitive.Trigger
        onMouseMove={handleMouseMove}
        className={cn("underline cursor-none text-foreground", className)}
        asChild
      >
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ) : (
          <span>{children}</span>
        )}
      </HoverCardPrimitive.Trigger>

      <HoverCardPrimitive.Portal>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              style={{
                x,
                y,
                position: "fixed",
                top: 0,
                left: 0,
                width,
                height,
                pointerEvents: "none",
                zIndex: 9999,
              }}
              className="
                rounded-xl 
                bg-background 
                border-6 border-white/10
                shadow-[0_10px_40px_rgba(0,0,0,0.35)]
                backdrop-blur-sm
                overflow-hidden
              "
            >
              <motion.img
                src={imageSrc}
                alt="preview"
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  );
};
