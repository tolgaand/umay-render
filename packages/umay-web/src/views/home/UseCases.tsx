import {
  Box,
  Text,
  VStack,
  SimpleGrid,
  Icon,
  Container,
  Flex,
} from "@chakra-ui/react";
import { LuFileText, LuFileCheck, LuInbox, LuCode } from "react-icons/lu";
import { useColorModeValue } from "../../components/ui/color-mode";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TryItButton from "./TryItButton";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function UseCases() {
  const useCasesRef = useRef<HTMLDivElement>(null);

  // Theme colors
  const primaryColor = useColorModeValue("brand.600", "brand.400");
  const bgSection = useColorModeValue("gray.50", "gray.900");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Setup animations when component mounts
  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined" || !useCasesRef.current) return;

    const elements = useCasesRef.current.querySelectorAll(
      "[data-animate='true']"
    );

    // Animate elements
    gsap.fromTo(
      elements,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: useCasesRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <Box
      bg={bgSection}
      py={{ base: "8", md: "12" }}
      ref={useCasesRef}
      position="relative"
    >
      <Container maxW="container.xl">
        {/* Use Cases Section */}
        <Box mb="10">
          <VStack gap="8" align="center" mb="8">
            <Text
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="bold"
              data-animate="true"
              color={primaryColor}
              pb="2"
              borderBottom="3px solid"
              borderColor={primaryColor}
            >
              Popular Use Cases
            </Text>

            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 4 }}
              gap="5"
              width="full"
              data-animate="true"
            >
              <VStack
                p="5"
                borderRadius="lg"
                bg={useColorModeValue("white", "gray.800")}
                border="1px solid"
                borderColor={borderColor}
                gap="3"
                align="flex-start"
                shadow="md"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  shadow: "lg",
                  borderColor: "blue.200",
                }}
                height="full"
              >
                <Icon as={LuFileText} boxSize="6" color={primaryColor} />
                <Text fontSize="md" fontWeight="bold">
                  Monthly Invoices
                </Text>
                <Text fontSize="sm" color={mutedTextColor}>
                  Generate customized invoices automatically with your branding
                  and details
                </Text>
                <Flex mt="auto" pt="3" w="full" justifyContent="center">
                  <TryItButton size="sm" variant="outline" />
                </Flex>
              </VStack>

              <VStack
                p="5"
                borderRadius="lg"
                bg={useColorModeValue("white", "gray.800")}
                border="1px solid"
                borderColor={borderColor}
                gap="3"
                align="flex-start"
                shadow="md"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  shadow: "lg",
                  borderColor: "purple.200",
                }}
                height="full"
              >
                <Icon as={LuFileCheck} boxSize="6" color="purple.500" />
                <Text fontSize="md" fontWeight="bold">
                  Legal Documents
                </Text>
                <Text fontSize="sm" color={mutedTextColor}>
                  Create contracts with perfect formatting, pagination and
                  headers
                </Text>
                <Flex mt="auto" pt="3" w="full" justifyContent="center">
                  <TryItButton
                    size="sm"
                    variant="outline"
                    colorScheme="purple"
                  />
                </Flex>
              </VStack>

              <VStack
                p="5"
                borderRadius="lg"
                bg={useColorModeValue("white", "gray.800")}
                border="1px solid"
                borderColor={borderColor}
                gap="3"
                align="flex-start"
                shadow="md"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  shadow: "lg",
                  borderColor: "green.200",
                }}
                height="full"
              >
                <Icon as={LuInbox} boxSize="6" color="green.500" />
                <Text fontSize="md" fontWeight="bold">
                  Financial Reports
                </Text>
                <Text fontSize="sm" color={mutedTextColor}>
                  Convert data-rich reports to PDF with charts and tables intact
                </Text>
                <Flex mt="auto" pt="3" w="full" justifyContent="center">
                  <TryItButton
                    size="sm"
                    variant="outline"
                    colorScheme="green"
                  />
                </Flex>
              </VStack>

              <VStack
                p="5"
                borderRadius="lg"
                bg={useColorModeValue("white", "gray.800")}
                border="1px solid"
                borderColor={borderColor}
                gap="3"
                align="flex-start"
                shadow="md"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  shadow: "lg",
                  borderColor: "orange.200",
                }}
                height="full"
              >
                <Icon as={LuCode} boxSize="6" color="orange.500" />
                <Text fontSize="md" fontWeight="bold">
                  API Integration
                </Text>
                <Text fontSize="sm" color={mutedTextColor}>
                  Connect to your existing platforms with our simple REST API
                </Text>
                <Flex mt="auto" pt="3" w="full" justifyContent="center">
                  <TryItButton
                    size="sm"
                    variant="outline"
                    colorScheme="orange"
                  />
                </Flex>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
