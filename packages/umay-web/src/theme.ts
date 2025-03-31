import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// Modern ve profesyonel bir renk paleti
const config = defineConfig({
  theme: {
    // Define keyframes for animations
    keyframes: {
      fadeInUp: {
        from: { opacity: "0", transform: "translateY(20px)" },
        to: { opacity: "1", transform: "translateY(0)" },
      },
      fadeOutUp: {
        from: { opacity: "1", transform: "translateY(0)" },
        to: { opacity: "0", transform: "translateY(-20px)" },
      },
    },
    tokens: {
      colors: {
        // Ana marka rengi - Zarif mavi
        brand: {
          50: { value: "#f0f9ff" },
          100: { value: "#e0f2fe" },
          200: { value: "#bae6fd" },
          300: { value: "#7dd3fc" },
          400: { value: "#38bdf8" },
          500: { value: "#0ea5e9" },
          600: { value: "#0284c7" },
          700: { value: "#0369a1" },
          800: { value: "#075985" },
          900: { value: "#0c4a6e" },
          950: { value: "#082f49" },
        },
        // İkincil renk - Yumuşak lavanta
        secondary: {
          50: { value: "#faf5ff" },
          100: { value: "#f3e8ff" },
          200: { value: "#e9d5ff" },
          300: { value: "#d8b4fe" },
          400: { value: "#c084fc" },
          500: { value: "#a855f7" },
          600: { value: "#9333ea" },
          700: { value: "#7e22ce" },
          800: { value: "#6b21a8" },
          900: { value: "#581c87" },
          950: { value: "#3b0764" },
        },
        // Vurgu rengi - Yeşil
        accent: {
          50: { value: "#f0fdf4" },
          100: { value: "#dcfce7" },
          200: { value: "#bbf7d0" },
          300: { value: "#86efac" },
          400: { value: "#4ade80" },
          500: { value: "#22c55e" },
          600: { value: "#16a34a" },
          700: { value: "#15803d" },
          800: { value: "#166534" },
          900: { value: "#14532d" },
          950: { value: "#052e16" },
        },
        // Nötr renkler - Daha sıcak gri
        neutral: {
          50: { value: "#fafaf9" },
          100: { value: "#f5f5f4" },
          200: { value: "#e7e5e4" },
          300: { value: "#d6d3d1" },
          400: { value: "#a8a29e" },
          500: { value: "#78716c" },
          600: { value: "#57534e" },
          700: { value: "#44403c" },
          800: { value: "#292524" },
          900: { value: "#1c1917" },
          950: { value: "#0c0a09" },
        },
      },
      // Animations
      animations: {
        fadeInUp: { value: "fadeInUp 0.5s forwards" },
        fadeOutUp: { value: "fadeOutUp 0.5s forwards" },
      },
      // Yazı tipleri
      fonts: {
        heading: { value: "'Inter', sans-serif" },
        body: { value: "'Inter', sans-serif" },
        mono: { value: "'Inter', monospace" },
      },
      // Gölgeler
      shadows: {
        xs: { value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
        sm: {
          value:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        },
        md: {
          value:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
        lg: {
          value:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
        xl: {
          value:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
        "2xl": { value: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" },
      },
    },
    semanticTokens: {
      colors: {
        // Arkaplan renkleri
        "bg.default": {
          value: { base: "#ffffff", _dark: "#1a1b26" },
        },
        "bg.subtle": {
          value: { base: "#f8fafc", _dark: "#24283b" },
        },
        "bg.muted": {
          value: { base: "#f1f5f9", _dark: "#2a2e3f" },
        },
        "bg.card": {
          value: { base: "#ffffff", _dark: "#1e2235" },
        },
        "bg.highlight": {
          value: {
            base: "rgba(14, 165, 233, 0.08)",
            _dark: "rgba(14, 165, 233, 0.15)",
          },
        },

        // Yazı renkleri
        "text.default": {
          value: { base: "#334155", _dark: "#f1f5f9" },
        },
        "text.muted": {
          value: { base: "#64748b", _dark: "#94a3b8" },
        },
        "text.subtle": {
          value: { base: "#94a3b8", _dark: "#64748b" },
        },
        "text.brand": {
          value: { base: "{colors.brand.600}", _dark: "{colors.brand.400}" },
        },

        // Kenarlık renkleri
        "border.default": {
          value: { base: "#e2e8f0", _dark: "#2a2e3f" },
        },
        "border.muted": {
          value: { base: "#f1f5f9", _dark: "#374151" },
        },

        // Semantik renk paletleri
        brand: {
          solid: { value: "{colors.brand.600}" },
          contrast: { value: "{colors.neutral.50}" },
          fg: { value: "{colors.brand.700}" },
          muted: { value: "{colors.brand.100}" },
          subtle: { value: "{colors.brand.50}" },
          emphasized: { value: "{colors.brand.200}" },
          focusRing: { value: "{colors.brand.500}" },
        },
        secondary: {
          solid: { value: "{colors.secondary.600}" },
          contrast: { value: "{colors.neutral.50}" },
          fg: { value: "{colors.secondary.700}" },
          muted: { value: "{colors.secondary.100}" },
          subtle: { value: "{colors.secondary.50}" },
          emphasized: { value: "{colors.secondary.200}" },
          focusRing: { value: "{colors.secondary.500}" },
        },
        accent: {
          solid: { value: "{colors.accent.600}" },
          contrast: { value: "{colors.neutral.50}" },
          fg: { value: "{colors.accent.700}" },
          muted: { value: "{colors.accent.100}" },
          subtle: { value: "{colors.accent.50}" },
          emphasized: { value: "{colors.accent.200}" },
          focusRing: { value: "{colors.accent.500}" },
        },
      },
    },
  },
  // Küresel CSS ayarları
  cssVarsPrefix: "umay",
  globalCss: {
    ":root": {
      "--font-heading": "var(--umay-fonts-heading)",
      "--font-body": "var(--umay-fonts-body)",
      "--font-mono": "var(--umay-fonts-mono)",
    },
    "html, body": {
      bg: "bg.default",
      color: "text.default",
      colorScheme: "light dark",
      fontFamily: "var(--font-body)",
      lineHeight: 1.5,
      textRendering: "optimizeLegibility",
    },
    "h1, h2, h3, h4, h5, h6": {
      fontFamily: "var(--font-heading)",
      fontWeight: "600",
      lineHeight: 1.2,
    },
    "code, pre": {
      fontFamily: "var(--font-mono)",
    },
  },
});

export const system = createSystem(defaultConfig, config);
