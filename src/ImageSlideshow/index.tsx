import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// Lista obrazów z public/images
const IMAGES = [
  "images/1.jpg",
  "images/2af44d3a-ef54-42c7-ae39-28f542f381c4.jpg",
  "images/3f2b52c8-2f6a-409e-a801-dbf131bbf051.jpg",
  "images/4debd2b1-c282-44d2-aa25-38bbf63e7bef.jpg",
  "images/4e23f2ef-4bab-4f50-a27f-800d6cc7914a.jpg",
  "images/5aeac252-f42e-4eb7-ac2c-d8e83e7968d4.jpg",
  "images/15aa6d5e-6ba4-488c-9f50-e350159b0ed8.jpg",
  "images/53c3a25c-0749-49d7-ab89-d89427dc442e.jpg",
  "images/69bd7856-e75b-4d0f-be89-279766b06420.jpg",
  "images/93ae69e9-a94d-483a-9cd5-b6b735349a95.jpg",
  "images/687cf484-3efd-4181-abda-caeab679f721.jpg",
  "images/842cae21-1539-40eb-8e94-90f77aefd1f2.jpg",
  "images/a20a30b8-d906-455e-8a5a-f27effb88615.jpg",
  "images/bc784ba5-eb08-48e3-a526-4795141621d6.jpg",
  "images/c0ac841b-78cb-4865-a011-135a09a49d2f.jpg",
  "images/c26ddb38-ad59-4636-a31c-4b8cf303b585.jpg",
  "images/d32831b5-4df8-465b-b2b6-f42ba12a1343.jpg",
  "images/db19ece7-823e-4e30-8d66-385347b43cc4.jpg",
  "images/e482c4d1-2fcb-4d99-b090-4576b2b9ea38.jpg",
  "images/f970bde6-ce2b-406c-b4e6-97ccb3d48059.jpg",
];

// Czas wyświetlania każdego obrazu w sekundach
const IMAGE_DURATION_SECONDS = 3;

// Typy efektów przejścia
type TransitionEffect = "zoom" | "pan" | "rotate" | "fade" | "slide";

// Komponent pojedynczego obrazu z efektem
const ImageWithEffect: React.FC<{
  src: string;
  effect: TransitionEffect;
  index: number;
}> = ({ src, effect, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Progress od 0 do 1 w trakcie wyświetlania obrazu
  const progress = frame / (IMAGE_DURATION_SECONDS * fps);

  // Efekt wejścia (spring animation)
  const enterProgress = spring({
    frame,
    fps,
    config: {
      damping: 15,
      stiffness: 100,
    },
  });

  // Różne efekty w zależności od typu
  let transform = "";
  let opacity = 1;

  switch (effect) {
    case "zoom": {
      // Powolne przybliżanie
      const scale = interpolate(progress, [0, 1], [1, 1.3], {
        extrapolateRight: "clamp",
      });
      transform = `scale(${scale})`;
      break;
    }

    case "pan": {
      // Przesuwanie z lewej do prawej
      const translateX = interpolate(progress, [0, 1], [-100, 100], {
        extrapolateRight: "clamp",
      });
      transform = `translateX(${translateX}px) scale(1.2)`;
      break;
    }

    case "rotate": {
      // Delikatny obrót
      const rotate = interpolate(progress, [0, 1], [-5, 5], {
        extrapolateRight: "clamp",
      });
      const scaleRotate = interpolate(progress, [0, 1], [1.1, 1.2], {
        extrapolateRight: "clamp",
      });
      transform = `rotate(${rotate}deg) scale(${scaleRotate})`;
      break;
    }

    case "fade": {
      // Fade in/out
      opacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0], {
        extrapolateRight: "clamp",
      });
      transform = `scale(1.1)`;
      break;
    }

    case "slide": {
      // Slide z góry
      const translateY = interpolate(progress, [0, 1], [-50, 50], {
        extrapolateRight: "clamp",
      });
      transform = `translateY(${translateY}px) scale(1.15)`;
      break;
    }
  }

  // Efekt wejścia (scale z spring)
  const enterScale = interpolate(enterProgress, [0, 1], [0.8, 1]);
  const enterOpacity = interpolate(enterProgress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${enterScale})`,
          opacity: enterOpacity,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform,
            opacity,
          }}
        />
      </div>

      {/* Overlay gradient dla lepszej czytelności */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Numer obrazu */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          right: 50,
          color: "white",
          fontSize: 40,
          fontFamily: "sans-serif",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
          opacity: interpolate(enterProgress, [0, 1], [0, 0.7]),
        }}
      >
        {index + 1} / {IMAGES.length}
      </div>
    </AbsoluteFill>
  );
};

// Główny komponent slideshow
export const ImageSlideshow: React.FC = () => {
  const { fps } = useVideoConfig();

  // Efekty przejścia dla każdego obrazu (cyklicznie)
  const effects: TransitionEffect[] = [
    "zoom",
    "pan",
    "rotate",
    "fade",
    "slide",
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* Audio - voiceover */}
      <Audio
        src={staticFile("images/618c68eb-1f57-4dca-bf80-6d9c54280eea.mp3")}
      />

      {/* Slajdy z obrazami */}
      {IMAGES.map((image, index) => {
        const startFrame = index * IMAGE_DURATION_SECONDS * fps;
        const effect = effects[index % effects.length];

        return (
          <Sequence
            key={image}
            from={startFrame}
            durationInFrames={IMAGE_DURATION_SECONDS * fps}
          >
            <ImageWithEffect src={image} effect={effect} index={index} />
          </Sequence>
        );
      })}

      {/* Vignette effect na całym filmie */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 150px rgba(0,0,0,0.8)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// Obliczanie metadanych (czas trwania na podstawie audio)
export const calculateImageSlideshowMetadata = async () => {
  const fps = 30;
  const durationInSeconds = IMAGES.length * IMAGE_DURATION_SECONDS;

  return {
    fps,
    durationInFrames: Math.floor(durationInSeconds * fps),
  };
};
