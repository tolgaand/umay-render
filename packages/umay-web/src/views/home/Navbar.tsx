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
import {
  LuGithub,
  LuMenu,
  LuMoon,
  LuSun,
  LuBoxes,
  LuPlay,
} from "react-icons/lu";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = mounted ? resolvedTheme === "dark" : false;

  // Prevent theme flash by waiting for client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

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
      style={{
        opacity: mounted ? 1 : 0,
      }}
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
                2.0.0
              </Badge>
            </ReactRouterLink>
          </Link>

          {/* Desktop Navigation */}
          <HStack gap="6" display={{ base: "none", md: "flex" }}>
            {/* Demo Link */}
            <Link
              asChild
              fontWeight="500"
              color="text.muted"
              _hover={{ color: "brand.solid" }}
              transition="color 0.2s"
              display="flex"
              alignItems="center"
              gap="1"
            >
              <ReactRouterLink to="/demo">
                <Icon as={LuPlay} />
                <Text>Demo</Text>
              </ReactRouterLink>
            </Link>

            {/* Samples Link */}
            <Link
              asChild
              fontWeight="500"
              color="text.muted"
              _hover={{ color: "brand.solid" }}
              transition="color 0.2s"
              display="flex"
              alignItems="center"
              gap="1"
            >
              <ReactRouterLink to="/samples">
                <Icon as={LuBoxes} />
                <Text>Samples</Text>
              </ReactRouterLink>
            </Link>

            {/* GitHub Link - External, keep as normal link */}
            <Link
              href="https://github.com/tolgaand/umay-render"
              target="_blank"
              color="text.muted"
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
            <Button
              aria-label="Toggle Color Mode"
              size="sm"
              variant="ghost"
              onClick={toggleTheme}
            >
              <Icon as={isDark ? LuSun : LuMoon} boxSize="1.1em" />
            </Button>
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
                      <Link
                        as={ReactRouterLink}
                        href="/demo"
                        _hover={{ textDecoration: "none" }}
                        display="block"
                        px="4"
                        py="2"
                      >
                        <Flex align="center" gap="2">
                          <Icon as={LuPlay} />
                          <span>Demo</span>
                        </Flex>
                      </Link>
                    </Box>

                    <Box as="div">
                      <Link
                        as={ReactRouterLink}
                        href="/samples"
                        _hover={{ textDecoration: "none" }}
                        display="block"
                        px="4"
                        py="2"
                      >
                        <Flex align="center" gap="2">
                          <Icon as={LuBoxes} />
                          <span>Samples</span>
                        </Flex>
                      </Link>
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

                    <Box
                      as="div"
                      px="4"
                      py="2"
                      cursor="pointer"
                      onClick={toggleTheme}
                    >
                      <Flex align="center" gap="2">
                        <Icon as={isDark ? LuSun : LuMoon} />
                        <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                      </Flex>
                    </Box>
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
