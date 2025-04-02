import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Image,
  Container,
  Stack,
  Spinner,
  VStack,
  Flex,
  Icon,
  Input,
  Group,
  InputElement,
} from "@chakra-ui/react";
import { LuFileSearch, LuArrowRight, LuSearch } from "react-icons/lu";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";
import { useTheme } from "next-themes";
import gsap from "gsap";

// Demo item interface
interface DemoItem {
  id: string;
  title: string;
  description: string;
  category: string;
  screenshots?: string[];
  links: {
    html: string;
    pdf?: string;
    jpg?: string;
  };
}

// Demo map interface
interface DemoMap {
  categories: Record<string, string>;
  demos: DemoItem[];
}

export default function DemoListView() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demoMap, setDemoMap] = useState<DemoMap | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Theme colors for cards and elements
  const cardBg = isDark ? "gray.750" : "white";
  const cardBorder = isDark ? "gray.700" : "gray.200";
  const placeholderBg = isDark ? "gray.700" : "gray.100";
  const placeholderColor = isDark ? "gray.500" : "gray.400";
  const tagBg = isDark ? "blue.900" : "blue.50";
  const tagColor = isDark ? "blue.300" : "blue.600";
  const bodyBg = isDark ? "gray.900" : "gray.50";
  const textColor = isDark ? "white" : "gray.800";
  const textMuted = isDark ? "gray.300" : "gray.600";

  // Load data
  useEffect(() => {
    fetch("/demo/demo-map.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load demo map");
        }
        return response.json();
      })
      .then((data) => {
        setDemoMap(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading demo map:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter demos by selected category and search query
  const categories = demoMap?.categories ? Object.keys(demoMap.categories) : [];
  const filteredDemos = demoMap?.demos
    ? demoMap.demos
        .filter((demo) =>
          selectedCategory ? demo.category === selectedCategory : true
        )
        .filter((demo) =>
          searchQuery
            ? demo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              demo.description.toLowerCase().includes(searchQuery.toLowerCase())
            : true
        )
    : [];

  // GSAP animations
  useEffect(() => {
    if (typeof window === "undefined" || loading || !demoMap) return;

    // Import ScrollTrigger only on client side
    const registerScrollTrigger = async () => {
      const ScrollTriggerModule = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTriggerModule.ScrollTrigger);
    };
    registerScrollTrigger();

    // Get the container and create a clean timeline
    const container = containerRef.current;
    if (!container) return;

    // Kill any existing animations to prevent conflicts
    gsap.killTweensOf(".demo-card");

    // Create a staggered animation for each card with a small delay
    gsap.fromTo(
      ".demo-card",
      {
        opacity: 0,
        y: 20,
        scale: 0.97,
        filter: "blur(5px)",
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
        clearProps: "all", // Important: Clean up properties after animation
      }
    );

    return () => {
      // Clean up all animations when component unmounts
      gsap.killTweensOf(".demo-card");
    };
  }, [loading, demoMap, selectedCategory]);

  // Navigate to demo details
  const navigateToDemo = (demoId: string) => {
    navigate(`/demos/${demoId}`);
  };

  if (loading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack gap={6}>
          <Spinner size="xl" color="brand.500" />
          <Text color={textMuted}>Loading examples...</Text>
        </VStack>
      </Box>
    );
  }

  if (error || !demoMap) {
    return (
      <Box p={8}>
        <Stack
          gap={4}
          align="center"
          maxW="500px"
          mx="auto"
          p={6}
          borderRadius="md"
          bg={isDark ? "red.900" : "red.50"}
          color={isDark ? "red.300" : "red.600"}
        >
          <Box boxSize={10}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </Box>
          <Heading size="md">Error Loading Examples</Heading>
          <Text>{error || "Failed to load example content"}</Text>
          <Button
            onClick={() => window.location.reload()}
            colorPalette="red"
            size="sm"
          >
            Try Again
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box bg={bodyBg} minH="100vh">
      <Navbar />

      <Box position="relative" overflow="hidden" pb={8}>
        {/* Background decorations similar to hero */}
        <Box
          position="absolute"
          top="0"
          right="0"
          bg={isDark ? "brand.400/20" : "brand.500/20"}
          borderRadius="full"
          w="300px"
          h="300px"
          filter="blur(60px)"
          zIndex="0"
          transform="translate(30%, -30%)"
        />

        <Box
          position="absolute"
          bottom="0"
          left="0"
          bg={isDark ? "purple.400/20" : "purple.500/20"}
          borderRadius="full"
          w="300px"
          h="300px"
          filter="blur(60px)"
          zIndex="0"
          transform="translate(-30%, 30%)"
        />

        <Container maxW="container.xl" py={12} position="relative" zIndex="1">
          <VStack gap={1} mb={3} align="center">
            <Box
              bg={isDark ? "gray.800" : "brand.50"}
              p={2}
              px={4}
              borderRadius="full"
              border="1px solid"
              borderColor={isDark ? "gray.700" : "brand.100"}
            >
              <Text fontSize="sm" color={isDark ? "brand.300" : "brand.600"}>
                Browse Our Example Gallery
              </Text>
            </Box>

            <Heading
              as="h1"
              size="2xl"
              textAlign="center"
              bgGradient="to-r"
              gradientFrom={isDark ? "blue.300" : "blue.400"}
              gradientTo={isDark ? "purple.400" : "purple.500"}
              backgroundClip="text"
              color="transparent"
              fontWeight="extrabold"
            >
              Umay Render Examples
            </Heading>

            <Text
              fontSize="lg"
              textAlign="center"
              maxW="container.md"
              color={textMuted}
              mt={2}
            >
              Browse our collection of HTML to PDF rendering examples. Each
              example showcases the powerful conversion capabilities of Umay
              Render for professional document generation.
            </Text>
          </VStack>

          <Flex gap={6} direction={{ base: "column", lg: "row" }} mt={6}>
            {/* Left sidebar with filters */}
            <Box
              w={{ base: "100%", lg: "260px" }}
              flexShrink={0}
              borderRadius="xl"
              p={5}
              bg={cardBg}
              borderWidth="1px"
              borderColor={cardBorder}
              shadow="md"
              h="fit-content"
              position="sticky"
              top="20px"
            >
              <VStack gap={4} align="stretch">
                <Group>
                  <InputElement pointerEvents="none">
                    <Icon as={LuSearch} color={textMuted} />
                  </InputElement>
                  <Input
                    placeholder="Search examples"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    borderRadius="full"
                    bg={isDark ? "gray.800" : "white"}
                    _placeholder={{ color: textMuted }}
                    borderColor={cardBorder}
                    ps="calc(var(--input-height) - 6px)"
                    _hover={{
                      borderColor: isDark ? "gray.600" : "gray.300",
                    }}
                    _focus={{
                      borderColor: isDark ? "brand.400" : "brand.500",
                      boxShadow: `0 0 0 1px ${
                        isDark ? "brand.400" : "brand.500"
                      }`,
                    }}
                  />
                </Group>

                <Box>
                  <Heading size="md" mb={3} color={textColor}>
                    Categories
                  </Heading>
                  <VStack align="stretch" gap={2}>
                    <Button
                      onClick={() => setSelectedCategory(null)}
                      colorPalette={
                        selectedCategory === null ? "brand" : "gray"
                      }
                      variant={selectedCategory === null ? "solid" : "outline"}
                      size="sm"
                      borderRadius="full"
                      justifyContent="flex-start"
                      _hover={{
                        transform: "translateY(-2px)",
                        shadow: "md",
                      }}
                      transition="all 0.2s"
                    >
                      All Examples
                    </Button>

                    {categories.map((category) => (
                      <Button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        colorPalette={
                          selectedCategory === category ? "brand" : "gray"
                        }
                        variant={
                          selectedCategory === category ? "solid" : "outline"
                        }
                        size="sm"
                        borderRadius="full"
                        justifyContent="flex-start"
                        _hover={{
                          transform: "translateY(-2px)",
                          shadow: "md",
                        }}
                        transition="all 0.2s"
                      >
                        {demoMap.categories[category]}
                      </Button>
                    ))}
                  </VStack>
                </Box>
              </VStack>
            </Box>

            {/* Right side with results */}
            <Box flex={1}>
              {filteredDemos.length === 0 ? (
                <Box
                  textAlign="center"
                  py={10}
                  bg={cardBg}
                  borderRadius="xl"
                  shadow="md"
                  borderWidth="1px"
                  borderColor={cardBorder}
                >
                  <Icon
                    as={LuFileSearch}
                    boxSize={12}
                    color="gray.400"
                    mb={4}
                  />
                  <Heading size="md" mb={2}>
                    No examples found
                  </Heading>
                  <Text color="gray.500">
                    {searchQuery
                      ? "No examples match your search criteria."
                      : "No examples found in this category."}
                  </Text>
                  {(searchQuery || selectedCategory) && (
                    <Button
                      mt={4}
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory(null);
                      }}
                      colorPalette="brand"
                      size="sm"
                    >
                      Reset Filters
                    </Button>
                  )}
                </Box>
              ) : (
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3, xl: 3 }}
                  gap={6}
                  ref={containerRef}
                >
                  {filteredDemos.map((demo, index) => (
                    <Box
                      key={demo.id}
                      borderWidth="1px"
                      borderColor={cardBorder}
                      borderRadius="xl"
                      overflow="hidden"
                      bg={cardBg}
                      shadow="md"
                      transition="transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease"
                      height="100%"
                      cursor="pointer"
                      className="demo-card"
                      onClick={() => navigateToDemo(demo.id)}
                      _hover={{
                        shadow: "lg",
                        transform: "translateY(-4px)",
                        borderColor: isDark ? "blue.500" : "blue.200",
                      }}
                      ref={(el: HTMLDivElement | null) =>
                        (cardsRef.current[index] = el)
                      }
                    >
                      {demo.screenshots && demo.screenshots.length > 0 ? (
                        <Box position="relative" height="200px">
                          <Image
                            src={demo.screenshots[0]}
                            alt={demo.title}
                            height="200px"
                            width="100%"
                            objectFit="cover"
                          />
                        </Box>
                      ) : (
                        <Box
                          height="200px"
                          bg={placeholderBg}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          position="relative"
                        >
                          <Text fontSize="5xl" color={placeholderColor}>
                            {demo.title.charAt(0)}
                          </Text>
                        </Box>
                      )}

                      <Box p={5}>
                        <Heading as="h3" size="md" mb={2} color={textColor}>
                          {demo.title}
                        </Heading>

                        <Box
                          px={2}
                          py={1}
                          bg={tagBg}
                          color={tagColor}
                          fontSize="xs"
                          borderRadius="full"
                          fontWeight="medium"
                          lineHeight="1.2"
                          display="inline-block"
                          mb={3}
                        >
                          {demoMap.categories[demo.category] || demo.category}
                        </Box>

                        <Text
                          color={textMuted}
                          fontSize="sm"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          display="-webkit-box"
                          style={{
                            WebkitLineClamp: "2",
                            WebkitBoxOrient: "vertical",
                          }}
                          mb={4}
                        >
                          {demo.description}
                        </Text>
                        <Flex justifyContent="flex-end">
                          <Button
                            size="sm"
                            colorPalette="brand"
                            variant="ghost"
                            color={isDark ? "brand.300" : "brand.600"}
                            _hover={{
                              bg: isDark ? "brand.900" : "brand.50",
                              color: isDark ? "brand.200" : "brand.700",
                            }}
                          >
                            View Details
                            <Box
                              as={LuArrowRight}
                              display="inline-block"
                              ml={2}
                            />
                          </Button>
                        </Flex>
                      </Box>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </Box>
          </Flex>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
