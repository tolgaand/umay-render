import {
  Box,
  Container,
  SimpleGrid,
  HStack,
  VStack,
  Heading,
  Text,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  LuFileOutput,
  LuCode,
  LuGlobe,
  LuSettings,
  LuLink,
  LuShieldCheck,
} from "react-icons/lu";
import { useTheme } from "next-themes";

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Theme colors for cards and elements
  const cardBg = isDark ? "gray.750" : "white";
  const iconBg = isDark ? "brand.900/20" : "brand.50";
  const iconColor = isDark ? "brand.400" : "brand.700";
  const textMuted = isDark ? "gray.300" : "gray.600";
  const borderColor = isDark ? "gray.700" : "gray.200";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const container = containerRef.current;
    const features = featuresRef.current.filter(Boolean);

    if (!container || features.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none",
      },
    });

    tl.fromTo(
      features,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }
    );

    return () => {
      tl.kill();
    };
  }, []);

  const features = [
    {
      title: "Universal Compatibility",
      description:
        "Works in both browser and Node.js environments with the same consistent API across platforms.",
      icon: LuGlobe,
    },
    {
      title: "Multiple Output Formats",
      description:
        "Convert HTML to PDF, PNG, JPEG, or WebP formats with pixel-perfect rendering quality.",
      icon: LuFileOutput,
    },
    {
      title: "TypeScript Support",
      description:
        "Full TypeScript type definitions and IntelliSense support for an enhanced development experience.",
      icon: LuCode,
    },
    {
      title: "Customization Options",
      description:
        "Configure viewport settings, page formats, margins, headers, footers, and more for perfect output.",
      icon: LuSettings,
    },
    {
      title: "Flexible Input",
      description:
        "Process raw HTML content or fetch from a URL with support for authentication and cookies.",
      icon: LuLink,
    },
    {
      title: "100% Free & Open Source",
      description:
        "No hidden costs, no usage limits, and complete freedom to self-host or use our free API service.",
      icon: LuShieldCheck,
    },
  ];

  return (
    <Box
      as="section"
      id="features"
      py={{ base: "16", md: "24" }}
      ref={containerRef}
    >
      <Container maxW="1200px" px={{ base: 4, md: 6 }}>
        <VStack gap={{ base: "10", md: "16" }} align="center">
          <Box textAlign="center" maxW="800px">
            <Heading
              as="h2"
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              mb="4"
            >
              High-Performance HTML to PDF Conversion
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={textMuted}
              maxW="750px"
              mx="auto"
            >
              Umay Render provides a lightweight, powerful SDK for converting
              HTML to PDF and images in both browser and Node.js environments
              with extensive customization options.
            </Text>
          </Box>

          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            gap="8"
            width="100%"
            mt="8"
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                py="6"
                px="6"
                borderRadius="lg"
                boxShadow="sm"
                transition="all 0.3s"
                _hover={{ transform: "translateY(-5px)", boxShadow: "md" }}
                height="100%"
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                ref={(el: HTMLDivElement | null) =>
                  (featuresRef.current[index] = el)
                }
              >
                <VStack gap="4" align="flex-start">
                  <HStack gap="3">
                    <Box p="3" borderRadius="md" bg={iconBg} color={iconColor}>
                      <Icon as={feature.icon} boxSize="5" />
                    </Box>
                    <Heading
                      as="h3"
                      fontSize={{ base: "lg", md: "xl" }}
                      fontWeight="bold"
                    >
                      {feature.title}
                    </Heading>
                  </HStack>
                  <Text color={textMuted}>{feature.description}</Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
