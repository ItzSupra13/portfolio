"use client";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { encode } from "qss";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

type LinkPreviewProps = {
  children: React.ReactNode;
  url: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
} & (
  | { isStatic: true; imageSrc: string }
  | { isStatic?: false; imageSrc?: never }
);

export const LinkPreview = ({
  children,
  url,
  className,
  width = 200,
  height = 125,
  isStatic = false,
  imageSrc = "",
}: LinkPreviewProps) => {
  let src;
  if (!isStatic) {
    const params = encode({
      url,
      screenshot: true,
      meta: false,
      embed: "screenshot.url",
      colorScheme: "dark",
      "viewport.width": width * 3,
      "viewport.height": height * 3,
    });
    src = `https://api.microlink.io/?${params}`;
  } else {
    src = imageSrc;
  }

  const [isOpen, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Motion values for X and Y coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs to give it that "floating" feel
  const springConfig = { stiffness: 150, damping: 20 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (event: React.MouseEvent) => {
    // We center the preview on the cursor
    // Offset Y by a bit so it doesn't flicker under the pointer
    mouseX.set(event.clientX - width / 2);
    mouseY.set(event.clientY - height / 2);
  };

  return (
    <>
      {/* Preload image */}
      {isMounted && (
        <div className="hidden">
          <img src={src} width={width} height={height} alt="hidden image" />
        </div>
      )}

      <HoverCardPrimitive.Root
        openDelay={50}
        closeDelay={100}
        onOpenChange={setOpen}
      >
        <HoverCardPrimitive.Trigger
          onMouseMove={handleMouseMove}
          className={cn("text-black dark:text-white underline cursor-none", className)}
          href={url}
        >
          {children}
        </HoverCardPrimitive.Trigger>
        <HoverCardPrimitive.Portal>
          {/* We use a custom Portal content to avoid Radix auto-positioning */}
          <AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      style={{
        x,
        y,
        position: "fixed",
        top: 0,
        left: 0,
        width: width, 
        height: height,
        pointerEvents: "none",
        zIndex: 9999,
      }}
      className="shadow-2xl rounded-xl bg-white p-1 overflow-hidden"
    >
      <div className="w-full h-full overflow-hidden rounded-lg">
        <img
          src={isStatic ? imageSrc : src}
          width={width}
          height={height}
          className="object-cover w-full h-full"
          alt="preview"
        />
      </div>
    </motion.div>
  )}
</AnimatePresence>
        </HoverCardPrimitive.Portal>
      </HoverCardPrimitive.Root>
    </>
  );
};