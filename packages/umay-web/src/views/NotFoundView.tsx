import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "./home/Navbar";
import Footer from "./home/Footer";

export default function NotFoundView() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Umay Render</title>
        <meta
          name="description"
          content="The page you are looking for does not exist."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navbar />

      <Box py={20} bg="bg.default" minH="calc(100vh - 200px)">
        <Container maxW="container.md">
          <VStack gap={8} textAlign="center">
            <Heading size="4xl" color="brand.500">
              404
            </Heading>
            <Heading size="xl">Page Not Found</Heading>
            <Text fontSize="lg" color="text.muted">
              The page you are looking for doesn't exist or has been moved.
            </Text>

            <Button asChild colorScheme="brand" size="lg" mt={4}>
              <Link to="/">Return to Homepage</Link>
            </Button>
          </VStack>
        </Container>
      </Box>

      <Footer />
    </>
  );
}
