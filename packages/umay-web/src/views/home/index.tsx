import { Box } from "@chakra-ui/react";
import Hero from "./Hero";
import UseCases from "./UseCases";
import Showcase from "./Showcase";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function HomeView() {
  return (
    <Box as="main">
      <Navbar />
      <Hero />
      <UseCases />
      <Showcase />
      <Footer />
    </Box>
  );
}
