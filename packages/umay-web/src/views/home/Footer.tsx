import {
  Box,
  Container,
  Grid,
  HStack,
  Text,
  VStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { LuGithub, LuPackage, LuHeart } from "react-icons/lu";
import { useColorModeValue } from "../../components/ui/color-mode";

export default function Footer() {
  // Theme colors
  const primaryColor = useColorModeValue("brand.solid", "brand.solid");
  const accentColor = useColorModeValue("accent.solid", "accent.solid");
  const mutedTextColor = useColorModeValue("text.muted", "text.muted");
  const borderColor = useColorModeValue("border.default", "border.default");
  const featureBgColor = useColorModeValue("bg.subtle", "bg.default");

  return (
    <Box py="12" bg={featureBgColor}>
      <Container maxW="container.xl">
        <VStack gap="10">
          <Grid
            templateColumns={{ base: "1fr", md: "2fr 1fr" }}
            gap="8"
            w="full"
          >
            <VStack alignItems="flex-start" gap="4">
              <Text fontSize="xl" fontWeight="bold" color={primaryColor}>
                Umay Render
              </Text>
              <Text color={mutedTextColor}>
                Professional-quality HTML to PDF conversion. Free, open-source,
                and without limits.
              </Text>
              <HStack gap="4">
                <ChakraLink
                  href="https://github.com/tolgaand/umay-render"
                  target="_blank"
                  color={mutedTextColor}
                  _hover={{ color: primaryColor }}
                  transition="all 0.2s ease"
                >
                  <Box as={LuGithub} boxSize="5" />
                </ChakraLink>
                <ChakraLink
                  href="https://www.npmjs.com/package/umay-render"
                  target="_blank"
                  color={mutedTextColor}
                  _hover={{ color: primaryColor }}
                  transition="all 0.2s ease"
                >
                  <Box as={LuPackage} boxSize="5" />
                </ChakraLink>
              </HStack>
            </VStack>

            <VStack alignItems="flex-start" gap="3">
              <Text fontWeight="bold" mb="1">
                Links
              </Text>
              <ChakraLink
                href="#features"
                color={mutedTextColor}
                _hover={{ color: primaryColor }}
                transition="color 0.2s"
              >
                Features
              </ChakraLink>
              <ChakraLink
                href="https://docs.umay-render.io"
                target="_blank"
                color={mutedTextColor}
                _hover={{ color: primaryColor }}
                transition="color 0.2s"
              >
                Documentation
              </ChakraLink>
              <ChakraLink
                href="https://github.com/tolgaand/umay-render"
                target="_blank"
                color={mutedTextColor}
                _hover={{ color: primaryColor }}
                transition="color 0.2s"
              >
                GitHub Repository
              </ChakraLink>
            </VStack>
          </Grid>

          <Box
            py="4"
            borderTopWidth="1px"
            borderTopColor={borderColor}
            w="full"
            textAlign="center"
          >
            <Text fontSize="sm" color={mutedTextColor}>
              &copy; {new Date().getFullYear()} Umay Render. All rights
              reserved. Made with{" "}
              <Box as={LuHeart} display="inline" mx="1" color={accentColor} />{" "}
              Open Source under MIT License.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
