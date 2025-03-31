import {
  Box,
  Container,
  HStack,
  Text,
  Link as ChakraLink,
  Badge,
} from "@chakra-ui/react";
import { ColorModeButton } from "../../components/ui/color-mode";

export default function Navbar() {
  return (
    <Box className="navbar">
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        <HStack justifyContent="space-between" height="70px">
          <HStack gap="2">
            <Text fontSize="2xl" fontWeight="bold" color="brand.solid">
              Umay Render
            </Text>
            <Badge colorScheme="blue" variant="solid" fontSize="xs">
              Beta
            </Badge>
          </HStack>

          <HStack gap="6" display={{ base: "none", md: "flex" }}>
            <ChakraLink
              href="#features"
              color="text.muted"
              fontWeight="500"
              _hover={{ color: "brand.solid" }}
              transition="color 0.2s"
            >
              Features
            </ChakraLink>
            <ChakraLink
              href="https://docs.umay-render.io"
              target="_blank"
              color="text.muted"
              fontWeight="500"
              _hover={{ color: "brand.solid" }}
              transition="color 0.2s"
            >
              Documentation
            </ChakraLink>
            <ColorModeButton />
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}
