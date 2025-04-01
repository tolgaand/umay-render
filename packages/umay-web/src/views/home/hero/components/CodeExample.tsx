import { Box, Button, HStack, Icon } from "@chakra-ui/react";
import { LuCode, LuCopy, LuTerminal } from "react-icons/lu";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  solarizedlight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { IconType } from "react-icons";

interface Language {
  id: string;
  name: string;
  color: string;
  icon: IconType;
}

export function CodeExample() {
  const [currentLang, setCurrentLang] = useState(0);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const codeTheme = isDark ? vscDarkPlus : solarizedlight;

  const languages: Language[] = [
    { id: "typescript", name: "TypeScript", color: "blue.500", icon: LuCode },
    { id: "csharp", name: "C#", color: "purple.500", icon: LuTerminal },
  ];

  const codeExamples = {
    typescript: `import { UmaySDK } from 'umay-render';
   
const umay = new UmaySDK();
const result = await umay.render({
  html: '<h1>Hello World</h1>',
  outputFormat: 'pdf'
});`,

    csharp: `using UmayRender;

var umay = new UmaySDK();
var result = await umay.Render(new RenderOptions {
    Html = "<h1>Hello World</h1>",
    OutputFormat = OutputFormat.Pdf
});`,
  };

  // Animate languages cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLang((prev) => (prev + 1) % languages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [languages.length]);

  // Handle language tab change
  const handleTabChange = (index: number) => {
    setCurrentLang(index);
  };

  return (
    <Box maxW="800px" mx="auto" mb="10" data-code-editor="true">
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
              <Box w="3" h="3" borderRadius="full" bg="yellow.500" />
              <Box w="3" h="3" borderRadius="full" bg="green.500" />
            </HStack>
            <HStack>
              {languages.map((lang, idx) => (
                <HStack
                  key={lang.id}
                  as="button"
                  fontSize="xs"
                  fontFamily="mono"
                  color={
                    idx === currentLang
                      ? lang.color
                      : isDark
                      ? "gray.400"
                      : "gray.600"
                  }
                  fontWeight={idx === currentLang ? "bold" : "normal"}
                  px="2"
                  py="1"
                  borderRadius="md"
                  bg={
                    idx === currentLang
                      ? isDark
                        ? "gray.800"
                        : "gray.100"
                      : "transparent"
                  }
                  onClick={() => handleTabChange(idx)}
                  transition="all 0.2s"
                  _hover={{
                    color: lang.color,
                    bg: isDark ? "gray.800" : "gray.100",
                  }}
                >
                  <Icon as={lang.icon} mr="1" />
                  {lang.name}
                </HStack>
              ))}
            </HStack>
          </HStack>
        </Box>
        <Box position="relative" zIndex="1" minHeight="200px">
          {languages.map((lang, idx) => (
            <Box
              key={lang.id}
              position="absolute"
              top="0"
              left="0"
              right="0"
              opacity={idx === currentLang ? 1 : 0}
              transform={`translateY(${idx === currentLang ? 0 : 10}px)`}
              transition="all 0.3s ease"
              zIndex={idx === currentLang ? 2 : 1}
            >
              <SyntaxHighlighter
                language={lang.id === "csharp" ? "csharp" : lang.id}
                style={codeTheme}
                customStyle={{
                  margin: 0,
                  padding: "16px",
                  background: "transparent",
                  fontSize: "14px",
                  minHeight: "200px",
                }}
              >
                {codeExamples[lang.id as keyof typeof codeExamples]}
              </SyntaxHighlighter>
            </Box>
          ))}
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
              const currentCode =
                codeExamples[
                  languages[currentLang].id as keyof typeof codeExamples
                ];
              navigator.clipboard.writeText(currentCode);
            }}
          >
            <Icon as={LuCopy} />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
