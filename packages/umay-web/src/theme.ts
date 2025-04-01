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
        // Gray tonları - Chakra v3 biçimlendirilmiş
        gray: {
          50: { value: "#fafafa" },
          100: { value: "#f4f4f5" },
          200: { value: "#e4e4e7" },
          300: { value: "#d4d4d8" },
          400: { value: "#a1a1aa" },
          500: { value: "#71717a" },
          600: { value: "#52525b" },
          650: { value: "#45454e" }, // Pricing icin eklenen
          700: { value: "#3f3f46" },
          750: { value: "#33333a" }, // Özel ara ton
          800: { value: "#27272a" },
          850: { value: "#202024" }, // Özel ara ton
          900: { value: "#18181b" },
          950: { value: "#09090b" },
        },
        // Gradient renkleri - Koyu mod
        darkFrom: { value: "#1A202C" },
        darkMid: { value: "#2D3748" },
        darkTo: { value: "#4A5568" },
        // Gradient renkleri - Açık mod
        lightFrom: { value: "#F7FAFC" },
        lightMid: { value: "#EDF2F7" },
        lightTo: { value: "#E2E8F0" },
      },
      // Container boyutları
      sizes: {
        container: {
          sm: { value: "640px" },
          md: { value: "768px" },
          lg: { value: "1024px" },
          xl: { value: "1280px" },
          "2xl": { value: "1536px" },
        },
      },
      // Animations
      animations: {
        fadeInUp: { value: "fadeInUp 0.5s forwards" },
        fadeOutUp: { value: "fadeOutUp 0.5s forwards" },
      },
      // Yazı tipleri - Modern tipografi sistemi
      fonts: {
        heading: { value: "'Outfit', 'Plus Jakarta Sans', sans-serif" },
        body: { value: "'Inter', sans-serif" },
        mono: { value: "'Space Grotesk', monospace" },
        // Saat yönünde özel font aileleri
        outfit: { value: "'Outfit', sans-serif" },
        jakarta: { value: "'Plus Jakarta Sans', sans-serif" },
        inter: { value: "'Inter', sans-serif" },
        grotesk: { value: "'Space Grotesk', monospace" },
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
        // Gradient semantik renkleri
        "page.from": {
          value: { base: "{colors.lightFrom}", _dark: "{colors.darkFrom}" },
        },
        "page.mid": {
          value: { base: "{colors.lightMid}", _dark: "{colors.darkMid}" },
        },
        "page.to": {
          value: { base: "{colors.lightTo}", _dark: "{colors.darkTo}" },
        },
        "hero.from": {
          value: { base: "{colors.lightFrom}", _dark: "{colors.darkFrom}" },
        },
        "hero.to": {
          value: { base: "{colors.lightMid}", _dark: "{colors.darkMid}" },
        },
        "features.from": {
          value: { base: "{colors.lightMid}", _dark: "{colors.darkMid}" },
        },
        "features.to": {
          value: { base: "{colors.lightFrom}", _dark: "{colors.darkFrom}" },
        },
        "architecture.from": {
          value: { base: "{colors.lightFrom}", _dark: "{colors.darkFrom}" },
        },
        "architecture.to": {
          value: { base: "{colors.lightMid}", _dark: "{colors.darkMid}" },
        },
        "pricing.from": {
          value: { base: "{colors.lightMid}", _dark: "{colors.darkMid}" },
        },
        "pricing.to": {
          value: { base: "{colors.lightFrom}", _dark: "{colors.darkTo}" },
        },
        "footer.from": {
          value: { base: "{colors.lightFrom}", _dark: "{colors.darkTo}" },
        },
        "footer.to": {
          value: { base: "{colors.lightMid}", _dark: "{colors.darkMid}" },
        },
        // Tablo arka plan renkleri
        "table.header": {
          value: { base: "{colors.gray.100}", _dark: "{colors.gray.650}" },
        },
        "table.cell": {
          value: { base: "white", _dark: "{colors.gray.700}" },
        },
        "table.border": {
          value: { base: "{colors.gray.200}", _dark: "{colors.gray.600}" },
        },
        "table.hover": {
          value: { base: "{colors.gray.50}", _dark: "{colors.gray.650}" },
        },
        "table.highlight": {
          value: { base: "{colors.brand.50}", _dark: "rgba(12, 74, 110, 0.3)" }, // brand.900/30
        },
        "table.highlightHover": {
          value: {
            base: "rgba(191, 219, 254, 0.7)",
            _dark: "rgba(12, 74, 110, 0.4)",
          }, // brand.100/70, brand.900/40
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
      "--font-outfit": "var(--umay-fonts-outfit)",
      "--font-jakarta": "var(--umay-fonts-jakarta)",
      "--font-inter": "var(--umay-fonts-inter)",
      "--font-grotesk": "var(--umay-fonts-grotesk)",
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
      fontWeight: "700",
      letterSpacing: "-0.015em",
    },
    "code, pre, kbd": {
      fontFamily: "var(--font-mono)",
    },
  },
});

export const system = createSystem(defaultConfig, config);
