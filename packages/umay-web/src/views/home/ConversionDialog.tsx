import {
  Button,
  CloseButton,
  Flex,
  Box,
  Text,
  Icon,
  Input,
  VStack,
  HStack,
  Select,
  Switch,
  Grid,
  GridItem,
  Tabs,
  Accordion,
  Field,
  createListCollection,
  DialogPositioner,
  DialogCloseTrigger,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import {
  LuDownload,
  LuUpload,
  LuRefreshCw,
  LuCode,
  LuEye,
  LuFile,
  LuSettings,
  LuChevronDown,
  LuLayoutDashboard,
} from "react-icons/lu";
import { toaster } from "../../components/ui/toaster.tsx";
import { useColorModeValue } from "../../components/ui/color-mode";
import Editor from "@monaco-editor/react";
import {
  RenderInput,
  UmaySDK,
  PageSetupOptions,
  PdfOutputOptions,
} from "umay-render";
import { templates, getTemplateById } from "../../templates/templates";
import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogBody,
} from "../../components/ui/dialog.tsx";

interface ConversionDialogProps {
  open: boolean;
  onClose: () => void;
}

// Initialize UmaySDK
const umay = new UmaySDK({
  ...(import.meta.env.DEV && {
    API_URL: "https://api.umayrender.com/v1",
  }),
});

// Create collections for select components
const mediaTypeOptions = createListCollection({
  items: [
    { label: "Screen", value: "screen" },
    { label: "Print", value: "print" },
  ],
});

const waitUntilOptions = createListCollection({
  items: [
    { label: "Load", value: "load" },
    { label: "DOM Content Loaded", value: "domcontentloaded" },
    { label: "Network Idle (0)", value: "networkidle0" },
    { label: "Network Idle (2)", value: "networkidle2" },
  ],
});

const paperFormatOptions = createListCollection({
  items: [
    { label: "Letter", value: "Letter" },
    { label: "Legal", value: "Legal" },
    { label: "Tabloid", value: "Tabloid" },
    { label: "A0", value: "A0" },
    { label: "A1", value: "A1" },
    { label: "A2", value: "A2" },
    { label: "A3", value: "A3" },
    { label: "A4", value: "A4" },
    { label: "A5", value: "A5" },
    { label: "A6", value: "A6" },
  ],
});

