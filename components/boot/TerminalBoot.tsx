"use client";

import { useEffect, useRef, useState } from "react";

export default function TerminalBoot() {
  const linesRef = useRef<string[]>([
    "> initializing...",
    "> Neuralink detected...",
    "> establishing uplink...",
    "> $DOGE........................................Do Only Good Everyday",
    "> loading Jeepmeta...",
    "> .",
    "> .",
    "> .",
    "> .............................................jawn'n...............",
  ]);

  const [output, setOutput] = useState("");
  const [fade, setFade] = useState(false);
  const [done, setDone] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [typing, setTyping] = useState(true);

  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const lines = linesRef.current;
    const fullText = lines.join("\n");
    const totalChars = fullText.length;

    const totalDuration = 2200;
    const charInterval = totalDuration / totalChars;

    let index = 0;

    const typeInterval = setInterval(() => {
      if (!mountedRef.current) return;

      index++;
      setOutput(fullText.slice(0, index));

      if (index >= totalChars) {
        clearInterval(typeInterval);
        setTyping(false);

        const fadeTimer = setTimeout(() => {
          if (!mountedRef.current) return;
          setFade(true);

          const doneTimer = setTimeout(() => {
            if (!mountedRef.current) return;
            setDone(true);
          }, 350);

          return () => clearTimeout(doneTimer);
        }, 150);

        return () => clearTimeout(fadeTimer);
      }
    }, charInterval);

    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    if (typing) return;

    const blink = setInterval(() => {
      if (!mountedRef.current) return;
      setCursorVisible((v) => !v);
    }, 450);

    return () => clearInterval(blink);
  }, [typing]);

  if (done) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "black",
        color: "#00eeff",
        fontFamily: "monospace",
        padding: "40px",
        fontSize: "8px",
        whiteSpace: "pre-wrap",
        zIndex: 9998,
        pointerEvents: "none",
        opacity: fade ? 0 : 1,
        transition: "opacity 0.35s ease-out",
      }}
    >
      {output}
      <span
        style={{
          opacity: typing ? 1 : cursorVisible ? 1 : 0,
          transition: "opacity 0.1s linear",
        }}
      >
        █
      </span>
    </div>
  );
}
