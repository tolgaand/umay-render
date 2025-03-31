import {
  Box,
  Text,
  VStack,
  Grid,
  Flex,
  HStack,
  Icon,
  Container,
} from "@chakra-ui/react";
import { LuFileCheck, LuZap } from "react-icons/lu";
import { useColorModeValue } from "../../components/ui/color-mode";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// PDF Document Component
function DocumentPreview() {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Box
      position="relative"
      width="100%"
      maxWidth="300px"
      mx="auto"
      data-animate="true"
    >
      <Box
        position="absolute"
        inset="2px 0 0 0"
        bg={bgColor}
        borderRadius="md"
        border="1px solid"
        borderColor={borderColor}
        transform="rotate(-3deg)"
        shadow="md"
        zIndex="1"
        height="calc(100% - 2px)"
      />
      <Box
        position="relative"
        zIndex="2"
        bg={bgColor}
        borderRadius="md"
        border="1px solid"
        borderColor={borderColor}
        shadow="lg"
        p="4"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "8px",
          bg: "blue.400",
          borderTopLeftRadius: "md",
          borderTopRightRadius: "md",
        }}
      >
        <VStack gap="2" alignItems="flex-start">
          <Text fontWeight="bold" fontSize="sm">
            INVOICE
          </Text>
          <HStack width="full" justifyContent="space-between">
            <Text fontSize="xs">Invoice #000123</Text>
            <Text fontSize="xs">June 12, 2023</Text>
          </HStack>
          <Box bg="gray.100" height="2px" width="full" my="1" />
          <HStack width="full" justifyContent="space-between">
            <Text fontSize="xs">Item</Text>
            <Text fontSize="xs">Amount</Text>
          </HStack>
          <HStack width="full" justifyContent="space-between">
            <Text fontSize="xs">Service Fee</Text>
            <Text fontSize="xs">$100.00</Text>
          </HStack>
          <HStack width="full" justifyContent="space-between">
            <Text fontSize="xs">Maintenance</Text>
            <Text fontSize="xs">$50.00</Text>
          </HStack>
          <Box bg="gray.100" height="2px" width="full" my="1" />
          <HStack width="full" justifyContent="space-between">
            <Text fontSize="xs" fontWeight="bold">
              Total
            </Text>
            <Text fontSize="xs" fontWeight="bold">
              $150.00
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}

export default function Showcase() {
  const showcaseRef = useRef<HTMLDivElement>(null);

  // Theme colors
  const primaryColor = useColorModeValue("brand.600", "brand.400");
  const bgSection = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Setup animations when component mounts
  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined" || !showcaseRef.current) return;

    const elements = showcaseRef.current.querySelectorAll(
      "[data-animate='true']"
    );

    // Animate showcase items
    gsap.fromTo(
      showcaseRef.current.querySelectorAll("[data-showcase='true']"),
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: showcaseRef.current,
          start: "top 80%",
        },
      }
    );

    // Animate headers
    gsap.fromTo(
      elements,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: showcaseRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <Box
      bg={bgSection}
      py={{ base: "14", md: "20" }}
      ref={showcaseRef}
      position="relative"
    >
      <Container maxW="container.xl">
        {/* Powerful Features Section */}
        <Box mb="16">
          <VStack gap="12" align="center" mb="8">
            <Text
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="bold"
              data-animate="true"
              color={primaryColor}
              pb="2"
              borderBottom="3px solid"
              borderColor={primaryColor}
            >
              Powerful Features
            </Text>

            <Grid
              templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
              gap={{ base: "10", lg: "16" }}
              width="full"
            >
              {/* Feature Showcase 1 */}
              <Flex
                gap="8"
                data-showcase="true"
                direction={{ base: "column", md: "row" }}
                align="center"
              >
                <DocumentPreview />
                <VStack align="flex-start" gap="4">
                  <Text fontSize="xl" fontWeight="bold">
                    Pixel-Perfect Rendering
                  </Text>
                  <Text color={mutedTextColor}>
                    Get identical results every time with our high-fidelity
                    rendering engine. Supports custom fonts, CSS media types,
                    and high DPI output.
                  </Text>
                  <HStack gap="4">
                    <HStack>
                      <Icon as={LuFileCheck} color="green.500" />
                      <Text fontSize="sm">High DPI</Text>
                    </HStack>
                    <HStack>
                      <Icon as={LuFileCheck} color="green.500" />
                      <Text fontSize="sm">Custom Fonts</Text>
                    </HStack>
                  </HStack>
                </VStack>
              </Flex>

              {/* Feature Showcase 2 */}
              <Flex
                gap="8"
                data-showcase="true"
                direction={{ base: "column", md: "row" }}
                align="center"
              >
                <Box
                  position="relative"
                  width="100%"
                  maxWidth="300px"
                  height="200px"
                  borderRadius="md"
                  border="1px solid"
                  borderColor={borderColor}
                  overflow="hidden"
                  bg={cardBg}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon
                    as={LuZap}
                    boxSize="16"
                    color={primaryColor}
                    opacity="0.3"
                  />
                  <Text position="absolute" fontWeight="bold" fontSize="lg">
                    Ultra Fast
                  </Text>
                </Box>
                <VStack align="flex-start" gap="4">
                  <Text fontSize="xl" fontWeight="bold">
                    Advanced Configuration
                  </Text>
                  <Text color={mutedTextColor}>
                    Full control over the rendering process with extensive
                    options for PDF generation. Customize page formats, margins,
                    headers, and more.
                  </Text>
                  <HStack gap="4">
                    <HStack>
                      <Icon as={LuFileCheck} color="green.500" />
                      <Text fontSize="sm">Custom Page Formats</Text>
                    </HStack>
                    <HStack>
                      <Icon as={LuFileCheck} color="green.500" />
                      <Text fontSize="sm">Flexible Margins</Text>
                    </HStack>
                  </HStack>
                </VStack>
              </Flex>
            </Grid>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
