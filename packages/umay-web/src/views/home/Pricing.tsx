import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Icon,
  Badge,
  Table, // Keep original import
  // Link component is NOT added as requested
} from "@chakra-ui/react";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { LuCheck, LuX, LuExternalLink } from "react-icons/lu";
import { useTheme } from "next-themes";

// Updated interface to include the optional 'link' property
interface ComparisonItem {
  name: string;
  description: string;
  price: string;
  openSource: boolean; // Kept as boolean as per original code
  browserSupport: boolean;
  nodeSupport: boolean;
  customCSS: boolean;
  noLimits: boolean;
  selfHostable?: boolean;
  programmingLanguages: string;
  link?: string; // Added link property
  buttonText?: string;
  isUmay?: boolean;
}

// Global window type extension (optional, can be kept if needed elsewhere)
declare global {
  interface Window {
    openUmayConversionDialog?: () => void;
  }
}

export default function Pricing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Style variables (kept as original)
  const accentColor = isDark ? "brand.400" : "brand.600";
  const headerBgColor = "table.header";
  const tableBgColor = "table.cell";
  const tableBorderColor = "table.border";
  const tableRowHoverBg = "table.hover";
  const highlightBg = "table.highlight";
  const highlightHoverBg = "table.highlightHover";
  const textMuted = isDark ? "gray.300" : "gray.500"; // Adjusted from original for potentially better dark mode

  // useEffect for animation (kept as original)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      timeline
        .from(".comparison-header", {
          y: 40,
          opacity: 0,
          duration: 0.7,
        })
        .from(
          ".comparison-table",
          {
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.3"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // --- UPDATED comparisonItems Array ---
  // Note: Boolean values reflect the original structure. Prices/features are approximate (Mar 2025).
  const comparisonItems: ComparisonItem[] = [
    {
      name: "Umay Render", // Kept as requested
      description:
        "Enterprise-grade HTML to PDF converter built on Puppeteer with a service layer that can be self-hosted.",
      price: "Free",
      openSource: true,
      browserSupport: true, // Assuming API/library access implies browser-side initiation support
      nodeSupport: true,
      customCSS: true,
      noLimits: true, // Might have resource limits
      selfHostable: true,
      programmingLanguages: "TypeScript, JavaScript, C#, Python (coming soon)",
      link: "YOUR_UMAY_LINK_HERE", // <<< ADD YOUR UMAY LINK HERE
      buttonText: "Try it now",
      isUmay: true,
    },
    {
      name: "Puppeteer",
      description:
        "Headless Chrome/Chromium Node.js API (Requires setup and server resources).",
      price: "Free (Infrastructure needed)",
      openSource: true,
      browserSupport: false, // Runs server-side
      nodeSupport: true,
      customCSS: true, // Excellent CSS support via Chromium
      noLimits: true, // Only resource limits
      selfHostable: true,
      programmingLanguages: "JavaScript, TypeScript",
      link: "https://pptr.dev/",
    },
    {
      name: "Playwright",
      description:
        "Headless browser automation (Chromium, Firefox, WebKit) API (Requires setup and resources).",
      price: "Free (Infrastructure needed)",
      openSource: true,
      browserSupport: false, // Runs server-side
      nodeSupport: true,
      customCSS: true, // Excellent CSS support via modern engines
      noLimits: true, // Only resource limits
      selfHostable: true,
      programmingLanguages: "JS, TS, Python, Java, .NET",
      link: "https://playwright.dev/",
    },
    {
      name: "Gotenberg",
      description:
        "Docker-powered API using Chromium & LibreOffice for conversions.",
      price: "Free (Docker infrastructure needed)",
      openSource: true,
      browserSupport: false, // Accessed via API
      nodeSupport: true, // Accessed via API
      customCSS: true, // Good support via Chromium
      noLimits: true, // Only resource limits
      selfHostable: true,
      programmingLanguages: "Go (REST API)",
      link: "https://gotenberg.dev/",
    },
    {
      name: "WeasyPrint",
      description:
        "Python library focusing on CSS Paged Media standards for PDF generation.",
      price: "Free (Python environment needed)",
      openSource: true,
      browserSupport: false, // Runs server-side (Python)
      nodeSupport: false, // Not directly Node.js based
      customCSS: true, // Strong focus on Paged Media CSS, no JS execution
      noLimits: true, // Only resource limits
      selfHostable: true,
      programmingLanguages: "Python",
      link: "https://weasyprint.org/",
    },
    {
      name: "wkhtmltopdf",
      description:
        "Command line tool using older WebKit engine (May struggle with modern CSS).",
      price: "Free (Requires installation)",
      openSource: true,
      browserSupport: false, // Command-line tool
      nodeSupport: true, // Via wrappers
      customCSS: false, // Limited support for modern CSS due to old engine
      noLimits: false, // Performance/resource limitations
      selfHostable: true,
      programmingLanguages: "C++ (Various wrappers)",
      link: "https://wkhtmltopdf.org/",
    },
    {
      name: "DocRaptor",
      description:
        "Commercial API service using the Prince engine for high-fidelity PDFs.",
      price: "$15+/month", // Verify current pricing
      openSource: false,
      browserSupport: true, // Accessed via API
      nodeSupport: true, // Accessed via API
      customCSS: true, // Excellent CSS support via Prince
      noLimits: false, // Based on plan
      selfHostable: false,
      programmingLanguages: "REST API (Various wrappers)",
      link: "https://docraptor.com/",
    },
    {
      name: "PDFShift",
      description:
        "Commercial API service using headless Chrome for conversion.",
      price: "$9+/month (Credit-based)", // Verify current pricing
      openSource: false,
      browserSupport: true, // Accessed via API
      nodeSupport: true, // Accessed via API
      customCSS: true, // Good support via headless Chrome
      noLimits: false, // Based on plan/credits
      selfHostable: false,
      programmingLanguages: "REST API (Various wrappers)",
      link: "https://pdfshift.io/",
    },
    // Removed PDFmake and jsPDF as they are primarily programmatic generation libraries,
    // not direct HTML renderers like the others listed.
  ];
  // --- END of UPDATED comparisonItems Array ---

  // handleTryItClick function (kept as original)
  // Note: This function doesn't use the 'link' property added above.
  // You might want to update it separately if needed, e.g., as a fallback.
  const handleTryItClick = () => {
    if (typeof window !== "undefined" && window.openUmayConversionDialog) {
      window.openUmayConversionDialog();
    } else {
      // Optional fallback using the link (if you decide to implement later)
      // const umayItem = comparisonItems.find(item => item.isUmay);
      // if (umayItem?.link && umayItem.link !== "YOUR_UMAY_LINK_HERE") {
      //   window.open(umayItem.link, "_blank", "noopener noreferrer");
      // }
      console.warn(
        "openUmayConversionDialog function not found on window object."
      );
    }
  };

  // Component Render (kept as original structure)
  return (
    <Box py={20} ref={containerRef} id="pricing">
      <Container maxW="1200px">
        {" "}
        {/* Kept original maxW */}
        {/* Header Section (kept as original) */}
        <VStack gap={8} mb={16} className="comparison-header">
          <Heading
            as="h2"
            fontSize={{ base: "3xl", md: "4xl" }}
            textAlign="center"
          >
            How Umay Compares
          </Heading>
          <Text
            fontSize="lg"
            textAlign="center"
            maxW="container.md"
            opacity={0.9} // Kept original opacity
            color={textMuted}
          >
            Umay Render provides enterprise-grade features completely free, with
            no usage limits or hidden costs. Built on Puppeteer with a service
            layer that can be self-hosted if needed.
          </Text>
        </VStack>
        {/* Table Section (kept as original structure and components) */}
        <Box
          overflowX="auto"
          className="comparison-table"
          boxShadow="lg"
          borderRadius="xl"
          bg={tableBgColor}
          borderWidth="1px"
          borderColor={tableBorderColor}
        >
          {/* Using original Table.Root structure */}
          <Table.Root>
            <Table.Header>
              <Table.Row bg={headerBgColor}>
                <Table.ColumnHeader py={4}>Service</Table.ColumnHeader>
                <Table.ColumnHeader>Price</Table.ColumnHeader>
                <Table.ColumnHeader>Open Source</Table.ColumnHeader>
                <Table.ColumnHeader>Browser Support</Table.ColumnHeader>
                <Table.ColumnHeader>Node.js Support</Table.ColumnHeader>
                <Table.ColumnHeader>Custom CSS</Table.ColumnHeader>
                <Table.ColumnHeader>No Usage Limits</Table.ColumnHeader>
                <Table.ColumnHeader>Self-Hostable</Table.ColumnHeader>
                {/* Changed "Support" header to match data */}
                <Table.ColumnHeader>Languages</Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {comparisonItems.map((item, index) => (
                <Table.Row
                  key={index}
                  // Kept original bg logic and props
                  bg={item.isUmay ? highlightBg : tableBgColor}
                  position="relative"
                  transition="background 0.2s"
                  _hover={{
                    bg: item.isUmay ? highlightHoverBg : tableRowHoverBg,
                  }}
                  borderBottomWidth="1px"
                  borderColor={tableBorderColor}
                >
                  {/* Service Cell (kept original structure) */}
                  {/* Note: This cell doesn't display the 'link' property */}
                  <Table.Cell
                    py={4}
                    bgColor={item.isUmay ? "transparent" : tableBgColor}
                  >
                    <VStack align="start" gap={1}>
                      <HStack>
                        <Text fontWeight="bold">{item.name}</Text>
                        {item.isUmay && (
                          <Badge colorScheme="brand" variant="solid">
                            RECOMMENDED
                          </Badge>
                        )}
                      </HStack>
                      <Text fontSize="sm" color={textMuted}>
                        {item.description}
                      </Text>
                    </VStack>
                  </Table.Cell>
                  {/* Price Cell (kept original structure) */}
                  <Table.Cell
                    fontWeight={item.isUmay ? "bold" : "normal"}
                    color={item.isUmay ? accentColor : undefined}
                    bgColor={item.isUmay ? "transparent" : tableBgColor}
                  >
                    {item.price}
                  </Table.Cell>
                  {/* Boolean Feature Cells (kept original structure) */}
                  <Table.Cell
                    bgColor={item.isUmay ? "transparent" : tableBgColor}
                  >
                    {item.openSource ? (
                      <Icon
                        as={LuCheck}
                        color="green.500"
                        boxSize={5}
                        aria-label="Yes"
                      />
                    ) : (
                      <Icon
                        as={LuX}
                        color="red.500"
                        boxSize={5}
                        aria-label="No"
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell
                    bgColor={item.isUmay ? "transparent" : tableBgColor}
                  >
                    {item.browserSupport ? (
                      <Icon
                        as={LuCheck}
                        color="green.500"
                        boxSize={5}
                        aria-label="Yes"
                      />
                    ) : (
                      <Icon
                        as={LuX}
                        color="red.500"
                        boxSize={5}
                        aria-label="No"
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell
                    bgColor={item.isUmay ? "transparent" : tableBgColor}
                  >
                    {item.nodeSupport ? (
                      <Icon
                        as={LuCheck}
                        color="green.500"
                        boxSize={5}
                        aria-label="Yes"
                      />
                    ) : (
                      <Icon
                        as={LuX}
                        color="red.500"
                        boxSize={5}
                        aria-label="No"
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell
                    bgColor={item.isUmay ? "transparent" : tableBgColor}
                  >
                    {item.customCSS ? (
                      <Icon
                        as={LuCheck}
                        color="green.500"
                        boxSize={5}
                        aria-label="Yes"
                      />
                    ) : (
                      <Icon
                        as={LuX}
                        color="red.500"
                        boxSize={5}
                        aria-label="No"
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell
                    bgColor={item.isUmay ? "transparent" : tableBgColor}
                  >
                    {item.noLimits ? (
                      <Icon
                        as={LuCheck}
                        color="green.500"
                        boxSize={5}
                        aria-label="Yes"
                      />
                    ) : (
                      <Icon
                        as={LuX}
                        color="red.500"
                        boxSize={5}
                        aria-label="No"
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell
                    bgColor={item.isUmay ? "transparent" : tableBgColor}
                  >
                    {/* Handling optional selfHostable */}
                    {item.selfHostable === true ? (
                      <Icon
                        as={LuCheck}
                        color="green.500"
                        boxSize={5}
                        aria-label="Yes"
                      />
                    ) : item.selfHostable === false ? (
                      <Icon
                        as={LuX}
                        color="red.500"
                        boxSize={5}
                        aria-label="No"
                      />
                    ) : (
                      // Default if undefined (you might want 'N/A' or specific icon)
                      <Icon
                        as={LuX}
                        color="red.500"
                        boxSize={5}
                        aria-label="No"
                      />
                    )}
                  </Table.Cell>
                  {/* Programming Languages Cell (kept original structure) */}
                  <Table.Cell
                    bgColor={item.isUmay ? "transparent" : tableBgColor}
                  >
                    {/* Displaying programming languages */}
                    <Text fontSize="sm">{item.programmingLanguages}</Text>
                  </Table.Cell>
                  {/* Button Cell (kept original structure) */}
                  <Table.Cell
                    bgColor={item.isUmay ? "transparent" : tableBgColor}
                  >
                    {item.isUmay && item.buttonText && (
                      <Button
                        colorScheme="brand"
                        size="sm"
                        variant="solid"
                        onClick={handleTryItClick}
                        rounded="full"
                      >
                        {item.buttonText}
                        <Icon as={LuExternalLink} ml={2} />
                      </Button>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
        {/* Call to Action Section (kept as original) */}
        <VStack gap={6} mt={16}>
          <Text
            fontSize="lg"
            textAlign="center"
            maxW="container.md"
            color={textMuted}
          >
            Ready to try the most powerful free HTML to PDF converter? Convert
            your HTML documents to PDF now.
          </Text>
          <Button
            colorScheme="brand"
            size="lg"
            variant="solid"
            onClick={handleTryItClick}
            px={8}
            rounded="full"
          >
            Try Umay Render for Free
            <Icon as={LuExternalLink} ml={2} />
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}
