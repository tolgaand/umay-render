import { Box, Button, Container, HStack, Text, VStack } from "@chakra-ui/react";
import { LuArrowRight, LuGithub } from "react-icons/lu";
import { useColorModeValue } from "../../components/ui/color-mode";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  solarizedlight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Link as ChakraLink } from "@chakra-ui/react";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const codeExample = `import { UmaySDK } from 'umay-render';
  
const umay = new UmaySDK();
const result = await umay.render({
  html: '<h1>Hello World</h1>',
  outputFormat: 'pdf'
});`;

// SVG components for decorative elements
function HeroDecoration({ color }: { color: string }) {
  return (
    <Box
      position="absolute"
      width="full"
      height="full"
      zIndex="0"
      overflow="hidden"
      inset="0"
    >
      {/* Background gradients */}
      <Box
        position="absolute"
        width="60%"
        height="60%"
        top="-20%"
        right="-20%"
        opacity="0.3"
        borderRadius="full"
        background={`radial-gradient(circle, ${color} 0%, transparent 70%)`}
        zIndex="1"
      />
      <Box
        position="absolute"
        width="40%"
        height="40%"
        bottom="-10%"
        left="-10%"
        opacity="0.25"
        borderRadius="full"
        background={`radial-gradient(circle, ${color} 0%, transparent 70%)`}
        zIndex="1"
      />

      {/* Top right blob */}
      <Box
        position="absolute"
        top="5%"
        right="5%"
        width="200px"
        height="200px"
        opacity="0.35"
        zIndex="1"
        transform="rotate(10deg)"
        className="hero-decoration"
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill={color}
            d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,89.4,-0.4C88.8,15.6,84.9,31.2,76.8,44.4C68.6,57.6,56.2,68.5,42.1,74.8C28.1,81.1,14,82.9,-0.2,83.2C-14.5,83.5,-29,82.4,-42,76.3C-55,70.3,-66.5,59.4,-73.3,45.8C-80.1,32.2,-82.2,16.1,-82.2,0C-82.2,-16.1,-80.1,-32.2,-73.1,-45.5C-66.1,-58.9,-54.3,-69.4,-40.6,-76.7C-26.9,-83.9,-13.4,-87.9,1,-89.5C15.3,-91.1,30.6,-83.5,44.7,-76.4Z"
            transform="translate(100 100)"
          />
        </svg>
      </Box>

      {/* Bottom left blob */}
      <Box
        position="absolute"
        bottom="10%"
        left="5%"
        width="180px"
        height="180px"
        opacity="0.35"
        zIndex="1"
        transform="rotate(-15deg)"
        className="hero-decoration"
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill={color}
            d="M47.7,-73.2C62.1,-66.3,74.5,-54.5,79.8,-40.1C85.2,-25.8,83.5,-8.9,79.9,6.6C76.3,22.1,70.8,36.2,61.4,47.1C52.1,58,38.8,65.7,24.4,70.5C10,75.3,-5.5,77.2,-21.4,74.8C-37.3,72.5,-53.6,66,-65,54.3C-76.4,42.7,-83,25.8,-85.1,8.1C-87.3,-9.6,-85,-28,-76.3,-42.5C-67.5,-57.1,-52.1,-67.6,-36.6,-73.8C-21.1,-80,-5.3,-81.8,9.3,-78.2C23.9,-74.5,33.3,-80.1,47.7,-73.2Z"
            transform="translate(100 100)"
          />
        </svg>
      </Box>

      {/* Middle right decorative shape */}
      <Box
        position="absolute"
        width="15%"
        height="15%"
        top="40%"
        right="15%"
        opacity="0.25"
        zIndex="1"
        className="hero-decoration"
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill={color}
            d="M45.3,-76.2C59.9,-70,73.5,-59.6,81.1,-45.9C88.8,-32.3,90.4,-16.2,88.7,-1.2C87,13.9,81.9,27.9,73.5,39.5C65.1,51.2,53.3,60.5,40.2,67.6C27.1,74.7,13.5,79.6,-0.7,80.8C-14.9,82,-29.8,79.5,-43.7,73.2C-57.5,66.8,-70.3,56.6,-77.1,43.3C-83.9,30,-84.7,15,-82.9,0.9C-81.2,-13.2,-77,-26.3,-69.9,-37.9C-62.8,-49.5,-52.8,-59.4,-40.8,-67.1C-28.8,-74.8,-14.4,-80.1,0.3,-80.7C15,-81.3,30.6,-82.3,45.3,-76.2Z"
            transform="translate(100 100)"
          />
        </svg>
      </Box>

      {/* Bottom right small blob */}
      <Box
        position="absolute"
        width="12%"
        height="12%"
        bottom="20%"
        right="20%"
        opacity="0.2"
        zIndex="1"
        className="hero-decoration"
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill={color}
            d="M47.7,-79.7C62.4,-71.9,75.5,-60.9,83.2,-46.7C91,-32.5,93.4,-16.2,91.5,-1.1C89.6,14,83.3,28.1,74.6,40.1C65.9,52.2,54.8,62.3,41.7,70C28.6,77.8,13.3,83.2,-0.9,84.6C-15,85.9,-30.1,83.2,-44.4,76.7C-58.8,70.2,-72.5,59.9,-81,46.2C-89.5,32.4,-92.7,16.2,-92.6,0C-92.5,-16.2,-89,-32.3,-80.2,-45.1C-71.5,-57.9,-57.5,-67.3,-42.7,-74.8C-27.8,-82.3,-13.9,-87.9,0.9,-89.4C15.7,-91,31.1,-87.5,47.7,-79.7Z"
            transform="translate(100 100)"
          />
        </svg>
      </Box>

      {/* Top left small blob */}
      <Box
        position="absolute"
        width="20%"
        height="20%"
        top="20%"
        left="10%"
        opacity="0.25"
        zIndex="1"
        className="hero-decoration"
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill={color}
            d="M45.3,-76.2C59.9,-70,73.5,-59.6,81.1,-45.9C88.8,-32.3,90.4,-16.2,88.7,-1.2C87,13.9,81.9,27.9,73.5,39.5C65.1,51.2,53.3,60.5,40.2,67.6C27.1,74.7,13.5,79.6,-0.7,80.8C-14.9,82,-29.8,79.5,-43.7,73.2C-57.5,66.8,-70.3,56.6,-77.1,43.3C-83.9,30,-84.7,15,-82.9,0.9C-81.2,-13.2,-77,-26.3,-69.9,-37.9C-62.8,-49.5,-52.8,-59.4,-40.8,-67.1C-28.8,-74.8,-14.4,-80.1,0.3,-80.7C15,-81.3,30.6,-82.3,45.3,-76.2Z"
            transform="translate(100 100)"
          />
        </svg>
      </Box>

      {/* Mid bottom small blob */}
      <Box
        position="absolute"
        width="18%"
        height="18%"
        bottom="30%"
        right="45%"
        opacity="0.2"
        zIndex="1"
        className="hero-decoration"
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill={color}
            d="M47.7,-79.7C62.4,-71.9,75.5,-60.9,83.2,-46.7C91,-32.5,93.4,-16.2,91.5,-1.1C89.6,14,83.3,28.1,74.6,40.1C65.9,52.2,54.8,62.3,41.7,70C28.6,77.8,13.3,83.2,-0.9,84.6C-15,85.9,-30.1,83.2,-44.4,76.7C-58.8,70.2,-72.5,59.9,-81,46.2C-89.5,32.4,-92.7,16.2,-92.6,0C-92.5,-16.2,-89,-32.3,-80.2,-45.1C-71.5,-57.9,-57.5,-67.3,-42.7,-74.8C-27.8,-82.3,-13.9,-87.9,0.9,-89.4C15.7,-91,31.1,-87.5,47.7,-79.7Z"
            transform="translate(100 100)"
          />
        </svg>
      </Box>
    </Box>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["Invoices", "Reports", "Contracts", "Statements"];

  // Theme colors
  const primaryColor = useColorModeValue("brand.600", "brand.400");
  const bgSection = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const subtleBg = useColorModeValue("gray.100", "gray.800");
  const codeTheme = useColorModeValue(solarizedlight, vscDarkPlus);

  // SVG decoration color
  const decorationColor = useColorModeValue("#3182CE", "#63B3ED");

  // Animate words cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Setup animations when component mounts
  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined" || !heroRef.current) return;

    const elements = heroRef.current.querySelectorAll("[data-animate='true']");

    // Hero section animations
    gsap.fromTo(
      elements,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
      }
    );

    // Code editor animation
    gsap.fromTo(
      heroRef.current.querySelector("[data-code-editor='true']"),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "power2.out" }
    );

    // Animate SVG decorations
    gsap.fromTo(
      heroRef.current.querySelectorAll(".hero-decoration"),
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "power2.out" }
    );
  }, []);

  return (
    <Box
      bg={bgSection}
      py={{ base: "10", md: "16" }}
      ref={heroRef}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative SVG background */}
      <HeroDecoration color={decorationColor} />

      <Container maxW="container.xl" position="relative" zIndex="10">
        {/* Hero Header Section */}
        <VStack gap="6" align="center" mb="12">
          <VStack
            gap="4"
            textAlign="center"
            maxW="900px"
            mx="auto"
            data-animate="true"
          >
            <Text
              as="h1"
              fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              lineHeight="1.1"
            >
              Transform HTML to PDF for{" "}
              <Box
                as="span"
                display="inline-block"
                position="relative"
                color={primaryColor}
              >
                {words.map((word, index) => (
                  <Text
                    key={index}
                    as="span"
                    position="absolute"
                    left="0"
                    top="0"
                    opacity={index === currentWord ? 1 : 0}
                    transform={
                      index === currentWord
                        ? "translateY(0)"
                        : index < currentWord ||
                          (currentWord === 0 && index === words.length - 1)
                        ? "translateY(-20px)"
                        : "translateY(20px)"
                    }
                    transition="all 0.4s ease"
                    animation={index === currentWord ? "fadeInUp" : undefined}
                  >
                    {word}
                  </Text>
                ))}
                <Box as="span" visibility="hidden">
                  {words[0]}
                </Box>
              </Box>
            </Text>

            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={mutedTextColor}
              maxW="800px"
              lineHeight="1.6"
            >
              Generate pixel-perfect PDFs from HTML with our enterprise-grade
              rendering engine. Ideal for invoices, financial reports, and
              automated document generation.
            </Text>

            <HStack gap="4" pt="4">
              <Button
                size={{ base: "md", md: "lg" }}
                colorScheme="blue"
                rounded="full"
                _hover={{
                  transform: "translateY(-3px)",
                  boxShadow: "lg",
                }}
                transition="all 0.3s"
              >
                Get Started{" "}
                <Box as={LuArrowRight} display="inline-block" ml="2" />
              </Button>
              <ChakraLink
                href="https://github.com/tolgaand/umay-render"
                target="_blank"
              >
                <Button
                  size={{ base: "md", md: "lg" }}
                  variant="outline"
                  rounded="full"
                  borderColor={primaryColor}
                  color={primaryColor}
                  _hover={{
                    bg: useColorModeValue("blue.50", "blue.900"),
                    transform: "translateY(-3px)",
                  }}
                  transition="all 0.3s"
                >
                  View on GitHub{" "}
                  <Box as={LuGithub} display="inline-block" ml="2" />
                </Button>
              </ChakraLink>
            </HStack>
          </VStack>
        </VStack>

        {/* Code Example Section */}
        <Box data-code-editor="true" maxW="800px" mx="auto" mb="10">
          <Box
            border="1px"
            borderColor={borderColor}
            rounded="xl"
            overflow="hidden"
            bgColor={cardBg}
            shadow="xl"
            position="relative"
            transition="all 0.5s"
            backdropFilter="blur(8px)"
            bg={useColorModeValue(
              "rgba(255, 255, 255, 0.9)",
              "rgba(26, 32, 44, 0.8)"
            )}
            _hover={{
              transform: "translateY(-5px)",
              boxShadow: "2xl",
            }}
          >
            <Box bg={subtleBg} py="2" px="4">
              <HStack gap="2" justifyContent="space-between">
                <HStack>
                  <Box w="3" h="3" borderRadius="full" bg="red.500" />
                  <Box w="3" h="3" borderRadius="full" bg="yellow.500" />
                  <Box w="3" h="3" borderRadius="full" bg="green.500" />
                </HStack>
                <Text fontSize="xs" color={mutedTextColor}>
                  server.js
                </Text>
              </HStack>
            </Box>
            <Box position="relative" zIndex="1">
              <SyntaxHighlighter
                language="javascript"
                style={codeTheme}
                customStyle={{
                  margin: 0,
                  padding: "16px",
                  background: "transparent",
                  fontSize: "14px",
                }}
              >
                {codeExample}
              </SyntaxHighlighter>
            </Box>
            <Box
              position="absolute"
              bottom="3"
              right="3"
              bg={primaryColor}
              color="white"
              py="1"
              px="3"
              borderRadius="full"
              fontSize="xs"
              fontWeight="bold"
              opacity="0.9"
            >
              Ready to use
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
