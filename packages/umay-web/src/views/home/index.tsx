import { Box } from "@chakra-ui/react";
import Hero from "./Hero";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Features from "./Features";
import Pricing from "./Pricing";
// import Architecture from "./Architecture";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useState } from "react";
import ConversionDialog from "./ConversionDialog";

// Register ScrollTrigger plugin only once at the root level
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Declare the global property
declare global {
  interface Window {
    openUmayConversionDialog?: () => void;
  }
}

export default function HomeView() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const openConversionDialog = () => {
    setDialogOpen(true);
  };

  const closeConversionDialog = () => {
    setDialogOpen(false);
  };

  // Make the conversion dialog available globally for any component to open
  if (typeof window !== "undefined") {
    window.openUmayConversionDialog = openConversionDialog;
  }

  return (
    <Box
      as="main"
      background="linear-gradient(to bottom, var(--umay-colors-page-from), var(--umay-colors-page-mid), var(--umay-colors-page-to))"
      minHeight="100vh"
      backgroundAttachment="fixed"
    >
      <Navbar />
      <Hero />
      {/* <Architecture /> */}
      <Features />
      <Pricing />
      <Footer />

      {/* Conversion Dialog for Try It functionality */}
      <ConversionDialog open={dialogOpen} onClose={closeConversionDialog} />
    </Box>
  );
}
