import { Box } from "@chakra-ui/react";
import Hero from "./Hero";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Features from "./Features";
import Pricing from "./Pricing";
import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <title>Umay Render - Free HTML to PDF Converter</title>
        <meta
          name="description"
          content="Convert HTML to PDF for free with Umay Render - an open-source, high-performance PDF generation library. No usage limits, no hidden costs, enterprise-grade quality."
        />
        <meta
          name="keywords"
          content="HTML to PDF, HTML to Image, PDF generator, open source PDF, free PDF converter, TypeScript SDK, web to PDF, screenshot service, PDF conversion, document generator"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.umayrender.com/" />
        <meta
          property="og:title"
          content="Umay Render - Free HTML to PDF Converter"
        />
        <meta
          property="og:description"
          content="Convert HTML to PDF for free with Umay Render - an open-source, high-performance PDF generation library."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.umayrender.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Umay Render - Free HTML to PDF Converter"
        />
        <meta
          name="twitter:description"
          content="Convert HTML to PDF for free with Umay Render - an open-source, high-performance PDF generation library."
        />
      </Helmet>

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
