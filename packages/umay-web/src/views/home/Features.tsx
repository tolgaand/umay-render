import { Box, Container, Grid, Text, VStack, Card } from "@chakra-ui/react";
import { LuZap, LuInfinity, LuGlobe, LuShield } from "react-icons/lu";
import { useColorModeValue } from "../../components/ui/color-mode";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Features() {
  // Refs for animations
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Theme colors
  const textColor = useColorModeValue("text.default", "text.default");
  const mutedTextColor = useColorModeValue("text.muted", "text.muted");
  const cardBg = useColorModeValue("white", "bg.card");
  const borderColor = useColorModeValue("border.default", "border.default");
  const featureBgColor = useColorModeValue("bg.subtle", "bg.default");
  const featureIconBg = useColorModeValue("brand.subtle", "brand.subtle");
  const featureIconColor = useColorModeValue("brand.solid", "brand.solid");

  const features = [
    {
      icon: LuZap,
      title: "High-Performance Rendering",
      description:
        "Convert HTML to PDF with lightning-fast speed and professional quality.",
    },
    {
      icon: LuInfinity,
      title: "No Usage Limits",
      description:
        "Convert as many documents as you need without any usage restrictions.",
    },
    {
      icon: LuGlobe,
      title: "Multi-Language SDKs",
      description:
        "Official SDKs for JavaScript, Python, Go, Ruby, PHP and more.",
    },
    {
      icon: LuShield,
      title: "100% Open Source",
      description:
        "Fully open-source code under MIT License. Self-host or use our service.",
    },
  ];

  // Setup animations
  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") return;

    // Instead of looping through each feature element, animate the entire container with staggered children
    const featuresGrid = document.querySelector(".features-grid");
    if (featuresGrid) {
      const featureItems = featuresGrid.querySelectorAll(".feature-item");

      gsap.fromTo(
        featureItems,
        {
          y: 100,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: featuresGrid,
            start: "top 85%",
          },
        }
      );
    }
  }, []);

  return (
    <Box bg={featureBgColor} py="20" id="features">
      <Container maxW="container.xl">
        <VStack gap="16">
          <VStack gap="4">
            <Text
              as="h2"
              fontSize="3xl"
              fontWeight="bold"
              textAlign="center"
              color={textColor}
            >
              Why Choose Umay Render?
            </Text>
            <Text
              fontSize="lg"
              color={mutedTextColor}
              maxW="3xl"
              textAlign="center"
            >
              Umay Render provides a complete solution for HTML to PDF
              conversion with no limitations and enterprise-grade features,
              completely free of charge.
            </Text>
          </VStack>

          <Grid
            templateColumns={{
              base: "1fr",
              md: "1fr 1fr",
              lg: "repeat(4, 1fr)",
            }}
            gap="8"
            className="features-grid"
          >
            {features.map((feature, index) => (
              <Card.Root
                key={index}
                p="6"
                borderRadius="lg"
                shadow="md"
                height="100%"
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                transition="all 0.3s ease"
                _hover={{
                  transform: "translateY(-8px)",
                  boxShadow: "xl",
                  borderColor: "brand.solid",
                }}
                className="card-hover feature-item"
                ref={(el) => {
                  if (featureRefs.current) {
                    featureRefs.current[index] = el;
                  }
                }}
              >
                <VStack gap="4" alignItems="flex-start">
                  <Box
                    p="3"
                    borderRadius="lg"
                    bg={featureIconBg}
                    color={featureIconColor}
                  >
                    <Box as={feature.icon} boxSize="6" />
                  </Box>
                  <Text fontSize="xl" fontWeight="bold" color="brand.solid">
                    {feature.title}
                  </Text>
                  <Text color={mutedTextColor}>{feature.description}</Text>
                </VStack>
              </Card.Root>
            ))}
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}
