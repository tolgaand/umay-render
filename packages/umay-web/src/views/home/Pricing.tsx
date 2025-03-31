import {
  Box,
  Button,
  Container,
  Grid,
  HStack,
  Text,
  VStack,
  Badge,
  Card,
  Separator,
} from "@chakra-ui/react";
import { LuArrowRight, LuCheck, LuGithub } from "react-icons/lu";
import { useColorModeValue } from "../../components/ui/color-mode";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Pricing() {
  const pricingRef = useRef<HTMLDivElement>(null);

  // Theme colors
  const primaryColor = useColorModeValue("brand.solid", "brand.solid");
  const textColor = useColorModeValue("text.default", "text.default");
  const mutedTextColor = useColorModeValue("text.muted", "text.muted");
  const cardBg = useColorModeValue("white", "bg.card");
  const borderColor = useColorModeValue("border.default", "border.default");

  // Setup animations
  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined" || !pricingRef.current) return;

    // Pricing section animation
    gsap.fromTo(
      pricingRef.current.querySelectorAll(".pricing-card"),
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.3,
        scrollTrigger: {
          trigger: pricingRef.current,
          start: "top 75%",
        },
      }
    );
  }, []);

  return (
    <Box py="20" id="pricing" ref={pricingRef}>
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
              Simple, Transparent Pricing
            </Text>
            <Text
              fontSize="lg"
              color={mutedTextColor}
              maxW="3xl"
              textAlign="center"
            >
              No hidden fees, no usage limits, no credit card required. Umay
              Render is 100% free and open-source.
            </Text>
          </VStack>

          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
            gap="8"
            w="full"
            maxW="4xl"
            mx="auto"
          >
            <Card.Root
              p="8"
              borderRadius="xl"
              shadow="lg"
              borderWidth="1px"
              borderColor={borderColor}
              bg={cardBg}
              className="pricing-card"
              transition="all 0.3s ease"
              _hover={{
                transform: "scale(1.02) translateY(-5px)",
                boxShadow: "xl",
              }}
            >
              <VStack gap="6" alignItems="flex-start">
                <VStack alignItems="flex-start" gap="1">
                  <Text fontSize="lg" color={mutedTextColor}>
                    Self-Hosted
                  </Text>
                  <Text fontSize="4xl" fontWeight="bold">
                    $0
                  </Text>
                  <Text color={mutedTextColor}>Forever free</Text>
                </VStack>

                <Separator />

                <VStack gap="4" alignItems="flex-start" w="full">
                  <Text fontSize="sm" fontWeight="medium">
                    INCLUDES:
                  </Text>

                  <VStack alignItems="flex-start" gap="3" w="full">
                    {[
                      "Unlimited conversions",
                      "All SDKs for every language",
                      "Complete source code",
                      "MIT license",
                      "Self-host on your own infrastructure",
                    ].map((item, i) => (
                      <HStack key={i} gap="2">
                        <Box as={LuCheck} color="green.500" />
                        <Text>{item}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </VStack>

                <Button
                  colorScheme="blue"
                  variant="outline"
                  size="lg"
                  w="full"
                  className="btn-highlight"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-3px)" }}
                >
                  View on GitHub <Box as={LuGithub} ml="2" />
                </Button>
              </VStack>
            </Card.Root>

            <Card.Root
              p="8"
              borderRadius="xl"
              shadow="lg"
              borderWidth="2px"
              borderColor={primaryColor}
              bg={useColorModeValue(cardBg, "rgba(99, 102, 241, 0.1)")}
              className="pricing-card"
              transition="all 0.3s ease"
              _hover={{
                transform: "scale(1.02) translateY(-5px)",
                boxShadow: "xl",
              }}
              position="relative"
              _after={{
                content: '""',
                position: "absolute",
                top: "-10px",
                right: "-10px",
                width: "100px",
                height: "100px",
                background: useColorModeValue(
                  "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(255,255,255,0) 70%)",
                  "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(0,0,0,0) 70%)"
                ),
                zIndex: 0,
                borderRadius: "50%",
              }}
            >
              <VStack gap="6" alignItems="flex-start">
                <Badge colorScheme="blue" px="2" py="1" borderRadius="full">
                  RECOMMENDED
                </Badge>
                <VStack alignItems="flex-start" gap="1">
                  <Text fontSize="lg" color={mutedTextColor}>
                    Cloud Service
                  </Text>
                  <Text fontSize="4xl" fontWeight="bold">
                    $0
                  </Text>
                  <Text color={mutedTextColor}>Forever free</Text>
                </VStack>

                <Separator />

                <VStack gap="4" alignItems="flex-start" w="full">
                  <Text fontSize="sm" fontWeight="medium">
                    INCLUDES:
                  </Text>

                  <VStack alignItems="flex-start" gap="3" w="full">
                    {[
                      "Unlimited conversions",
                      "All SDKs for every language",
                      "No deployment or maintenance",
                      "Global CDN for fast delivery",
                      "Dedicated API endpoint",
                      "Automatic updates",
                    ].map((item, i) => (
                      <HStack key={i} gap="2">
                        <Box as={LuCheck} color="green.500" />
                        <Text>{item}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </VStack>

                <Button
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  className="btn-highlight"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-3px)" }}
                >
                  Get Started Now <Box as={LuArrowRight} ml="2" />
                </Button>
              </VStack>
            </Card.Root>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}
