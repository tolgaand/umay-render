import { Box, Button, Container, HStack, Text, VStack } from "@chakra-ui/react";
import { useColorModeValue } from "../../components/ui/color-mode";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LanguageTabs() {
  const [activeTab, setActiveTab] =
    useState<keyof typeof codeExamples>("javascript");
  const [codeTransition, setCodeTransition] = useState(true);
  const languageTabsRef = useRef<HTMLDivElement>(null);

  const textColor = useColorModeValue("text.default", "text.default");
  const mutedTextColor = useColorModeValue("text.muted", "text.muted");
  const borderColor = useColorModeValue("border.default", "border.default");

  const codeExamples = {
    javascript: `import { UmaySDK } from 'umay-render';
  
const umay = new UmaySDK();
const result = await umay.render({
  html: '<h1>Hello World</h1>',
  outputFormat: 'pdf'
});`,

    python: `from umay_render import UmaySDK
  
umay = UmaySDK()
result = umay.render(
    html="<h1>Hello World</h1>",
    output_format="pdf"
)`,

    golang: `package main
  
import "github.com/umay/render-go"
  
func main() {
    umay := render.NewUmaySDK()
    result, err := umay.Render(render.RenderInput{
        HTML: "<h1>Hello World</h1>",
        OutputFormat: "pdf",
    })
}`,

    ruby: `require 'umay_render'
  
umay = UmayRender::SDK.new
result = umay.render(
  html: '<h1>Hello World</h1>',
  output_format: 'pdf'
)`,

    php: `<?php
$umay = new \\Umay\\Render\\SDK();
$result = $umay->render([
    'html' => '<h1>Hello World</h1>',
    'output_format' => 'pdf'
]);
?>`,
  };

  const languages = [
    { id: "javascript", name: "JavaScript" },
    { id: "python", name: "Python" },
    { id: "golang", name: "Go" },
    { id: "ruby", name: "Ruby" },
    { id: "php", name: "PHP" },
  ];

  // Setup animations when component mounts
  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined" || !languageTabsRef.current) return;

    // Animate the language tabs section
    gsap.fromTo(
      languageTabsRef.current.querySelectorAll(".animate-fade-in"),
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: languageTabsRef.current,
          start: "top 80%",
        },
      }
    );

    // Setup interval for language tab rotation
    const tabInterval = setInterval(() => {
      setActiveTab((prevTab) => {
        const currentIndex = languages.findIndex((lang) => lang.id === prevTab);
        const nextIndex = (currentIndex + 1) % languages.length;
        return languages[nextIndex].id as keyof typeof codeExamples;
      });
    }, 5000);

    return () => clearInterval(tabInterval);
  }, []);

  return (
    <Box py="16" id="languages" ref={languageTabsRef}>
      <Container maxW="container.xl">
        <VStack gap="12">
          <VStack gap="4">
            <Text
              as="h2"
              fontSize="3xl"
              fontWeight="bold"
              textAlign="center"
              color={textColor}
            >
              SDKs For All Major Languages
            </Text>
            <Text
              fontSize="lg"
              color={mutedTextColor}
              maxW="3xl"
              textAlign="center"
              className="animate-fade-in"
            >
              Our SDKs provide seamless integration across popular programming
              languages, making HTML to PDF conversion effortless in any tech
              stack.
            </Text>
          </VStack>

          <Box w="full" maxW="3xl" mx="auto" className="animate-fade-in">
            <HStack justifyContent="center" overflowX="auto" gap="4" py="4">
              {languages.map((lang) => (
                <Button
                  key={lang.id}
                  variant={activeTab === lang.id ? "solid" : "ghost"}
                  colorScheme={activeTab === lang.id ? "blue" : "gray"}
                  onClick={() => {
                    // Use React state for animation instead of DOM manipulation
                    setCodeTransition(false);
                    setTimeout(() => {
                      setActiveTab(lang.id as keyof typeof codeExamples);
                      setCodeTransition(true);
                    }, 50);
                  }}
                  transition="all 0.4s cubic-bezier(0.22, 1, 0.36, 1)"
                  _hover={{ transform: "translateY(-2px)" }}
                  className={`language-tab ${
                    activeTab === lang.id ? "active" : ""
                  }`}
                >
                  {lang.name}
                </Button>
              ))}
            </HStack>

            <Box
              border="1px"
              borderColor={borderColor}
              rounded="xl"
              overflow="hidden"
              mt="6"
              bg={useColorModeValue("bg.subtle", "bg.muted")}
              color={useColorModeValue("gray.800", "gray.200")}
              transform="translateZ(0)"
              transition="all 0.4s cubic-bezier(0.22, 1, 0.36, 1)"
              _hover={{
                transform: "translateY(-5px)",
                boxShadow: "xl",
              }}
              boxShadow="md"
              className="card-hover"
            >
              <Box
                py="2"
                px="4"
                borderBottomWidth="1px"
                borderColor={useColorModeValue("gray.200", "gray.600")}
                bg={useColorModeValue("gray.100", "bg.subtle")}
              >
                <HStack gap="2">
                  <Box w="3" h="3" borderRadius="full" bg="red.500" />
                  <Box w="3" h="3" borderRadius="full" bg="yellow.500" />
                  <Box w="3" h="3" borderRadius="full" bg="green.500" />
                  <Text ml="2" fontSize="sm">
                    {languages.find((l) => l.id === activeTab)?.name}
                  </Text>
                </HStack>
              </Box>
              <Box
                p="6"
                fontFamily="mono"
                fontSize="sm"
                whiteSpace="pre"
                overflowX="auto"
                position="relative"
                className={`code-transition ${codeTransition ? "active" : ""}`}
              >
                {codeExamples[activeTab]}
              </Box>
            </Box>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