export default function ConversionDialog({
  open,
  onClose,
}: ConversionDialogProps) {
  const [htmlContent, setHtmlContent] = useState(getTemplateById("invoice"));
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [activeTab, setActiveTab] = useState("editor");
  const [selectedTemplate, setSelectedTemplate] = useState("invoice");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configuration options
  const [config, setConfig] = useState<{
    pageSetupOptions: PageSetupOptions;
    pdfOptions: PdfOutputOptions;
  }>({
    pageSetupOptions: {
      viewport: {
        width: 1280,
        height: 720,
      },
      emulateMediaType: "screen",
      waitUntil: "networkidle0",
      waitForTimeout: 30000,
    },
    pdfOptions: {
      format: "A4",
      printBackground: true,
      margin: {
        top: "1cm",
        right: "1cm",
        bottom: "1cm",
        left: "1cm",
      },
    },
  });

  // Theme colors - pre-calculated to avoid conditional hook calls
  const primaryColor = useColorModeValue("brand.600", "brand.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const cardBg = useColorModeValue("white", "gray.800");
  const codeBg = useColorModeValue("gray.50", "gray.900");
  const subtleBg = useColorModeValue("gray.50", "gray.900");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  // Additional colors to avoid conditional hook calls
  const whiteOrGray900 = useColorModeValue("white", "gray.900");
  const green50OrGreen900 = useColorModeValue("green.50", "green.900");
  const gray50OrGray900 = useColorModeValue("gray.50", "gray.900");
  const gray100OrGray800 = useColorModeValue("gray.100", "gray.800");
  const tabBg = useColorModeValue("bg.muted", "gray.800");

  // State for select values
  const [mediaTypeValue, setMediaTypeValue] = useState<string[]>([
    config.pageSetupOptions?.emulateMediaType || "screen",
  ]);
  const [waitUntilValue, setWaitUntilValue] = useState<string[]>([
    typeof config.pageSetupOptions?.waitUntil === "string"
      ? config.pageSetupOptions?.waitUntil
      : "networkidle0",
  ]);
  const [paperFormatValue, setPaperFormatValue] = useState<string[]>([
    config.pdfOptions?.format || "A4",
  ]);
  const [templateValue, setTemplateValue] = useState<string[]>([
    selectedTemplate,
  ]);

  // Effect to handle template selection
  useEffect(() => {
    if (selectedTemplate) {
      setHtmlContent(getTemplateById(selectedTemplate));
      setTemplateValue([selectedTemplate]);
    }
  }, [selectedTemplate]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setHtmlContent(content);
      setFileUploaded(true);
      setUploadedFileName(file.name);
      setSelectedTemplate(""); // Clear selected template when uploading a file

      toaster.create({
        title: "File uploaded successfully",
        description: `${file.name} is ready for conversion`,
        type: "success",
        duration: 3000,
      });
    };
    reader.readAsText(file);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setHtmlContent(value);
    }
  };

  const handleConfigChange = (
    section: "pageSetupOptions" | "pdfOptions",
    field: string,
    value: unknown
  ) => {
    setConfig((prev) => {
      // Create a deep copy of the current state with all required fields
      const newState = {
        pageSetupOptions: {
          viewport: {
            width: prev.pageSetupOptions?.viewport?.width ?? 1280,
            height: prev.pageSetupOptions?.viewport?.height ?? 720,
            ...prev.pageSetupOptions?.viewport,
          },
          emulateMediaType: prev.pageSetupOptions?.emulateMediaType ?? "screen",
          waitUntil: prev.pageSetupOptions?.waitUntil ?? "networkidle0",
          waitForTimeout: prev.pageSetupOptions?.waitForTimeout ?? 30000,
          ...prev.pageSetupOptions,
        },
        pdfOptions: {
          format: prev.pdfOptions?.format ?? "A4",
          printBackground: prev.pdfOptions?.printBackground ?? true,
          margin: {
            top: prev.pdfOptions?.margin?.top ?? "1cm",
            right: prev.pdfOptions?.margin?.right ?? "1cm",
            bottom: prev.pdfOptions?.margin?.bottom ?? "1cm",
            left: prev.pdfOptions?.margin?.left ?? "1cm",
            ...prev.pdfOptions?.margin,
          },
          ...prev.pdfOptions,
        },
      };

      // For nested objects like viewport or margin
      if (field.includes(".")) {
        const [parent, child] = field.split(".");

        if (section === "pageSetupOptions" && parent === "viewport") {
          newState.pageSetupOptions.viewport = {
            ...newState.pageSetupOptions.viewport,
            [child]: value,
          };
        } else if (section === "pdfOptions" && parent === "margin") {
          newState.pdfOptions.margin = {
            ...newState.pdfOptions.margin,
            [child]: value,
          };
        }
      } else {
        // For direct properties
        if (section === "pageSetupOptions") {
          newState.pageSetupOptions = {
            ...newState.pageSetupOptions,
            [field]: value,
          };
        } else {
          newState.pdfOptions = {
            ...newState.pdfOptions,
            [field]: value,
          };
        }
      }

      return newState;
    });
  };

  const handleConvert = async () => {
    try {
      setIsLoading(true);

      // Use UmaySDK for actual conversion with config options
      const renderInput: RenderInput = {
        html: htmlContent,
        outputFormat: "pdf",
        pageSetupOptions: config.pageSetupOptions,
        pdfOptions: config.pdfOptions,
      };

      console.log("Converting HTML using UmaySDK with config:", renderInput);
      const result = await umay.render(renderInput);

      if (result) {
        // Create a blob from the result and create an object URL
        const blob = new Blob([result], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);

        toaster.create({
          title: "Conversion successful",
          type: "success",
          duration: 3000,
        });
      } else {
        throw new Error("No result from conversion");
      }
    } catch (error) {
      console.error("PDF conversion error:", error);
      toaster.create({
        title: "Conversion failed",
        description: "There was an error converting your HTML to PDF",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = fileUploaded
      ? uploadedFileName.replace(/\.[^/.]+$/, "") + ".pdf"
      : "generated-document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render PDF and HTML conversion options
  const renderConfigOptions = () => (
    <VStack gap={4} align="stretch" p={4} h="full" overflowY="auto">
      <Tabs.Root defaultValue="pageSetup" size="sm">
        <Tabs.List bg={tabBg} rounded="lg" p="1">
          <Tabs.Trigger value="pageSetup">
            <Flex align="center" gap={2}>
              <Icon as={LuLayoutDashboard} />
              Page Setup
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="pdfOptions">
            <Flex align="center" gap={2}>
              <Icon as={LuSettings} />
              PDF Options
            </Flex>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="pageSetup" pt={4}>
          <Accordion.Root defaultValue={["viewport", "render"]}>
            <Accordion.Item value="viewport">
              <Accordion.ItemTrigger>
                <Box as="span" flex="1" textAlign="left" fontWeight="medium">
                  Viewport Settings
                </Box>
                <Icon as={LuChevronDown} />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody pt={2}>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <GridItem>
                      <Field.Root>
                        <Field.Label fontSize="sm">Width (px)</Field.Label>
                        <Input
                          type="number"
                          value={
                            config.pageSetupOptions?.viewport?.width || 1280
                          }
                          onChange={(e) =>
                            handleConfigChange(
                              "pageSetupOptions",
                              "viewport.width",
                              parseInt(e.target.value)
                            )
                          }
                          size="sm"
                        />
                      </Field.Root>
                    </GridItem>
                    <GridItem>
                      <Field.Root>
                        <Field.Label fontSize="sm">Height (px)</Field.Label>
                        <Input
                          type="number"
                          value={
                            config.pageSetupOptions?.viewport?.height || 720
                          }
                          onChange={(e) =>
                            handleConfigChange(
                              "pageSetupOptions",
                              "viewport.height",
                              parseInt(e.target.value)
                            )
                          }
                          size="sm"
                        />
                      </Field.Root>
                    </GridItem>
                  </Grid>

                  <Field.Root mt={4}>
                    <Field.Label fontSize="sm">Device Scale Factor</Field.Label>
                    <Input
                      type="number"
                      value={
                        config.pageSetupOptions?.viewport?.deviceScaleFactor ||
                        1
                      }
                      onChange={(e) =>
                        handleConfigChange(
                          "pageSetupOptions",
                          "viewport.deviceScaleFactor",
                          parseFloat(e.target.value)
                        )
                      }
                      size="sm"
                      step={0.1}
                      min={0.1}
                      max={3}
                    />
                  </Field.Root>

                  <Field.Root mt={4} display="flex" alignItems="center">
                    <Field.Label htmlFor="is-mobile" mb="0" fontSize="sm">
                      Mobile Emulation
                    </Field.Label>
                    <Switch.Root
                      id="is-mobile"
                      checked={config.pageSetupOptions?.viewport?.isMobile}
                      onChange={() =>
                        handleConfigChange(
                          "pageSetupOptions",
                          "viewport.isMobile",
                          !config.pageSetupOptions?.viewport?.isMobile
                        )
                      }
                      colorScheme="brand"
                    >
                      <Switch.HiddenInput />
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch.Root>
                  </Field.Root>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>

            <Accordion.Item value="render">
              <Accordion.ItemTrigger>
                <Box as="span" flex="1" textAlign="left" fontWeight="medium">
                  Render Settings
                </Box>
                <Icon as={LuChevronDown} />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody pt={2}>
                  <Field.Root mb={4}>
                    <Field.Label fontSize="sm">Media Type</Field.Label>
                    <Select.Root
                      collection={mediaTypeOptions}
                      size="sm"
                      value={mediaTypeValue}
                      onValueChange={(e) => {
                        setMediaTypeValue(e.value);
                        handleConfigChange(
                          "pageSetupOptions",
                          "emulateMediaType",
                          e.value[0]
                        );
                      }}
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Select.Positioner>
                        <Select.Content>
                          {mediaTypeOptions.items.map((option) => (
                            <Select.Item item={option} key={option.value}>
                              {option.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                  </Field.Root>

                  <Field.Root mb={4}>
                    <Field.Label fontSize="sm">Wait Until</Field.Label>
                    <Select.Root
                      collection={waitUntilOptions}
                      size="sm"
                      value={waitUntilValue}
                      onValueChange={(e) => {
                        setWaitUntilValue(e.value);
                        handleConfigChange(
                          "pageSetupOptions",
                          "waitUntil",
                          e.value[0]
                        );
                      }}
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Select.Positioner>
                        <Select.Content>
                          {waitUntilOptions.items.map((option) => (
                            <Select.Item item={option} key={option.value}>
                              {option.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                  </Field.Root>

                  <Field.Root mb={4}>
                    <Field.Label fontSize="sm">Wait Timeout (ms)</Field.Label>
                    <Input
                      type="number"
                      value={config.pageSetupOptions?.waitForTimeout || 30000}
                      onChange={(e) =>
                        handleConfigChange(
                          "pageSetupOptions",
                          "waitForTimeout",
                          parseInt(e.target.value)
                        )
                      }
                      size="sm"
                    />
                  </Field.Root>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          </Accordion.Root>
        </Tabs.Content>

        <Tabs.Content value="pdfOptions" pt={4}>
          <Accordion.Root defaultValue={["format", "margins", "advanced"]}>
            <Accordion.Item value="format">
              <Accordion.ItemTrigger>
                <Box as="span" flex="1" textAlign="left" fontWeight="medium">
                  Page Format
                </Box>
                <Icon as={LuChevronDown} />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody pt={2}>
                  <Field.Root mb={4}>
                    <Field.Label fontSize="sm">Paper Format</Field.Label>
                    <Select.Root
                      collection={paperFormatOptions}
                      size="sm"
                      value={paperFormatValue}
                      onValueChange={(e) => {
                        setPaperFormatValue(e.value);
                        handleConfigChange("pdfOptions", "format", e.value[0]);
                      }}
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Select.Positioner>
                        <Select.Content>
                          {paperFormatOptions.items.map((option) => (
                            <Select.Item item={option} key={option.value}>
                              {option.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                  </Field.Root>

                  <Field.Root mb={4} display="flex" alignItems="center">
                    <Field.Label htmlFor="landscape" mb="0" fontSize="sm">
                      Landscape Orientation
                    </Field.Label>
                    <Switch.Root
                      id="landscape"
                      checked={config.pdfOptions?.landscape}
                      onChange={() =>
                        handleConfigChange(
                          "pdfOptions",
                          "landscape",
                          !config.pdfOptions?.landscape
                        )
                      }
                      colorScheme="brand"
                    >
                      <Switch.HiddenInput />
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch.Root>
                  </Field.Root>

                  <Field.Root mb={4} display="flex" alignItems="center">
                    <Field.Label
                      htmlFor="print-background"
                      mb="0"
                      fontSize="sm"
                    >
                      Print Background
                    </Field.Label>
                    <Switch.Root
                      id="print-background"
                      checked={config.pdfOptions?.printBackground}
                      onChange={() =>
                        handleConfigChange(
                          "pdfOptions",
                          "printBackground",
                          !config.pdfOptions?.printBackground
                        )
                      }
                      colorScheme="brand"
                      defaultChecked
                    >
                      <Switch.HiddenInput />
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch.Root>
                  </Field.Root>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>

            <Accordion.Item value="margins">
              <Accordion.ItemTrigger>
                <Box as="span" flex="1" textAlign="left" fontWeight="medium">
                  Margins
                </Box>
                <Icon as={LuChevronDown} />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody pt={2}>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <GridItem>
                      <Field.Root>
                        <Field.Label fontSize="sm">Top</Field.Label>
                        <Input
                          value={config.pdfOptions?.margin?.top || "1cm"}
                          onChange={(e) =>
                            handleConfigChange(
                              "pdfOptions",
                              "margin.top",
                              e.target.value
                            )
                          }
                          size="sm"
                          placeholder="1cm"
                        />
                      </Field.Root>
                    </GridItem>
                    <GridItem>
                      <Field.Root>
                        <Field.Label fontSize="sm">Right</Field.Label>
                        <Input
                          value={config.pdfOptions?.margin?.right || "1cm"}
                          onChange={(e) =>
                            handleConfigChange(
                              "pdfOptions",
                              "margin.right",
                              e.target.value
                            )
                          }
                          size="sm"
                          placeholder="1cm"
                        />
                      </Field.Root>
                    </GridItem>
                    <GridItem>
                      <Field.Root>
                        <Field.Label fontSize="sm">Bottom</Field.Label>
                        <Input
                          value={config.pdfOptions?.margin?.bottom || "1cm"}
                          onChange={(e) =>
                            handleConfigChange(
                              "pdfOptions",
                              "margin.bottom",
                              e.target.value
                            )
                          }
                          size="sm"
                          placeholder="1cm"
                        />
                      </Field.Root>
                    </GridItem>
                    <GridItem>
                      <Field.Root>
                        <Field.Label fontSize="sm">Left</Field.Label>
                        <Input
                          value={config.pdfOptions?.margin?.left || "1cm"}
                          onChange={(e) =>
                            handleConfigChange(
                              "pdfOptions",
                              "margin.left",
                              e.target.value
                            )
                          }
                          size="sm"
                          placeholder="1cm"
                        />
                      </Field.Root>
                    </GridItem>
                  </Grid>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>

            <Accordion.Item value="advanced">
              <Accordion.ItemTrigger>
                <Box as="span" flex="1" textAlign="left" fontWeight="medium">
                  Advanced Options
                </Box>
                <Icon as={LuChevronDown} />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody pt={2}>
                  <Field.Root mb={4}>
                    <Field.Label fontSize="sm">Page Ranges</Field.Label>
                    <Input
                      value={config.pdfOptions?.pageRanges || ""}
                      onChange={(e) =>
                        handleConfigChange(
                          "pdfOptions",
                          "pageRanges",
                          e.target.value
                        )
                      }
                      size="sm"
                      placeholder="1-5, 8, 11-13"
                    />
                    <Text fontSize="xs" color={mutedTextColor} mt={1}>
                      Example: 1-5, 8, 11-13
                    </Text>
                  </Field.Root>

                  <Field.Root mb={4}>
                    <Field.Label fontSize="sm">Scale</Field.Label>
                    <Input
                      type="number"
                      value={config.pdfOptions?.scale || 1}
                      onChange={(e) =>
                        handleConfigChange(
                          "pdfOptions",
                          "scale",
                          parseFloat(e.target.value)
                        )
                      }
                      size="sm"
                      step={0.1}
                      min={0.1}
                      max={2}
                    />
                    <Text fontSize="xs" color={mutedTextColor} mt={1}>
                      Values between 0.1 and 2
                    </Text>
                  </Field.Root>

                  <Field.Root mb={4} display="flex" alignItems="center">
                    <Field.Label
                      htmlFor="prefer-css-page-size"
                      mb="0"
                      fontSize="sm"
                    >
                      Prefer CSS Page Size
                    </Field.Label>
                    <Switch.Root
                      id="prefer-css-page-size"
                      checked={config.pdfOptions?.preferCSSPageSize}
                      onChange={() =>
                        handleConfigChange(
                          "pdfOptions",
                          "preferCSSPageSize",
                          !config.pdfOptions?.preferCSSPageSize
                        )
                      }
                      colorScheme="brand"
                    >
                      <Switch.HiddenInput />
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch.Root>
                  </Field.Root>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          </Accordion.Root>
        </Tabs.Content>
      </Tabs.Root>
    </VStack>
  );

  return (
    <DialogRoot size="full" open={open}>
      <DialogBackdrop
        bg={useColorModeValue("blackAlpha.600", "blackAlpha.800")}
        backdropFilter="blur(4px)"
      />
      <DialogPositioner>
        <DialogContent
          maxH="90vh"
          h="90vh"
          bg={cardBg}
          borderRadius="xl"
          overflow="hidden"
          shadow="2xl"
          border="1px solid"
          borderColor={borderColor}
        >
          <DialogHeader
            bg={whiteOrGray900}
            borderBottom="1px solid"
            borderColor={borderColor}
            px={6}
            py={4}
          >
            <DialogTitle fontWeight="bold" fontSize="xl" color={primaryColor}>
              <Flex align="center">
                <Icon as={LuCode} mr={2} />
                HTML to PDF Conversion
              </Flex>
            </DialogTitle>
            <DialogCloseTrigger asChild onClick={onClose}>
              <CloseButton size="sm" />
            </DialogCloseTrigger>
          </DialogHeader>

          <DialogBody p={0}>
            <Flex h="full" direction={{ base: "column", md: "row" }}>
              {/* Left side - Editor */}
              <Box
                w={{ base: "full", md: "50%" }}
                h="full"
                borderRight="1px solid"
                borderColor={borderColor}
                bg={codeBg}
                display="flex"
                flexDirection="column"
              >
                {/* Tabs */}
                <Flex p={4} gap={4} align="center" justify="space-between">
                  <HStack
                    bg={tabBg}
                    rounded="lg"
                    p="1"
                    gap={0}
                    overflow="hidden"
                  >
                    <Button
                      flex="1"
                      variant={activeTab === "editor" ? "solid" : "ghost"}
                      colorScheme={activeTab === "editor" ? "brand" : undefined}
                      py={2}
                      px={4}
                      borderRadius="md"
                      onClick={() => setActiveTab("editor")}
                      size="sm"
                      fontWeight="medium"
                    >
                      <Flex align="center" gap={2}>
                        <Icon as={LuCode} />
                        Editor
                      </Flex>
                    </Button>
                    <Button
                      flex="1"
                      variant={activeTab === "upload" ? "solid" : "ghost"}
                      colorScheme={activeTab === "upload" ? "brand" : undefined}
                      py={2}
                      px={4}
                      borderRadius="md"
                      onClick={() => setActiveTab("upload")}
                      size="sm"
                      fontWeight="medium"
                      position="relative"
                    >
                      <Flex align="center" gap={2}>
                        <Icon as={LuUpload} />
                        Upload
                      </Flex>
                      {fileUploaded && (
                        <Box
                          position="absolute"
                          top="-1px"
                          right="-1px"
                          bg="green.500"
                          borderRadius="full"
                          w="3"
                          h="3"
                        />
                      )}
                    </Button>
                    <Button
                      flex="1"
                      variant={activeTab === "config" ? "solid" : "ghost"}
                      colorScheme={activeTab === "config" ? "brand" : undefined}
                      py={2}
                      px={4}
                      borderRadius="md"
                      onClick={() => setActiveTab("config")}
                      size="sm"
                      fontWeight="medium"
                    >
                      <Flex align="center" gap={2}>
                        <Icon as={LuSettings} />
                        Options
                      </Flex>
                    </Button>
                  </HStack>

                  {activeTab === "editor" && (
                    <Select.Root
                      size="sm"
                      value={templateValue}
                      onValueChange={(e) => {
                        setTemplateValue(e.value);
                        setSelectedTemplate(e.value[0]);
                      }}
                      width="auto"
                      minWidth="150px"
                      collection={createListCollection({
                        items: templates.map((t) => ({
                          label: t.name,
                          value: t.id,
                        })),
                      })}
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder="Select template" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Select.Positioner>
                        <Select.Content>
                          {templates.map((template) => (
                            <Select.Item
                              item={{
                                label: template.name,
                                value: template.id,
                              }}
                              key={template.id}
                            >
                              {template.name}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                  )}
                </Flex>

                {/* Editor Content */}
                <Box flex="1" overflow="hidden" position="relative">
                  {activeTab === "editor" ? (
                    <Box h="100%">
                      <Editor
                        height="100%"
                        defaultLanguage="html"
                        defaultValue={htmlContent}
                        value={htmlContent}
                        onChange={handleEditorChange}
                        theme={whiteOrGray900 === "white" ? "light" : "vs-dark"}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          lineNumbers: "on",
                          formatOnType: true,
                          folding: true,
                          tabSize: 2,
                        }}
                      />
                    </Box>
                  ) : activeTab === "upload" ? (
                    <VStack
                      gap={4}
                      h="full"
                      justify="center"
                      align="center"
                      p={8}
                      bg={whiteOrGray900}
                    >
                      <Input
                        type="file"
                        accept=".html,.htm"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        display="none"
                      />

                      {fileUploaded ? (
                        <Box
                          p={6}
                          bg={green50OrGreen900}
                          borderRadius="md"
                          border="1px solid"
                          borderColor="green.200"
                          w="80%"
                          textAlign="center"
                        >
                          <Flex direction="column" align="center" gap={3}>
                            <Icon as={LuFile} boxSize={10} color="green.500" />
                            <Text fontWeight="medium">{uploadedFileName}</Text>
                            <Text fontSize="sm" color={mutedTextColor}>
                              File uploaded successfully
                            </Text>
                            <Button
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => {
                                setFileUploaded(false);
                                setUploadedFileName("");
                                setHtmlContent(
                                  getTemplateById(selectedTemplate || "invoice")
                                );
                              }}
                            >
                              Remove file
                            </Button>
                          </Flex>
                        </Box>
                      ) : (
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          size="lg"
                          h="140px"
                          w="80%"
                          variant="outline"
                          borderStyle="dashed"
                          borderWidth="2px"
                          borderColor={borderColor}
                          flexDirection="column"
                          gap={3}
                          bg={gray50OrGray900}
                          _hover={{
                            bg: gray100OrGray800,
                            borderColor: accentColor,
                          }}
                          transition="all 0.3s"
                        >
                          <Icon
                            as={LuUpload}
                            boxSize={10}
                            color={accentColor}
                            opacity={0.8}
                          />
                          <Text fontWeight="medium">
                            Click to upload HTML file
                          </Text>
                        </Button>
                      )}

                      <Text mt={2} fontSize="sm" color={mutedTextColor}>
                        Supported formats: .html, .htm
                      </Text>
                    </VStack>
                  ) : (
                    renderConfigOptions()
                  )}
                </Box>
              </Box>

              {/* Right side - PDF Preview */}
              <Box
                w={{ base: "full", md: "50%" }}
                h="full"
                bg={gray50OrGray900}
              >
                <Box h="full" display="flex" flexDirection="column">
                  <Flex
                    bg={subtleBg}
                    p={4}
                    borderBottom="1px solid"
                    borderColor={borderColor}
                    align="center"
                    justify="space-between"
                  >
                    <Flex align="center">
                      <Icon as={LuEye} mr={2} />
                      <Text fontWeight="medium">PDF Preview</Text>
                    </Flex>
                    {pdfUrl && (
                      <Button
                        colorScheme="brand"
                        variant="ghost"
                        size="sm"
                        onClick={handleDownload}
                      >
                        <Icon as={LuDownload} mr={2} />
                        Download
                      </Button>
                    )}
                  </Flex>

                  <Box flex="1" p={4} display="flex" flexDirection="column">
                    {pdfUrl ? (
                      <Box
                        flex="1"
                        border="1px solid"
                        borderColor={borderColor}
                        borderRadius="md"
                        overflow="hidden"
                        bg="white"
                        shadow="sm"
                      >
                        <iframe
                          src={pdfUrl}
                          width="100%"
                          height="100%"
                          style={{ border: "none" }}
                          title="PDF Preview"
                        />
                      </Box>
                    ) : (
                      <VStack justify="center" align="center" h="full" gap={4}>
                        <Text color={mutedTextColor}>
                          {isLoading
                            ? "Converting HTML to PDF..."
                            : "PDF preview will appear here"}
                        </Text>
                        {isLoading && (
                          <Box animation="spin 1s linear infinite">
                            <Icon
                              as={LuRefreshCw}
                              boxSize={10}
                              color={accentColor}
                            />
                          </Box>
                        )}
                      </VStack>
                    )}
                  </Box>
                </Box>
              </Box>
            </Flex>
          </DialogBody>

          <DialogFooter
            justifyContent="center"
            borderTop="1px solid"
            borderColor={borderColor}
            py={4}
            bg={subtleBg}
          >
            <Button
              colorScheme="brand"
              onClick={handleConvert}
              loading={isLoading}
              loadingText="Converting..."
              size="lg"
              px={8}
              shadow="md"
              _hover={{
                transform: "translateY(-2px)",
                shadow: "lg",
              }}
              transition="all 0.2s"
            >
              <Flex align="center" gap={2}>
                <Icon as={LuCode} />
                Convert to PDF
              </Flex>
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
}
