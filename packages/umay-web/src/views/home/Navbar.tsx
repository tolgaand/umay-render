import {
  Box,
  Container,
  HStack,
  Text,
  Badge,
  Button,
  Icon,
  Menu,
  Portal,
  Flex,
  Link,
} from "@chakra-ui/react";
import { LuGithub, LuMenu } from "react-icons/lu";
import { useTheme } from "next-themes";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { ColorModeButton } from "../../components/ui/color-mode";

export default function Navbar() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const navigate = useNavigate();

  // Navigation handlers
  const goToDemo = () => navigate("/demos");

  return (
    <Box
      as="nav"
      className="navbar"
      position="sticky"
      top="0"
      zIndex="50"
      backdropFilter="blur(12px)"
      bg={isDark ? "gray.900/90" : "white/90"}
      borderBottom="1px solid"
      borderColor={isDark ? "gray.800" : "gray.200"}
      transition="all 0.2s ease-in-out"
    >
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        <Flex h="70px" align="center" justify="space-between">
          {/* Logo & Brand */}
          <Link
            asChild
            _hover={{ textDecoration: "none" }}
            display="flex"
            alignItems="center"
            gap="3"
          >
            <ReactRouterLink to="/">
              <Text
                fontWeight="bold"
                fontSize="xl"
                letterSpacing="wide"
                textTransform="uppercase"
                color={isDark ? "brand.300" : "brand.600"}
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
            </ReactRouterLink>
          </Link>

          {/* Desktop Navigation */}
          <HStack gap="6" display={{ base: "none", md: "flex" }}>
            {/* Demo Link */}
            <Box
              as="button"
              fontWeight="500"
              color={isDark ? "brand.300" : "brand.600"}
              _hover={{ color: "brand.solid" }}
              transition="color 0.2s"
              display="flex"
              alignItems="center"
              gap="1"
              onClick={goToDemo}
              bg="transparent"
              cursor="pointer"
            >
              <Text>Examples</Text>
            </Box>

            {/* GitHub Link - External, keep as normal link */}
            <Link
              href="https://github.com/tolgaand/umay-render"
              target="_blank"
              color={isDark ? "brand.300" : "brand.600"}
              _hover={{ color: "brand.solid" }}
              transition="color 0.2s"
              display="flex"
              alignItems="center"
              gap="1"
            >
              <Icon as={LuGithub} />
              <Text>GitHub</Text>
            </Link>

            {/* Theme Toggle */}
            <ColorModeButton />
          </HStack>

          {/* Mobile Navigation */}
          <Box display={{ base: "block", md: "none" }}>
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button aria-label="Open Menu" variant="ghost" size="md">
                  <Icon as={LuMenu} boxSize="1.5em" />
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content zIndex="popover">
                    <Box as="div">
                      <Box
                        as="button"
                        width="100%"
                        textAlign="left"
                        onClick={goToDemo}
                        px="4"
                        py="2"
                        _hover={{ bg: isDark ? "gray.700" : "gray.100" }}
                        cursor="pointer"
                      >
                        <Flex align="center" gap="2">
                          <span>Examples</span>
                        </Flex>
                      </Box>
                    </Box>

                    <Box as="div">
                      <Link
                        href="https://github.com/tolgaand/umay-render"
                        target="_blank"
                        _hover={{ textDecoration: "none" }}
                        display="block"
                        px="4"
                        py="2"
                      >
                        <Flex align="center" gap="2">
                          <Icon as={LuGithub} />
                          <span>GitHub</span>
                        </Flex>
                      </Link>
                    </Box>

                    <ColorModeButton />
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
