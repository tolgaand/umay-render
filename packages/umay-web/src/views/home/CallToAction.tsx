import { Box, Button, Container, HStack, Text, VStack } from "@chakra-ui/react";
import { LuArrowRight } from "react-icons/lu";
import { useColorModeValue } from "../../components/ui/color-mode";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CallToAction() {
  const ctaRef = useRef<HTMLDivElement>(null);

  // Theme colors
  const primaryColor = useColorModeValue("brand.solid", "brand.solid");
  const textColor = useColorModeValue("text.default", "text.default");
  const mutedTextColor = useColorModeValue("text.muted", "text.muted");

  // Setup animations
  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined" || !ctaRef.current) return;

    // CTA section animation
    gsap.fromTo(
      ctaRef.current,
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 80%",
        },
      }
    );

    // Continuous floating animation for CTA
    gsap.to(ctaRef.current, {
      y: "-10px",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <Box
      bgGradient={useColorModeValue(
        "linear(to-b, bg.subtle, bg.muted)",
        "linear(to-b, bg.default, bg.subtle)"
      )}
      py="20"
    >
      <Container maxW="container.lg">
        <VStack
          bg={useColorModeValue("white", "bg.card")}
          p={{ base: "8", md: "12" }}
          borderRadius="2xl"
          shadow="xl"
          gap="8"
          textAlign="center"
          ref={ctaRef}
          position="relative"
          overflow="hidden"
          backdropFilter="blur(10px)"
          _before={{
            content: '""',
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "200px",
            height: "200px",
            background: useColorModeValue(
              "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(255,255,255,0) 70%)",
              "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(0,0,0,0) 70%)"
            ),
            borderRadius: "50%",
          }}
        >
          <VStack gap="4" zIndex="1">
            <Text as="h2" fontSize="3xl" fontWeight="bold" color={textColor}>
              Ready to Simplify Your Document Rendering?
            </Text>
            <Text fontSize="lg" color={mutedTextColor} maxW="2xl">
              Join thousands of developers who trust Umay Render for their HTML
              to PDF conversion needs. Start integrating in minutes, with no
              limitations.
            </Text>
          </VStack>

          <HStack gap="4" zIndex="1">
            <Button
              colorScheme="blue"
              size="lg"
              rounded="full"
              className="btn-highlight"
              _hover={{ transform: "translateY(-3px)", boxShadow: "lg" }}
              transition="all 0.3s"
            >
              Get Started for Free <Box as={LuArrowRight} ml="2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              rounded="full"
              borderColor={primaryColor}
              color={primaryColor}
              _hover={{
                bg: useColorModeValue("brand.subtle", "brand.subtle"),
                transform: "translateY(-3px)",
              }}
              transition="all 0.3s"
            >
              View Documentation
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}
