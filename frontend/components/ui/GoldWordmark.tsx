"use client";

import { useEffect, useId, useRef, useState } from "react";

export function GoldWordmark({
  text = "OJASKARAA BUILDERS",
  className = "",
  fontSize = 84,
}: {
  text?: string;
  className?: string;
  fontSize?: number;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const textRef = useRef<SVGTextElement>(null);
  const beforeIRef = useRef<SVGTSpanElement>(null);
  const iLetterRef = useRef<SVGTSpanElement>(null);
  const [box, setBox] = useState({ width: 400, height: 100, x: 0, y: 0 });
  const [iBox, setIBox] = useState<{ x: number; width: number } | null>(null);

  const lastSpace = text.lastIndexOf(" ");
  const firstWord = lastSpace >= 0 ? text.slice(0, lastSpace) : text;
  const secondWord = lastSpace >= 0 ? text.slice(lastSpace + 1) : "";
  const iIndex = secondWord.toUpperCase().indexOf("I");
  const beforeI = iIndex >= 0 ? secondWord.slice(0, iIndex) : "";
  const iLetter = iIndex >= 0 ? secondWord[iIndex] : "";
  const afterI = iIndex >= 0 ? secondWord.slice(iIndex + 1) : "";

  useEffect(() => {
    if (textRef.current) {
      const bbox = textRef.current.getBBox();
      setBox({ width: bbox.width, height: bbox.height, x: bbox.x, y: bbox.y });
    }
    if (iLetterRef.current) {
      const ib = iLetterRef.current.getBBox();
      setIBox({ x: ib.x, width: ib.width });
    }
  }, [text, fontSize]);

  const pad = fontSize * 0.35;
  // No left padding: keeps the glyph flush with the SVG's left edge so it
  // lines up with sibling elements (logo mark, tagline text) that share the
  // same left edge in a flex column. Top/bottom/right padding is kept for
  // the sparkle glyph and bevel filter bleed.
  const viewBox = `${box.x} ${box.y - pad} ${box.width + pad} ${box.height + pad * 2}`;
  const baselineY = fontSize * 0.78;
  const sparkleSize = fontSize * 0.24;
  const sparkleCx = iBox ? iBox.x + iBox.width / 2 : 0;
  const sparkleCy = baselineY - fontSize * 0.72;

  return (
    <svg
      role="img"
      aria-label={text}
      className={className}
      viewBox={viewBox}
    >
      <defs>
        {/*
          Restrained metal-plaque treatment, matched to the site's .text-gold-3d
          heading style: a soft champagne-to-bronze fill, a hairline highlight
          above, a hairline contact shadow below, and one soft ambient shadow
          for grounding. No specular/glossy lighting — that reads as glass or
          gaming chrome rather than polished, machined gold.
        */}
        <linearGradient id={`face-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdf3d0" />
          <stop offset="50%" stopColor="#eabe3a" />
          <stop offset="100%" stopColor="#a97a1a" />
        </linearGradient>
        <radialGradient id={`spark-${uid}`}>
          <stop offset="0%" stopColor="#fffdf5" />
          <stop offset="45%" stopColor="#f9e29b" />
          <stop offset="100%" stopColor="#b3821a" />
        </radialGradient>
        <filter id={`bevel-${uid}`} x="-20%" y="-40%" width="140%" height="220%">
          <feDropShadow dx="0" dy={fontSize * 0.09} stdDeviation={fontSize * 0.05} floodColor="#000000" floodOpacity="0.35" result="ambient" />
          <feDropShadow in="SourceGraphic" dx="0" dy={fontSize * 0.02} stdDeviation={fontSize * 0.004} floodColor="#3d2004" floodOpacity="0.6" result="lo" />
          <feDropShadow in="SourceGraphic" dx="0" dy={-fontSize * 0.02} stdDeviation={fontSize * 0.004} floodColor="#fff8de" floodOpacity="0.45" result="hi" />
          <feMerge>
            <feMergeNode in="ambient" />
            <feMergeNode in="lo" />
            <feMergeNode in="hi" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <text
        ref={textRef}
        x="0"
        y={baselineY}
        fontFamily="var(--font-brand), sans-serif"
        fontWeight={300}
        fontSize={fontSize}
        letterSpacing="0"
        fill={`url(#face-${uid})`}
        stroke="#5c3a0a"
        strokeWidth={fontSize * 0.004}
        paintOrder="stroke"
        filter={`url(#bevel-${uid})`}
      >
        <tspan>{firstWord}</tspan>
        {secondWord && (
          <tspan dx={fontSize * 0.3}>
            <tspan ref={beforeIRef}>{beforeI}</tspan>
            <tspan ref={iLetterRef}>{iLetter}</tspan>
            <tspan>{afterI}</tspan>
          </tspan>
        )}
      </text>
      {iIndex >= 0 && iBox && (
        <rect
          x={sparkleCx - sparkleSize / 2}
          y={sparkleCy - sparkleSize / 2}
          width={sparkleSize}
          height={sparkleSize}
          transform={`rotate(45 ${sparkleCx} ${sparkleCy})`}
          fill={`url(#spark-${uid})`}
          stroke="#7a4508"
          strokeWidth={fontSize * 0.01}
          filter={`url(#bevel-${uid})`}
        />
      )}
    </svg>
  );
}
