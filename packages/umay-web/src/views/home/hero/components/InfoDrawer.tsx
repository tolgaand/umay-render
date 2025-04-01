import {
  Box,
  Drawer,
  HStack,
  Text,
  VStack,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { LuCode, LuTerminal } from "react-icons/lu";
import { useTheme } from "next-themes";

interface InfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoDrawer({ isOpen, onClose }: InfoDrawerProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const languages = [
    { id: "typescript", name: "TypeScript", color: "blue.500", icon: LuCode },
    { id: "csharp", name: "C#", color: "purple.500", icon: LuTerminal },
  ];

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(details) => (details.open ? undefined : onClose())}
    >
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content bg={isDark ? "gray.800" : "white"}>
          <Drawer.Header
            borderBottomWidth="1px"
            borderColor={isDark ? "gray.700" : "gray.200"}
          >
            <Drawer.Title>About Umay Render</Drawer.Title>
            <Drawer.CloseTrigger />
          </Drawer.Header>
          <Drawer.Body p="6">
            <VStack align="flex-start" gap="4">
              <Text fontSize="lg" lineHeight="tall">
                Umay Render is a powerful HTML to PDF conversion library that
                enables you to create beautiful, pixel-perfect PDF documents
                from HTML templates.
              </Text>

              <Text fontSize="lg" fontWeight="medium" mt="2">
                Our engine supports:
              </Text>

              <Box as="ul" pl="6" w="full" fontSize="md">
                <Box as="li" mb="3">
                  Full CSS support including Flexbox and Grid
                </Box>
                <Box as="li" mb="3">
                  Custom fonts and images
                </Box>
                <Box as="li" mb="3">
                  Headers and footers
                </Box>
                <Box as="li" mb="3">
                  Page numbers
                </Box>
                <Box as="li" mb="3">
                  JavaScript execution
                </Box>
              </Box>

              <Text fontSize="lg" fontWeight="medium" mt="2">
                Available in multiple languages:
              </Text>

              <HStack gap="4" flexWrap="wrap">
                {languages.map((lang) => (
                  <Flex
                    key={lang.id}
                    align="center"
                    bg={isDark ? "gray.700" : "gray.100"}
                    color={isDark ? "white" : "gray.800"}
                    borderRadius="lg"
                    p="3"
                    shadow="sm"
                  >
                    <Icon
                      as={lang.icon}
                      color={lang.color}
                      boxSize="5"
                      mr="2"
                    />
                    <Text fontWeight="medium">{lang.name}</Text>
                  </Flex>
                ))}
              </HStack>
            </VStack>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}
