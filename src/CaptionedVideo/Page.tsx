import { makeTransform, scale, translateY } from "@remotion/animation-utils";
import { TikTokPage } from "@remotion/captions";
import { fitText } from "@remotion/layout-utils";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TheBoldFont } from "../load-font";

const fontFamily = TheBoldFont;

const container: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  top: undefined,
  bottom: "40%",
  height: 150,
};

const DESIRED_FONT_SIZE = 120;
const HIGHLIGHT_COLOR = "#39E508";

// Słownik emocji i stylu
const HORROR_STYLE: Record<string, { color: string; emoji: string }> = {
  death: { color: "#ff0000", emoji: "💀" },
  madness: { color: "#ff0000", emoji: "🌀" },
  blood: { color: "#880000", emoji: "🩸" },
  river: { color: "#00ffff", emoji: "🌊" },
  crying: { color: "#ffffff", emoji: "😢" },
  shattered: { color: "#cccccc", emoji: "💔" },
  children: { color: "#ffff00", emoji: "🧒" },
  dark: { color: "#555555", emoji: "🌑" },
  ghost: { color: "#ffffff", emoji: "👻" },
  legend: { color: "#ffd700", emoji: "📜" },
};

export const Page: React.FC<{
  readonly enterProgress: number;
  readonly page: TikTokPage;
}> = ({ enterProgress, page }) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();
  const timeInMs = (frame / fps) * 1000;

  const fittedText = fitText({
    fontFamily,
    text: page.text,
    withinWidth: width * 0.9,
    textTransform: "uppercase",
  });

  const fontSize = Math.min(DESIRED_FONT_SIZE, fittedText.fontSize);

  return (
    <AbsoluteFill style={container}>
      <div
        style={{
          fontSize,
          color: "white",
          WebkitTextStroke: "20px black",
          paintOrder: "stroke",
          transform: makeTransform([
            scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
            translateY(interpolate(enterProgress, [0, 1], [50, 0])),
          ]),
          fontFamily,
          textTransform: "uppercase",
        }}
      >
        <span
          style={{
            transform: makeTransform([
              scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
              translateY(interpolate(enterProgress, [0, 1], [50, 0])),
            ]),
          }}
        >
          {page.tokens.map((t) => {
            const startRelativeToSequence = t.fromMs - page.startMs;
            const endRelativeToSequence = t.toMs - page.startMs;

            const active =
              startRelativeToSequence <= timeInMs &&
              endRelativeToSequence > timeInMs;

            // Logika Horror Style
            const cleanWord = t.text.toLowerCase().replace(/[^\w]/g, "");
            const special = HORROR_STYLE[cleanWord];

            // Kolor: specjalny jeśli zdefiniowany, inaczej standardowy highlight
            const activeColor = special ? special.color : HIGHLIGHT_COLOR;

            return (
              <span
                key={t.fromMs}
                style={{
                  display: "inline-block", // Zmienione na inline-block, żeby emoji nie uciekało
                  whiteSpace: "pre",
                  color: active ? activeColor : "white",
                  position: "relative",
                }}
              >
                {t.text}
                {/* Emotka pojawia się tylko nad aktywnym słowem ze słownika */}
                {active && special && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-80px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: "70px",
                      WebkitTextStroke: "0px", // Emoji nie potrzebuje obrysu
                    }}
                  >
                    {special.emoji}
                  </span>
                )}
              </span>
            );
          })}
        </span>
      </div>
    </AbsoluteFill>
  );
};
