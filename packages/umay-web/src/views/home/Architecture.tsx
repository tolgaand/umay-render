import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Flex,
  Icon,
  useToken,
} from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
  LuServer,
  LuMonitor,
  LuFileText,
  LuExternalLink,
  LuCloudCog,
  LuArrowRight,
} from "react-icons/lu";

export default function Architecture() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [activeNode, setActiveNode] = useState<number | null>(null);

  // Get token values for colors
  const [accentColor, purpleColor, blueColor, greenColor] = useToken("colors", [
    isDark ? "brand.400" : "brand.600",
    isDark ? "purple.400" : "purple.600",
    isDark ? "blue.400" : "blue.600",
    isDark ? "green.400" : "green.600",
  ]);

  // Theme colors for elements
  const iconBg = isDark ? "whiteAlpha.100" : "gray.50";
  const iconBgHover = isDark ? "whiteAlpha.200" : "brand.50";
  const bgColor = isDark ? "gray.800" : "white";
  const textMuted = isDark ? "gray.300" : "gray.500";
  const bgHighlight = isDark ? "gray.750" : "gray.50";
  const borderColor = isDark ? "whiteAlpha.100" : "gray.100";
  const flowPathColor = isDark ? "gray.600" : "gray.200";

  // Define animation values
  const pulseAnimation = "pulse 2s ease-in-out infinite";
  const flowAnimation = "flowRight 2s ease-in-out infinite";

  // Cycle through nodes for automatic animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => {
        if (prev === null || prev >= 3) return 0;
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Handle doc link click
  const handleOpenDocs = () => {
    window.open("https://docs.umay-render.io", "_blank");
  };

  // Architecture steps data
  const steps = [
    {
      id: 0,
      title: "Client",
      icon: LuMonitor,
      color: accentColor,
      description: "Browser / Server / Mobile Applications",
    },
    {
      id: 1,
      title: "API",
      icon: LuServer,
      color: purpleColor,
      description: "RESTful Endpoints for Document Generation",
    },
    {
      id: 2,
      title: "Puppeteer",
      icon: LuCloudCog,
      color: blueColor,
      description: "HTML Rendering & Processing Engine",
    },
    {
      id: 3,
      title: "Result",
      icon: LuFileText,
      color: greenColor,
      description: "PDF / PNG / JPEG / WebP Output Files",
    },
  ];

  // Manually trigger animation
  const handleNodeClick = (id: number) => {
    setActiveNode(id);
  };

  // Create the pulsing animation styles for active nodes
  const isPulsing = (nodeId: number) => {
    return nodeId === activeNode;
  };

  return (
    <Box
      py={{ base: 10, md: 16 }}
      position="relative"
      overflow="hidden"
      id="architecture"
    >
      {/* Decorative background elements */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        width="40%"
        height="40%"
        bg={`radial-gradient(circle, ${
          isDark ? "brand.900/10" : "brand.100/20"
        } 0%, transparent 70%)`}
        borderRadius="full"
        zIndex="0"
        filter="blur(40px)"
      />

      <Box
        position="absolute"
        bottom="-10%"
        left="-10%"
        width="50%"
        height="50%"
        bg={`radial-gradient(circle, ${
          isDark ? "purple.900/10" : "purple.100/20"
        } 0%, transparent 70%)`}
        borderRadius="full"
        zIndex="0"
        filter="blur(60px)"
      />

      <Container maxW="1100px" position="relative" zIndex="1">
        <VStack gap={6} textAlign="center" mb={{ base: 8, md: 10 }}>
          <Heading
            as="h2"
            fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
            fontWeight="bold"
            bgGradient={`linear(to-r, ${accentColor}, ${
              isDark ? "purple.400" : "purple.600"
            })`}
            bgClip="text"
          >
            Universal, Flexible Architecture
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            maxW="800px"
            color={textMuted}
          >
            Umay Render provides a powerful, adaptable solution for HTML to PDF
            conversion with a sophisticated architecture designed for
            performance and flexibility.
          </Text>
        </VStack>

        {/* Modern Horizontal Architecture Flowchart */}
        <Box
          bg={bgHighlight}
          borderRadius="2xl"
          borderWidth="1px"
          borderColor={borderColor}
          p={{ base: 6, md: 8 }}
          mb={10}
          mx="auto"
          boxShadow={isDark ? "lg" : "md"}
          position="relative"
          h={{ base: "auto", md: "220px" }}
          overflow="hidden"
        >
          {/* Horizontal connector line */}
          <Box
            position="absolute"
            top="50%"
            left="10%"
            right="10%"
            height="2px"
            bg={flowPathColor}
            transform="translateY(-50%)"
            display={{ base: "none", md: "block" }}
          />

          {/* Data flow particles with correct positioning */}
          {activeNode !== null && activeNode < 3 && (
            <>
              <Box
                position="absolute"
                top="50%"
                left={`calc(10% + ${(activeNode * 80) / 3}%)`}
                width="12px"
                height="12px"
                borderRadius="full"
                bg={steps[activeNode].color}
                animation={flowAnimation}
                display={{ base: "none", md: "block" }}
                zIndex={2}
              />
              <Box
                position="absolute"
                top="50%"
                left={`calc(10% + ${(activeNode * 80) / 3}%)`}
                width="8px"
                height="8px"
                borderRadius="full"
                bg={steps[activeNode].color}
                animation={flowAnimation}
                animationDelay="0.7s"
                display={{ base: "none", md: "block" }}
                zIndex={2}
              />
            </>
          )}

          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            gap={{ base: 6, md: 4 }}
            h="full"
          >
            {steps.map((step, index) => (
              <Flex
                key={step.id}
                direction="column"
                align="center"
                position="relative"
                zIndex={2}
                onClick={() => handleNodeClick(step.id)}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ transform: "translateY(-5px)" }}
                role="group"
              >
                <Flex
                  bg={iconBg}
                  color={step.color}
                  p={4}
                  borderRadius="full"
                  boxSize={{ base: "60px", md: "70px" }}
                  borderWidth="1px"
                  borderColor={isDark ? `${step.color}/30` : `${step.color}/20`}
                  justify="center"
                  align="center"
                  boxShadow={
                    isPulsing(step.id) ? `0 0 15px ${step.color}` : "none"
                  }
                  animation={isPulsing(step.id) ? pulseAnimation : undefined}
                  transition="all 0.3s"
                  _groupHover={{
                    bg: iconBgHover,
                    transform: "scale(1.05)",
                  }}
                >
                  <Icon as={step.icon} boxSize={6} />
                </Flex>

                <Text
                  fontWeight="semibold"
                  mt={3}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  {step.title}
                </Text>

                <Text
                  fontSize="xs"
                  color={textMuted}
                  textAlign="center"
                  maxW="150px"
                  mt={1}
                  opacity={{ base: 1, md: isPulsing(step.id) ? 1 : 0.7 }}
                  transition="opacity 0.3s"
                  _groupHover={{ opacity: 1 }}
                >
                  {step.description}
                </Text>

                {index < steps.length - 1 && (
                  <Icon
                    as={LuArrowRight}
                    position={{ base: "relative", md: "absolute" }}
                    top={{ md: "40%" }}
                    right={{ md: "-30px" }}
                    transform={{ md: "translateY(-50%)" }}
                    color={textMuted}
                    boxSize={5}
                    display={{ base: "none", md: "block" }}
                  />
                )}
              </Flex>
            ))}
          </Flex>
        </Box>

        {/* Feature highlights and call to action */}
        <Flex
          maxW="1000px"
          mx="auto"
          flexDir={{ base: "column", md: "row" }}
          gap={{ base: 6, md: 8 }}
          mb={8}
        >
          <Box
            flex="1"
            bg={bgColor}
            p={6}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow="md"
          >
            <VStack align="start" gap={4}>
              <Flex
                bg={isDark ? "whiteAlpha.100" : "brand.50"}
                color={accentColor}
                p={3}
                borderRadius="lg"
              >
                <Icon as={LuServer} boxSize={6} />
              </Flex>
              <Text fontSize="lg" fontWeight="bold">
                Self-Hosted Option
              </Text>
              <Text fontSize="sm" color={textMuted}>
                Deploy the entire rendering infrastructure on your own servers
                for complete control. Perfect for applications with strict data
                security requirements.
              </Text>
            </VStack>
          </Box>

          <Box
            flex="1"
            bg={bgColor}
            p={6}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow="md"
          >
            <VStack align="start" gap={4}>
              <Flex
                bg={isDark ? "whiteAlpha.100" : "blue.50"}
                color={isDark ? "blue.400" : "blue.600"}
                p={3}
                borderRadius="lg"
              >
                <Icon as={LuCloudCog} boxSize={6} />
              </Flex>
              <Text fontSize="lg" fontWeight="bold">
                API Integration
              </Text>
              <Text fontSize="sm" color={textMuted}>
                Simple RESTful API endpoints make it easy to integrate with your
                existing applications. Cloud-hosted options available for
                instant deployment.
              </Text>
            </VStack>
          </Box>

          <Box
            flex="1"
            bg={bgColor}
            p={6}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow="md"
          >
            <VStack align="start" gap={4}>
              <Flex
                bg={isDark ? "whiteAlpha.100" : "green.50"}
                color={isDark ? "green.400" : "green.600"}
                p={3}
                borderRadius="lg"
              >
                <Icon as={LuFileText} boxSize={6} />
              </Flex>
              <Text fontSize="lg" fontWeight="bold">
                Multiple Output Formats
              </Text>
              <Text fontSize="sm" color={textMuted}>
                Convert your HTML to various formats including PDF, PNG, JPEG,
                and WebP with pixel-perfect rendering and consistent results.
              </Text>
            </VStack>
          </Box>
        </Flex>

        <VStack gap={4} mt={6}>
          <Flex alignItems="center">
            <Button
              colorPalette="brand"
              size="lg"
              variant="solid"
              onClick={handleOpenDocs}
              rounded="full"
              px={8}
            >
              Explore the API Documentation
            </Button>
            <Icon
              as={LuExternalLink}
              ml={2}
              color={isDark ? "brand.400" : "brand.600"}
            />
          </Flex>
          <Text fontSize="sm" color={textMuted}>
            Comprehensive guides and examples to get you started
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
