import { Box } from "@chakra-ui/react";
import { HeroHeader } from "./hero/components/HeroHeader";
import { CodeExample } from "./hero/components/CodeExample";
import { HeroDecoration } from "./hero/components/HeroDecoration";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Hero() {
  // Add a ref to track if animations were already run
  const animatedRef = useRef(false);

  // Setup animations when component mounts
  useEffect(() => {
    // Only run on client-side and only once
    if (typeof window === "undefined" || animatedRef.current) return;

    const elements = document.querySelectorAll("[data-animate='true']");
    const codeEditor = document.querySelector("[data-code-editor='true']");
    const decorations = document.querySelectorAll(".hero-decoration");

    // Create a single timeline for better control
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        // Mark animations as completed
        animatedRef.current = true;
      },
    });

    // Hero section animations
    if (elements.length) {
      tl.fromTo(
        elements,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 }
      );
    }

    // Code editor animation
    if (codeEditor) {
      tl.fromTo(
        codeEditor,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.3" // Start a bit earlier
      );
    }

    // Animate SVG decorations
    if (decorations.length) {
      tl.fromTo(
        decorations,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1 },
        "-=0.5" // Start earlier
      );
    }

    // Cleanup function
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <Box
      as="section"
      position="relative"
      py={{ base: "10", md: "20" }}
      overflow="hidden"
    >
      {/* Background decorations */}
      <HeroDecoration />

      {/* Main content */}
      <Box
        maxW="1200px"
        mx="auto"
        px={{ base: "6", md: "8" }}
        position="relative"
        zIndex="1"
      >
        {/* Header section with title, description and buttons */}
        <HeroHeader />

        {/* Code example section with tabbed interface */}
        <CodeExample />
      </Box>
    </Box>
  );
}

export default Hero;
