import { Box } from "@chakra-ui/react";
import { useTheme } from "next-themes";

// Yenilenmiş dekorasyon bileşeni - daha teknolojik tema ile
export function HeroDecoration() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Tema renkleri
  const primaryColor = isDark ? "#63B3ED" : "#3182CE";
  const secondaryColor = isDark ? "#4299E1" : "#2B6CB0";
  const accentColor = isDark ? "#90CDF4" : "#4299E1";

  return (
    <Box
      position="absolute"
      width="100vw"
      height="110vh"
      top="-5vh"
      left="0"
      right="0"
      zIndex="0"
      overflow="hidden"
    >
      {/* Arka plan gradients */}
      <Box
        position="absolute"
        width="60%"
        height="60%"
        top="-20%"
        right="-10%"
        opacity="0.25"
        borderRadius="full"
        background={`radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`}
        zIndex="1"
      />

      <Box
        position="absolute"
        width="40%"
        height="40%"
        bottom="-10%"
        left="-5%"
        opacity="0.2"
        borderRadius="full"
        background={`radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`}
        zIndex="1"
      />

      {/* Teknoloji ve dönüşüm temalı dekoratif öğeler */}

      {/* Sağ üst köşe - Hexagon grid/ağ yapısı */}
      <Box
        position="absolute"
        top="10%"
        right="3%"
        width="250px"
        height="250px"
        opacity="0.3"
        zIndex="1"
        className="hero-decoration"
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="hexagonGrid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                fill="none"
                stroke={primaryColor}
                strokeWidth="0.5"
                d="M10,0 L20,5 L20,15 L10,20 L0,15 L0,5 Z"
              />
            </pattern>
          </defs>
          <rect x="0" y="0" width="200" height="200" fill="url(#hexagonGrid)" />
          <circle
            cx="100"
            cy="100"
            r="50"
            fill="none"
            stroke={accentColor}
            strokeWidth="1"
          />
          <circle
            cx="100"
            cy="100"
            r="75"
            fill="none"
            stroke={accentColor}
            strokeWidth="0.5"
          />
        </svg>
      </Box>

      {/* Sol alt - PDF/Dökuman dönüşüm simgesi */}
      <Box
        position="absolute"
        bottom="15%"
        left="3%"
        width="220px"
        height="220px"
        opacity="0.3"
        zIndex="1"
        className="hero-decoration"
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="40"
            y="40"
            width="120"
            height="140"
            rx="5"
            fill="none"
            stroke={primaryColor}
            strokeWidth="2"
          />
          <rect
            x="60"
            y="60"
            width="80"
            height="10"
            rx="2"
            fill={primaryColor}
          />
          <rect
            x="60"
            y="80"
            width="80"
            height="5"
            rx="2"
            fill={primaryColor}
            opacity="0.6"
          />
          <rect
            x="60"
            y="95"
            width="80"
            height="5"
            rx="2"
            fill={primaryColor}
            opacity="0.6"
          />
          <rect
            x="60"
            y="110"
            width="60"
            height="5"
            rx="2"
            fill={primaryColor}
            opacity="0.6"
          />
          <path
            d="M70,140 L130,140 L130,160 L70,160 Z"
            fill="none"
            stroke={accentColor}
            strokeWidth="2"
          />
          <path d="M80,140 L80,160" stroke={accentColor} strokeWidth="1" />
          <path d="M100,140 L100,160" stroke={accentColor} strokeWidth="1" />
          <path d="M120,140 L120,160" stroke={accentColor} strokeWidth="1" />
          <path d="M130,150 L150,150" stroke={accentColor} strokeWidth="2" />
          <path
            d="M145,145 L150,150 L145,155"
            fill="none"
            stroke={accentColor}
            strokeWidth="2"
          />
        </svg>
      </Box>

      {/* Sağ orta - Bağlantı/ağ yapısı */}
      <Box
        position="absolute"
        width="18%"
        height="18%"
        top="40%"
        right="2%"
        opacity="0.25"
        zIndex="1"
        className="hero-decoration"
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="8" fill={primaryColor} />
          <circle cx="50" cy="50" r="6" fill={primaryColor} />
          <circle cx="150" cy="50" r="6" fill={primaryColor} />
          <circle cx="50" cy="150" r="6" fill={primaryColor} />
          <circle cx="150" cy="150" r="6" fill={primaryColor} />

          <line
            x1="100"
            y1="100"
            x2="50"
            y2="50"
            stroke={primaryColor}
            strokeWidth="1"
          />
          <line
            x1="100"
            y1="100"
            x2="150"
            y2="50"
            stroke={primaryColor}
            strokeWidth="1"
          />
          <line
            x1="100"
            y1="100"
            x2="50"
            y2="150"
            stroke={primaryColor}
            strokeWidth="1"
          />
          <line
            x1="100"
            y1="100"
            x2="150"
            y2="150"
            stroke={primaryColor}
            strokeWidth="1"
          />

          <circle cx="75" cy="75" r="4" fill={secondaryColor} />
          <circle cx="125" cy="75" r="4" fill={secondaryColor} />
          <circle cx="75" cy="125" r="4" fill={secondaryColor} />
          <circle cx="125" cy="125" r="4" fill={secondaryColor} />
        </svg>
      </Box>

      {/* Sağ alt - Browser to PDF dönüşüm temasına uygun simge */}
      <Box
        position="absolute"
        width="18%"
        height="18%"
        bottom="20%"
        right="6%"
        opacity="0.25"
        zIndex="1"
        className="hero-decoration"
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="30"
            y="30"
            width="140"
            height="100"
            rx="5"
            fill="none"
            stroke={primaryColor}
            strokeWidth="2"
          />
          <rect
            x="30"
            y="30"
            width="140"
            height="20"
            rx="5"
            fill={primaryColor}
            opacity="0.2"
          />
          <circle cx="45" cy="40" r="5" fill={accentColor} />
          <circle cx="65" cy="40" r="5" fill={accentColor} />
          <rect
            x="45"
            y="65"
            width="110"
            height="5"
            rx="2"
            fill={primaryColor}
            opacity="0.5"
          />
          <rect
            x="45"
            y="80"
            width="80"
            height="5"
            rx="2"
            fill={primaryColor}
            opacity="0.5"
          />
          <rect
            x="45"
            y="95"
            width="100"
            height="5"
            rx="2"
            fill={primaryColor}
            opacity="0.5"
          />
          <rect
            x="45"
            y="110"
            width="60"
            height="5"
            rx="2"
            fill={primaryColor}
            opacity="0.5"
          />

          <path
            d="M120,150 L160,150 L160,170 L120,170 Z"
            fill="none"
            stroke={accentColor}
            strokeWidth="1.5"
          />
          <text
            x="125"
            y="164"
            fill={accentColor}
            style={{ fontSize: "14px", fontFamily: "monospace" }}
          >
            PDF
          </text>
          <path d="M100,150 L115,150" stroke={accentColor} strokeWidth="1.5" />
          <path
            d="M110,145 L115,150 L110,155"
            fill="none"
            stroke={accentColor}
            strokeWidth="1.5"
          />
        </svg>
      </Box>

      {/* Sol üst - Kod/programlama temasına uygun simge */}
      <Box
        position="absolute"
        width="24%"
        height="24%"
        top="15%"
        left="2%"
        opacity="0.2"
        zIndex="1"
        className="hero-decoration"
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="20"
            y="40"
            width="160"
            height="120"
            rx="5"
            fill="none"
            stroke={primaryColor}
            strokeWidth="1.5"
          />
          <rect
            x="20"
            y="40"
            width="160"
            height="20"
            rx="5"
            fill={primaryColor}
            opacity="0.1"
          />

          <text
            x="45"
            y="80"
            fill={primaryColor}
            style={{ fontSize: "12px", fontFamily: "monospace" }}
          >
            {"<html>"}
          </text>
          <text
            x="55"
            y="100"
            fill={primaryColor}
            style={{ fontSize: "12px", fontFamily: "monospace" }}
          >
            {"<body>"}
          </text>
          <text
            x="65"
            y="120"
            fill={primaryColor}
            style={{ fontSize: "12px", fontFamily: "monospace" }}
          >
            {"<div>"}
          </text>
          <text
            x="75"
            y="140"
            fill={primaryColor}
            style={{ fontSize: "12px", fontFamily: "monospace" }}
          >
            {"</div>"}
          </text>
          <text
            x="55"
            y="160"
            fill={primaryColor}
            style={{ fontSize: "12px", fontFamily: "monospace" }}
          >
            {"</body>"}
          </text>
          <text
            x="45"
            y="180"
            fill={primaryColor}
            style={{ fontSize: "12px", fontFamily: "monospace" }}
          >
            {"</html>"}
          </text>
        </svg>
      </Box>

      {/* Orta alt - Veri/grafik temasına uygun simge */}
      <Box
        position="absolute"
        width="18%"
        height="18%"
        bottom="28%"
        right="42%"
        opacity="0.2"
        zIndex="1"
        className="hero-decoration"
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <line
            x1="20"
            y1="180"
            x2="180"
            y2="180"
            stroke={primaryColor}
            strokeWidth="2"
          />
          <line
            x1="20"
            y1="20"
            x2="20"
            y2="180"
            stroke={primaryColor}
            strokeWidth="2"
          />

          <path
            d="M40,140 L80,100 L120,130 L160,60"
            fill="none"
            stroke={accentColor}
            strokeWidth="2"
          />
          <circle cx="40" cy="140" r="5" fill={accentColor} />
          <circle cx="80" cy="100" r="5" fill={accentColor} />
          <circle cx="120" cy="130" r="5" fill={accentColor} />
          <circle cx="160" cy="60" r="5" fill={accentColor} />

          <line
            x1="20"
            y1="140"
            x2="25"
            y2="140"
            stroke={primaryColor}
            strokeWidth="1"
          />
          <line
            x1="20"
            y1="100"
            x2="25"
            y2="100"
            stroke={primaryColor}
            strokeWidth="1"
          />
          <line
            x1="20"
            y1="60"
            x2="25"
            y2="60"
            stroke={primaryColor}
            strokeWidth="1"
          />

          <line
            x1="40"
            y1="180"
            x2="40"
            y2="175"
            stroke={primaryColor}
            strokeWidth="1"
          />
          <line
            x1="80"
            y1="180"
            x2="80"
            y2="175"
            stroke={primaryColor}
            strokeWidth="1"
          />
          <line
            x1="120"
            y1="180"
            x2="120"
            y2="175"
            stroke={primaryColor}
            strokeWidth="1"
          />
          <line
            x1="160"
            y1="180"
            x2="160"
            y2="175"
            stroke={primaryColor}
            strokeWidth="1"
          />
        </svg>
      </Box>
    </Box>
  );
}
