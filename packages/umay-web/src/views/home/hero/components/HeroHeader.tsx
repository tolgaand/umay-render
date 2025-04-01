import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Link,
  Heading,
  Badge,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { LuArrowRight, LuGithub, LuFileOutput } from "react-icons/lu";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function HeroHeader() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["Invoices", "Reports", "Contracts", "Statements"];

  // Animate words cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      bg={isDark ? "bg.card" : "white"}
      borderRadius="xl"
      overflow="hidden"
      boxShadow="lg"
      mb="12"
      data-animate="true"
      position="relative"
      border="1px solid"
      borderColor={isDark ? "gray.700" : "gray.200"}
      style={{
        transition: "opacity 0.3s",
      }}
    >
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

      <Box p={{ base: 6, md: 8 }} position="relative" zIndex="1">
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          gap={{ base: 5, md: 8 }}
        >
          <VStack
            align={{ base: "center", md: "flex-start" }}
            textAlign={{ base: "center", md: "left" }}
            gap="4"
            flex="1"
          >
            <Badge
              bg={isDark ? "brand.500/20" : "brand.100"}
              color={isDark ? "brand.300" : "brand.700"}
              fontSize="sm"
              px="3"
              py="1"
              borderRadius="full"
              textTransform="none"
              border="1px solid"
              borderColor={isDark ? "brand.500/30" : "brand.200"}
            >
              Professional HTML to PDF Conversion
            </Badge>

            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="extrabold"
              lineHeight="1.2"
              color={isDark ? "white" : "gray.800"}
            >
              Transform HTML to PDF for{" "}
              <Box
                position="relative"
                display={{ base: "block", md: "inline-block" }}
                minWidth={{ base: "100%", md: "220px" }}
                h="1.2em"
                mt={{ base: 2, md: 0 }}
                verticalAlign="bottom"
                overflow="visible"
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
                    fontWeight="extrabold"
                    bgGradient="to-r"
                    gradientFrom={isDark ? "brand.300" : "brand.500"}
                    gradientTo={isDark ? "brand.500" : "brand.700"}
                    backgroundClip="text"
                    color="transparent"
                    whiteSpace="nowrap"
                    letterSpacing="normal"
                    width="auto"
                    paddingRight="4px" // Extra padding to avoid text clipping
                  >
                    {word}
                  </Text>
                ))}
                <Text
                  as="span"
                  opacity="0"
                  fontWeight="extrabold"
                  paddingRight="4px"
                >
                  {words.reduce(
                    (longest, word) =>
                      word.length > longest.length ? word : longest,
                    ""
                  )}
                </Text>
              </Box>
            </Heading>

            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="text.muted"
              maxW="600px"
              lineHeight="1.6"
            >
              Generate pixel-perfect PDFs from HTML with our enterprise-grade
              rendering engine. Ideal for invoices, financial reports, and
              automated document generation.
            </Text>

            <HStack
              gap="4"
              pt="4"
              w={{ base: "full", md: "auto" }}
              justify={{ base: "center", md: "flex-start" }}
            >
              <Button
                size={{ base: "md", md: "lg" }}
                colorScheme="brand"
                rounded="full"
                _hover={{
                  transform: "translateY(-3px)",
                  boxShadow: "lg",
                }}
                transition="all 0.3s"
              >
                <Icon as={LuFileOutput} mr="2" />
                Try it Now
                <Box as={LuArrowRight} display="inline-block" ml="2" />
              </Button>

              <Link
                href="https://github.com/tolgaand/umay-render"
                target="_blank"
                _hover={{ textDecoration: "none" }}
              >
                <Button
                  size={{ base: "md", md: "lg" }}
                  variant="outline"
                  rounded="full"
                  borderColor="brand.500"
                  color="brand.500"
                  _hover={{
                    bg: isDark ? "brand.500/10" : "brand.50",
                    transform: "translateY(-3px)",
                  }}
                  transition="all 0.3s"
                >
                  View on GitHub
                  <Box as={LuGithub} display="inline-block" ml="2" />
                </Button>
              </Link>
            </HStack>
          </VStack>
        </Flex>
      </Box>
    </Box>
  );
}
