import {
  Box,
  Container,
  Text,
  VStack,
  HStack,
  Flex,
  SimpleGrid,
  Badge,
  Link,
} from "@chakra-ui/react";
import {
  LuGithub,
  LuPackage,
  LuHeart,
  LuBox,
  LuPlay,
  LuBoxes,
} from "react-icons/lu";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Text colors
  const textMuted = isDark ? "gray.300" : "gray.600";
  const brandColor = isDark ? "brand.400" : "brand.600";
  const borderColor = isDark ? "gray.600" : "gray.200";

  // Navigation handlers
  const goToDemo = () => navigate("/demo");
  const goToSamples = () => navigate("/samples");

  return (
    <Box as="footer" py={10}>
      <Container maxW="1200px" px={{ base: 4, md: 6 }}>
        <VStack gap={10} align="stretch">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={10}>
            {/* Company Info */}
            <VStack align={{ base: "center", md: "flex-start" }} gap={4}>
              <Flex align="center" gap="3">
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  letterSpacing="wide"
                  textTransform="uppercase"
                  color={brandColor}
                  fontFamily="mono"
                >
                  UmayRender
                </Text>
                <Badge
                  colorPalette="brand"
                  variant="subtle"
                  fontSize="xs"
                  px="1.5"
                  py="0.5"
                  borderRadius="sm"
                  letterSpacing="tight"
                  fontWeight="medium"
                  textTransform="lowercase"
                  border="1px solid"
                  borderColor={isDark ? "brand.500/20" : "brand.200"}
                >
                  2.0.0 beta
                </Badge>
              </Flex>
              <Text
                color={textMuted}
                textAlign={{ base: "center", md: "left" }}
              >
                Professional-quality HTML href PDF conversion. Free,
                open-source, and without limits.
              </Text>
              <HStack gap={4}>
                <Link
                  href="https://github.com/tolgaand/umay-render"
                  target="_blank"
                  color={textMuted}
                  _hover={{ color: brandColor }}
                  transition="all 0.2s ease"
                >
                  <Box as={LuGithub} boxSize="5" />
                </Link>
                <Link
                  href="https://www.npmjs.com/package/umay-render"
                  target="_blank"
                  color={textMuted}
                  _hover={{ color: brandColor }}
                  transition="all 0.2s ease"
                >
                  <Box as={LuPackage} boxSize="5" />
                </Link>
                <Link
                  href="https://www.nuget.org/packages/UmaySDK/"
                  target="_blank"
                  color={textMuted}
                  _hover={{ color: brandColor }}
                  transition="all 0.2s ease"
                >
                  <Box as={LuBox} boxSize="5" />
                </Link>
              </HStack>
            </VStack>

            {/* Links Section */}
            <Flex justify={{ base: "center", md: "flex-end" }}>
              <VStack align={{ base: "center", md: "flex-start" }} gap={3}>
                <Text fontWeight="bold" mb={1}>
                  Links
                </Text>
                <Box
                  as="span"
                  cursor="pointer"
                  color={textMuted}
                  _hover={{ color: brandColor }}
                  transition="color 0.2s"
                  onClick={goToDemo}
                  display="flex"
                  alignItems="center"
                  gap="2"
                >
                  <Box as={LuPlay} boxSize="4" />
                  <Text>Demo</Text>
                </Box>
                <Box
                  as="span"
                  cursor="pointer"
                  color={textMuted}
                  _hover={{ color: brandColor }}
                  transition="color 0.2s"
                  onClick={goToSamples}
                  display="flex"
                  alignItems="center"
                  gap="2"
                >
                  <Box as={LuBoxes} boxSize="4" />
                  <Text>Samples</Text>
                </Box>
                <Link
                  href="https://github.com/tolgaand/umay-render"
                  target="_blank"
                  color={textMuted}
                  _hover={{ color: brandColor }}
                  transition="color 0.2s"
                  display="flex"
                  alignItems="center"
                  gap="2"
                >
                  <Box as={LuGithub} boxSize="4" />
                  <Text>GitHub</Text>
                </Link>
              </VStack>
            </Flex>
          </SimpleGrid>

          <Box
            pt={6}
            borderTopWidth="1px"
            borderTopColor={borderColor}
            textAlign="center"
          >
            <Text fontSize="sm" color={textMuted}>
              &copy; {new Date().getFullYear()} UmayRender. All rights reserved.
              Made with{" "}
              <Box as={LuHeart} display="inline" mx="1" color="red.400" /> Open
              Source under MIT License.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
