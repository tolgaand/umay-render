import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Image,
  Container,
  Flex,
  Spinner,
  Stack,
  VStack,
  Icon,
  Badge,
  Grid,
  GridItem,
  HStack,
} from "@chakra-ui/react";
import {
  LuArrowLeft,
  LuExternalLink,
  LuFileText,
  LuImage,
  LuCode,
  LuChevronRight,
  LuCopy,
} from "react-icons/lu";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  solarizedlight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Helmet } from "react-helmet-async";

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

// Metadata interface
interface DemoMetadata {
  pageTitle?: string;
  metaDescription?: string;
  tags?: string[];
  render?: {
    pdfOptions?: {
      format?: string;
      landscape?: boolean;
      printBackground?: boolean;
      margin?: {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
      };
      scale?: number;
      displayHeaderFooter?: boolean;
      headerTemplate?: string;
      footerTemplate?: string;
      pageRanges?: string;
      preferCSSPageSize?: boolean;
      width?: string | number;
      height?: string | number;
      [key: string]: unknown;
    };
    pageSetupOptions?: {
      viewport?: {
        width?: number;
        height?: number;
        deviceScaleFactor?: number;
        isMobile?: boolean;
        hasTouch?: boolean;
        isLandscape?: boolean;
      };
      emulateMediaType?: string;
      waitForSelector?: string;
      waitForTimeout?: number;
      waitUntil?: string | string[];
      javascriptEnabled?: boolean;
      userAgent?: string;
      [key: string]: unknown;
    };
    screenshotOptions?: {
      quality?: number;
      fullPage?: boolean;
      omitBackground?: boolean;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}

// Add carousel content type
type CarouselItemType = "html" | "pdf" | "screenshots";

export default function DemoDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demoMap, setDemoMap] = useState<DemoMap | null>(null);
  const [demo, setDemo] = useState<DemoItem | null>(null);
  const [metadata, setMetadata] = useState<DemoMetadata | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselType, setCarouselType] = useState<CarouselItemType>("html");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Theme colors for cards and elements
  const cardBg = isDark ? "gray.750" : "white";
  const cardBorder = isDark ? "gray.700" : "gray.200";
  const bodyBg = isDark ? "gray.900" : "gray.50";
  const textColor = isDark ? "white" : "gray.800";
  const textMuted = isDark ? "gray.300" : "gray.600";
  const accentColor = isDark ? "brand.300" : "brand.600";
  const buttonHoverBg = isDark ? "brand.900" : "brand.50";

  // For active tab indicator
  const activeTabBg = isDark ? "brand.500" : "brand.500";
  const inactiveTabBg = isDark ? "gray.700" : "gray.100";

  useEffect(() => {
    // Scroll to top when component mounts or id changes
    window.scrollTo(0, 0);

    fetch("/demo/demo-map.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load demo map");
        }
        return response.json();
      })
      .then((data) => {
        setDemoMap(data);
        const foundDemo = data.demos.find((d: DemoItem) => d.id === id);
        if (foundDemo) {
          setDemo(foundDemo);

          // Fetch metadata.json for this demo
          const demoPath = foundDemo.links.html
            .split("/")
            .slice(0, -1)
            .join("/");
          fetch(`${demoPath}/metadata.json`)
            .then((response) => {
              if (!response.ok) {
                console.warn(`No metadata found for demo: ${id}`);
                return null;
              }
              return response.json();
            })
            .then((metadataData) => {
              if (metadataData) {
                setMetadata(metadataData);
              }
            })
            .catch((err) => {
              console.warn(`Error loading metadata for demo ${id}:`, err);
            });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading demo map:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Navigate to another demo
  const navigateToDemo = (demoId: string) => {
    navigate(`/demos/${demoId}`);
  };

  // Navigate back to demo list
  const navigateBack = () => {
    navigate("/demos");
  };

  // Function to set the content type
  const setContentType = (type: CarouselItemType) => {
    setCarouselType(type);
    setCarouselIndex(0);
  };

  // SEO Title ve Meta Description için
  const getSeoTitle = () => {
    if (metadata?.pageTitle) {
      return metadata.pageTitle;
    }
    return demo?.title
      ? `${demo.title} - Umay Render Demo`
      : "Demo Example - Umay Render";
  };

  const getSeoDescription = () => {
    if (metadata?.metaDescription) {
      return metadata.metaDescription;
    }
    return (
      demo?.description ||
      "View an example of HTML to PDF conversion with Umay Render."
    );
  };

  if (loading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={bodyBg}
      >
        <VStack gap={6}>
          <Spinner size="xl" color="brand.500" />
          <Text color={textMuted}>Loading example...</Text>
        </VStack>
      </Box>
    );
  }

  if (error || !demoMap) {
    return (
      <Box p={8} bg={bodyBg} minH="100vh">
        <Stack
          gap={4}
          align="center"
          maxW="500px"
          mx="auto"
          p={6}
          borderRadius="md"
          bg={isDark ? "red.900" : "red.50"}
          color={isDark ? "red.300" : "red.600"}
          shadow="md"
        >
          <Box boxSize={10}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </Box>
          <Heading size="md">Error Loading Example</Heading>
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

  if (!demo) {
    return (
      <Box bg={bodyBg} minH="100vh">
        <Navbar />
        <Container maxW="container.xl" py={12}>
          <Stack
            gap={8}
            align="center"
            p={8}
            bg={cardBg}
            borderRadius="xl"
            shadow="md"
            borderWidth="1px"
            borderColor={cardBorder}
          >
            <Box boxSize={16} color="orange.500">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-4.42 3.58-8 8-8 4.42 0 8 3.58 8 8 0 4.42-3.58 8-8 8zm-1-5h2v2h-2zm0-8h2v6h-2z" />
              </svg>
            </Box>
            <Heading size="lg">Example Not Found</Heading>
            <Text color={textMuted} textAlign="center">
              The example you're looking for doesn't exist or has been moved.
            </Text>
            <Button
              colorPalette="brand"
              size="lg"
              mt={4}
              borderRadius="full"
              onClick={navigateBack}
            >
              <Box as={LuArrowLeft} display="inline-block" mr={2} />
              Browse All Examples
            </Button>
          </Stack>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <>
      {demo && (
        <Helmet>
          <title>{getSeoTitle()}</title>
          <meta name="description" content={getSeoDescription()} />
          {metadata?.tags && metadata.tags.length > 0 && (
            <meta name="keywords" content={metadata.tags.join(", ")} />
          )}
          <link
            rel="canonical"
            href={`https://www.umayrender.com/demos/${demo.id}`}
          />
          {demo.screenshots && demo.screenshots.length > 0 && (
            <meta property="og:image" content={demo.screenshots[0]} />
          )}
          <meta property="og:title" content={getSeoTitle()} />
          <meta property="og:description" content={getSeoDescription()} />
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content={`https://www.umayrender.com/demos/${demo.id}`}
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={getSeoTitle()} />
          <meta name="twitter:description" content={getSeoDescription()} />
        </Helmet>
      )}

      <Box bg={bodyBg} minH="100vh">
        <Navbar />

        <Box position="relative" overflow="hidden" py={{ base: 4, md: 8 }}>
          {/* Background decorations */}
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

          <Container maxW="container.xl" position="relative" zIndex="1">
            {/* Breadcrumb navigation */}
            <Flex
              align="center"
              py={4}
              px={{ base: 4, md: 0 }}
              gap={2}
              fontSize="sm"
              color={textMuted}
              borderRadius="lg"
              mb={4}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={navigateBack}
                color={accentColor}
                _hover={{ bg: buttonHoverBg }}
              >
                <Icon as={LuArrowLeft} mr={2} />
                Back to Examples
              </Button>
              <Icon as={LuChevronRight} boxSize={4} />
              <Text color={textColor} fontWeight="medium">
                {demo.title}
              </Text>
            </Flex>

            <Grid templateColumns={{ base: "1fr", lg: "300px 1fr" }} gap={8}>
              {/* Left sidebar with details */}
              <GridItem>
                <VStack align="stretch" gap={6} position="sticky" top="20px">
                  {/* Example information */}
                  <Box
                    bg={cardBg}
                    borderColor={cardBorder}
                    shadow="md"
                    borderRadius="xl"
                    p={5}
                    borderWidth="1px"
                  >
                    <VStack align="start" gap={4}>
                      <Badge
                        colorPalette="brand"
                        variant="subtle"
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        {demoMap.categories[demo.category] || demo.category}
                      </Badge>

                      <Heading
                        as="h1"
                        size="lg"
                        fontWeight="bold"
                        letterSpacing="-0.02em"
                        bgGradient="to-r"
                        gradientFrom={isDark ? "blue.300" : "blue.400"}
                        gradientTo={isDark ? "purple.400" : "purple.500"}
                        backgroundClip="text"
                        color="transparent"
                      >
                        {demo.title}
                      </Heading>

                      <Text color={textMuted} fontSize="sm" lineHeight="tall">
                        {demo.description}
                      </Text>

                      <Box
                        borderTop="1px solid"
                        borderColor={cardBorder}
                        w="100%"
                        pt={4}
                      />

                      <VStack align="stretch" width="100%" gap={3}>
                        <Flex justify="space-between" align="center">
                          <Text
                            fontWeight="medium"
                            color={textMuted}
                            fontSize="sm"
                          >
                            Example ID
                          </Text>
                          <Text color={textColor} fontSize="sm">
                            {demo.id}
                          </Text>
                        </Flex>

                        <Flex justify="space-between" align="center">
                          <Text
                            fontWeight="medium"
                            color={textMuted}
                            fontSize="sm"
                          >
                            Category
                          </Text>
                          <Text color={textColor} fontSize="sm">
                            {demoMap.categories[demo.category]}
                          </Text>
                        </Flex>
                      </VStack>
                    </VStack>
                  </Box>

                  {/* Download links */}
                  <Box
                    bg={cardBg}
                    borderColor={cardBorder}
                    shadow="sm"
                    borderRadius="xl"
                    p={4}
                    borderWidth="1px"
                  >
                    <VStack align="stretch" gap={3}>
                      <Heading
                        size="xs"
                        mb={1}
                        color={textColor}
                        fontWeight="semibold"
                      >
                        Download Links
                      </Heading>

                      <Button
                        onClick={() =>
                          window.open(
                            demo.links.html,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                        variant="outline"
                        size="sm"
                        justifyContent="space-between"
                        borderRadius="md"
                        borderColor={isDark ? "gray.600" : "gray.200"}
                        _hover={{ bg: isDark ? "gray.700" : "gray.50" }}
                        height="36px"
                      >
                        <Flex align="center">
                          <Icon
                            as={LuCode}
                            boxSize="14px"
                            mr={2}
                            color={isDark ? "brand.300" : "brand.500"}
                          />
                          <Text fontSize="sm">HTML Source</Text>
                        </Flex>
                        <Icon
                          as={LuExternalLink}
                          boxSize="14px"
                          color={textMuted}
                        />
                      </Button>

                      {demo.links.pdf && (
                        <Button
                          onClick={() =>
                            window.open(
                              demo.links.pdf,
                              "_blank",
                              "noopener,noreferrer"
                            )
                          }
                          variant="outline"
                          size="sm"
                          justifyContent="space-between"
                          borderRadius="md"
                          borderColor={isDark ? "gray.600" : "gray.200"}
                          _hover={{ bg: isDark ? "gray.700" : "gray.50" }}
                          height="36px"
                        >
                          <Flex align="center">
                            <Icon
                              as={LuFileText}
                              boxSize="14px"
                              mr={2}
                              color={isDark ? "red.300" : "red.500"}
                            />
                            <Text fontSize="sm">PDF Output</Text>
                          </Flex>
                          <Icon
                            as={LuExternalLink}
                            boxSize="14px"
                            color={textMuted}
                          />
                        </Button>
                      )}

                      {demo.links.jpg && (
                        <Button
                          onClick={() =>
                            window.open(
                              demo.links.jpg,
                              "_blank",
                              "noopener,noreferrer"
                            )
                          }
                          variant="outline"
                          size="sm"
                          justifyContent="space-between"
                          borderRadius="md"
                          borderColor={isDark ? "gray.600" : "gray.200"}
                          _hover={{ bg: isDark ? "gray.700" : "gray.50" }}
                          height="36px"
                        >
                          <Flex align="center">
                            <Icon
                              as={LuImage}
                              boxSize="14px"
                              mr={2}
                              color={isDark ? "blue.300" : "blue.500"}
                            />
                            <Text fontSize="sm">JPG Output</Text>
                          </Flex>
                          <Icon
                            as={LuExternalLink}
                            boxSize="14px"
                            color={textMuted}
                          />
                        </Button>
                      )}
                    </VStack>
                  </Box>
                </VStack>
              </GridItem>

              {/* Main content area */}
              <GridItem>
                <VStack align="stretch" gap={6}>
                  {/* Content Type Selector */}
                  <Box
                    bg={cardBg}
                    borderRadius="xl"
                    shadow="sm"
                    borderWidth="1px"
                    borderColor={cardBorder}
                    p={1}
                    mb={4}
                    display="flex"
                  >
                    <Box
                      as="button"
                      bg={carouselType === "html" ? activeTabBg : inactiveTabBg}
                      color={carouselType === "html" ? "white" : textMuted}
                      mx={1}
                      fontWeight="medium"
                      borderRadius="lg"
                      px={3}
                      py={1.5}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{
                        bg:
                          carouselType === "html"
                            ? activeTabBg
                            : isDark
                            ? "gray.600"
                            : "gray.200",
                      }}
                      onClick={() => setContentType("html")}
                    >
                      <Flex align="center" gap={1.5}>
                        <LuCode size={14} />
                        <Text fontSize="sm">HTML</Text>
                      </Flex>
                    </Box>

                    {demo.links.pdf && (
                      <Box
                        as="button"
                        bg={
                          carouselType === "pdf" ? activeTabBg : inactiveTabBg
                        }
                        color={carouselType === "pdf" ? "white" : textMuted}
                        mx={1}
                        fontWeight="medium"
                        borderRadius="lg"
                        px={3}
                        py={1.5}
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{
                          bg:
                            carouselType === "pdf"
                              ? activeTabBg
                              : isDark
                              ? "gray.600"
                              : "gray.200",
                        }}
                        onClick={() => setContentType("pdf")}
                      >
                        <Flex align="center" gap={1.5}>
                          <LuFileText size={14} />
                          <Text fontSize="sm">PDF</Text>
                        </Flex>
                      </Box>
                    )}

                    {demo.screenshots && demo.screenshots.length > 0 && (
                      <Box
                        as="button"
                        bg={
                          carouselType === "screenshots"
                            ? activeTabBg
                            : inactiveTabBg
                        }
                        color={
                          carouselType === "screenshots" ? "white" : textMuted
                        }
                        mx={1}
                        fontWeight="medium"
                        borderRadius="lg"
                        px={3}
                        py={1.5}
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{
                          bg:
                            carouselType === "screenshots"
                              ? activeTabBg
                              : isDark
                              ? "gray.600"
                              : "gray.200",
                        }}
                        onClick={() => setContentType("screenshots")}
                      >
                        <Flex align="center" gap={1.5}>
                          <LuImage size={14} />
                          <Text fontSize="sm">Screenshots</Text>
                        </Flex>
                      </Box>
                    )}
                  </Box>

                  {/* Carousel View */}
                  <Box position="relative">
                    {/* Content Display */}
                    <Box
                      bg={cardBg}
                      borderColor={cardBorder}
                      shadow="sm"
                      borderRadius="xl"
                      overflow="hidden"
                      borderWidth="1px"
                      position="relative"
                    >
                      {/* Content Header */}
                      <Box
                        p={4}
                        borderBottom="1px solid"
                        borderColor={cardBorder}
                      >
                        <Flex justify="space-between" align="center">
                          <Heading
                            size="sm"
                            fontWeight="semibold"
                            color={textColor}
                          >
                            {carouselType === "html" && "HTML Source"}
                            {carouselType === "pdf" && "PDF Output"}
                            {carouselType === "screenshots" &&
                              `Screenshot ${carouselIndex + 1} / ${
                                demo.screenshots?.length
                              }`}
                          </Heading>

                          <Button
                            onClick={() => {
                              let url = demo.links.html;
                              if (carouselType === "pdf" && demo.links.pdf) {
                                url = demo.links.pdf;
                              } else if (
                                carouselType === "screenshots" &&
                                demo.screenshots
                              ) {
                                url = demo.screenshots[carouselIndex];
                              }
                              window.open(url, "_blank", "noopener,noreferrer");
                            }}
                            size="xs"
                            colorPalette="brand"
                            variant="outline"
                            borderRadius="md"
                            fontWeight="medium"
                            borderColor={isDark ? "brand.600" : "brand.200"}
                            _hover={{
                              bg: isDark ? "brand.900" : "brand.50",
                              borderColor: isDark ? "brand.500" : "brand.300",
                            }}
                          >
                            {carouselType === "html" && "Open in New Tab"}
                            {carouselType === "pdf" && "Open in New Tab"}
                            {carouselType === "screenshots" && "Full Size"}
                            <Icon as={LuExternalLink} ml={1.5} boxSize={3} />
                          </Button>
                        </Flex>
                      </Box>

                      {/* Content Body */}
                      {carouselType === "html" && (
                        <Box
                          position="relative"
                          height="500px"
                          borderRadius="0 0 xl xl"
                          overflow="hidden"
                        >
                          <iframe
                            src={demo.links.html}
                            title={`${demo.title} HTML`}
                            width="100%"
                            height="100%"
                            style={{ border: "none" }}
                          />
                        </Box>
                      )}

                      {carouselType === "pdf" && demo.links.pdf && (
                        <Box
                          position="relative"
                          height="600px"
                          borderRadius="0 0 xl xl"
                          overflow="hidden"
                          bg={isDark ? "gray.800" : "gray.100"}
                        >
                          <Badge
                            position="absolute"
                            top={2}
                            left={2}
                            zIndex={2}
                            colorPalette="blue"
                            variant="solid"
                            px={3}
                            py={1}
                            opacity={0.9}
                            shadow="sm"
                          >
                            A4 format - may differ from HTML view
                          </Badge>
                          <iframe
                            src={demo.links.pdf}
                            title={`${demo.title} PDF`}
                            width="100%"
                            height="100%"
                            style={{ border: "none" }}
                          />
                        </Box>
                      )}

                      {carouselType === "screenshots" && demo.screenshots && (
                        <Box>
                          <Image
                            src={demo.screenshots[carouselIndex]}
                            alt={`${demo.title} screenshot ${
                              carouselIndex + 1
                            }`}
                            width="100%"
                            objectFit="contain"
                            maxH="600px"
                          />

                          {/* Pagination Indicators */}
                          <Flex justify="center" p={3} gap={1.5}>
                            {demo.screenshots.map((_, idx) => (
                              <Box
                                key={idx}
                                w={2}
                                h={2}
                                borderRadius="full"
                                bg={
                                  idx === carouselIndex
                                    ? "brand.500"
                                    : isDark
                                    ? "gray.600"
                                    : "gray.300"
                                }
                                cursor="pointer"
                                onClick={() => setCarouselIndex(idx)}
                                transition="all 0.2s"
                                _hover={{ transform: "scale(1.2)" }}
                              />
                            ))}
                          </Flex>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Hero-style code example block */}
                  <Box maxW="100%" mb="6" mt={4} data-code-editor="true">
                    <Heading
                      size="sm"
                      mb={3}
                      fontWeight="semibold"
                      color={textColor}
                    >
                      Render Configuration
                    </Heading>
                    <Box
                      overflow="hidden"
                      shadow="xl"
                      position="relative"
                      transition="all 0.5s"
                      backdropFilter="blur(8px)"
                      bg={isDark ? "bg.card" : "white"}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor={isDark ? "gray.700" : "gray.200"}
                      _hover={{
                        transform: "translateY(-5px)",
                        boxShadow: "2xl",
                      }}
                    >
                      <Box bg={isDark ? "gray.700" : "gray.200"} py="2" px="4">
                        <HStack gap="2" justifyContent="space-between">
                          <HStack>
                            <Box w="3" h="3" borderRadius="full" bg="red.500" />
                            <Box
                              w="3"
                              h="3"
                              borderRadius="full"
                              bg="yellow.500"
                            />
                            <Box
                              w="3"
                              h="3"
                              borderRadius="full"
                              bg="green.500"
                            />
                          </HStack>
                          <HStack>
                            <HStack
                              fontSize="xs"
                              fontFamily="mono"
                              color={isDark ? "blue.400" : "blue.500"}
                              fontWeight="bold"
                              px="2"
                              py="1"
                              borderRadius="md"
                              bg={isDark ? "gray.800" : "gray.100"}
                            >
                              <Icon as={LuCode} mr="1" />
                              TypeScript
                            </HStack>
                          </HStack>
                        </HStack>
                      </Box>
                      <Box position="relative" zIndex="1" minHeight="200px">
                        <SyntaxHighlighter
                          language="typescript"
                          style={isDark ? vscDarkPlus : solarizedlight}
                          customStyle={{
                            margin: 0,
                            padding: "16px",
                            background: "transparent",
                            fontSize: "14px",
                            minHeight: "200px",
                          }}
                        >
                          {`import { UmaySDK } from 'umay-render';
   
const umay = new UmaySDK();
const result = await umay.render({
  html: '${demo.links.html.split("/").pop()}',
  outputFormat: 'pdf',
  ${
    metadata?.render?.pdfOptions
      ? `pdfOptions: {
    format: '${metadata?.render?.pdfOptions?.format || "A4"}',
    landscape: ${metadata?.render?.pdfOptions?.landscape || false},
    margin: {
      top: '${metadata?.render?.pdfOptions?.margin?.top || "1cm"}',
      right: '${metadata?.render?.pdfOptions?.margin?.right || "1cm"}',
      bottom: '${metadata?.render?.pdfOptions?.margin?.bottom || "1cm"}',
      left: '${metadata?.render?.pdfOptions?.margin?.left || "1cm"}'
    },
    printBackground: ${metadata?.render?.pdfOptions?.printBackground || true}${
          metadata?.render?.pdfOptions?.scale
            ? `,
    scale: ${metadata.render.pdfOptions.scale}`
            : ""
        }
  },`
      : ""
  }
  ${
    metadata?.render?.pageSetupOptions &&
    metadata.render.pageSetupOptions.viewport
      ? `pageSetupOptions: {
    viewport: {
      width: ${metadata.render.pageSetupOptions.viewport.width},
      height: ${metadata.render.pageSetupOptions.viewport.height}${
          metadata.render.pageSetupOptions.viewport.deviceScaleFactor
            ? `,
      deviceScaleFactor: ${metadata.render.pageSetupOptions.viewport.deviceScaleFactor}`
            : ""
        }
    }
  }`
      : ""
  }
});`}
                        </SyntaxHighlighter>
                        <Button
                          aria-label="Copy code"
                          size="sm"
                          position="absolute"
                          bottom="3"
                          right="3"
                          colorScheme="brand"
                          variant="ghost"
                          zIndex="3"
                          onClick={() => {
                            const code = `import { UmaySDK } from 'umay-render';
   
const umay = new UmaySDK();
const result = await umay.render({
  html: '${demo.links.html.split("/").pop()}',
  outputFormat: 'pdf',
  ${
    metadata?.render?.pdfOptions
      ? `pdfOptions: {
    format: '${metadata?.render?.pdfOptions?.format || "A4"}',
    landscape: ${metadata?.render?.pdfOptions?.landscape || false},
    margin: {
      top: '${metadata?.render?.pdfOptions?.margin?.top || "1cm"}',
      right: '${metadata?.render?.pdfOptions?.margin?.right || "1cm"}',
      bottom: '${metadata?.render?.pdfOptions?.margin?.bottom || "1cm"}',
      left: '${metadata?.render?.pdfOptions?.margin?.left || "1cm"}'
    },
    printBackground: ${metadata?.render?.pdfOptions?.printBackground || true}${
          metadata?.render?.pdfOptions?.scale
            ? `,
    scale: ${metadata.render.pdfOptions.scale}`
            : ""
        }
  },`
      : ""
  }
  ${
    metadata?.render?.pageSetupOptions &&
    metadata.render.pageSetupOptions.viewport
      ? `pageSetupOptions: {
    viewport: {
      width: ${metadata.render.pageSetupOptions.viewport.width},
      height: ${metadata.render.pageSetupOptions.viewport.height}${
          metadata.render.pageSetupOptions.viewport.deviceScaleFactor
            ? `,
      deviceScaleFactor: ${metadata.render.pageSetupOptions.viewport.deviceScaleFactor}`
            : ""
        }
    }
  }`
      : ""
  }
});`;
                            navigator.clipboard.writeText(code);
                          }}
                        >
                          <Icon as={LuCopy} />
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </VStack>
              </GridItem>
            </Grid>

            {/* Related examples */}
            {demoMap.demos.filter(
              (d) => d.category === demo.category && d.id !== demo.id
            ).length > 0 && (
              <Box mt={10}>
                <Box
                  bg={cardBg}
                  borderColor={cardBorder}
                  shadow="sm"
                  borderRadius="xl"
                  p={5}
                  borderWidth="1px"
                >
                  <Heading
                    size="sm"
                    mb={5}
                    color={textColor}
                    fontWeight="semibold"
                  >
                    Related Examples
                  </Heading>

                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                    {demoMap.demos
                      .filter(
                        (d) => d.category === demo.category && d.id !== demo.id
                      )
                      .slice(0, 3)
                      .map((relatedDemo) => (
                        <Box
                          key={relatedDemo.id}
                          bg={cardBg}
                          borderColor={cardBorder}
                          shadow="xs"
                          borderRadius="lg"
                          overflow="hidden"
                          borderWidth="1px"
                          _hover={{
                            transform: "translateY(-4px)",
                            shadow: "md",
                            borderColor: isDark ? "brand.500" : "brand.200",
                          }}
                          transition="all 0.2s ease"
                          cursor="pointer"
                          onClick={() => navigateToDemo(relatedDemo.id)}
                        >
                          {relatedDemo.screenshots &&
                          relatedDemo.screenshots.length > 0 ? (
                            <Box position="relative" height="140px">
                              <Image
                                src={relatedDemo.screenshots[0]}
                                alt={relatedDemo.title}
                                height="140px"
                                width="100%"
                                objectFit="cover"
                              />
                            </Box>
                          ) : (
                            <Flex
                              height="140px"
                              bg={isDark ? "gray.700" : "gray.100"}
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Text
                                fontSize="2xl"
                                color={isDark ? "gray.500" : "gray.400"}
                              >
                                {relatedDemo.title.charAt(0)}
                              </Text>
                            </Flex>
                          )}

                          <Box p={3}>
                            <Flex
                              justify="space-between"
                              align="flex-start"
                              mb={1.5}
                            >
                              <Heading
                                as="h3"
                                size="xs"
                                color={textColor}
                                fontWeight="semibold"
                              >
                                {relatedDemo.title}
                              </Heading>
                            </Flex>
                            <Box
                              px={1.5}
                              py={0.5}
                              bg={isDark ? "blue.900" : "blue.50"}
                              color={isDark ? "blue.300" : "blue.600"}
                              fontSize="xs"
                              borderRadius="md"
                              fontWeight="medium"
                              display="inline-block"
                            >
                              {demoMap.categories[relatedDemo.category]}
                            </Box>
                          </Box>
                        </Box>
                      ))}
                  </SimpleGrid>
                </Box>
              </Box>
            )}

            {/* Breadcrumb navigation */}
            <Flex
              align="center"
              py={3}
              px={{ base: 3, md: 0 }}
              gap={2}
              fontSize="sm"
              color={textMuted}
              borderRadius="lg"
              mb={3}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={navigateBack}
                color={accentColor}
                _hover={{ bg: buttonHoverBg }}
                height="32px"
                borderRadius="md"
                px={3}
                fontWeight="normal"
              >
                <Icon as={LuArrowLeft} boxSize="14px" mr={1.5} />
                All Examples
              </Button>
              <Icon as={LuChevronRight} boxSize={3} />
              <Text color={textColor} fontWeight="medium" fontSize="sm">
                {demo.title}
              </Text>
            </Flex>
          </Container>
        </Box>
        <Footer />
      </Box>
    </>
  );
}
