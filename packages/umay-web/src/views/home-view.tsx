import {
  Box,
  Button,
  Container,
  FileUpload,
  HStack,
  Icon,
  Text,
  VStack,
  Spinner,
  Link,
} from "@chakra-ui/react";
import {
  LuUpload,
  LuCode,
  LuDownload,
  LuGithub,
  LuPackage,
  LuTerminal,
  LuHeart,
} from "react-icons/lu";
import { ColorModeButton } from "../components/ui/color-mode";
import { useCallback, useState } from "react";
import { UmaySDK } from "umay-render";

const umay = new UmaySDK();

type FileWithStatus = {
  file: File;
  loading: boolean;
  pdfData: Uint8Array | null;
};

export default function HomeView() {
  const [files, setFiles] = useState<FileWithStatus[]>([]);

  const handleFileChange = useCallback(
    (fileData: { acceptedFiles: File[] }) => {
      const newFiles = fileData.acceptedFiles.map((file) => ({
        file,
        loading: false,
        pdfData: null,
      }));
      setFiles(newFiles);
    },
    []
  );

  const handleConvert = useCallback(
    async (index: number) => {
      if (files.length === 0 || !files[index]) return;

      setFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles[index] = { ...newFiles[index], loading: true };
        return newFiles;
      });

      try {
        const content = await files[index].file.text();
        console.log("Converting HTML to PDF...");
        const result = await umay.toPDF(content);
        console.log("Conversion result:", result);

        setFiles((prevFiles) => {
          const newFiles = [...prevFiles];
          newFiles[index] = {
            ...newFiles[index],
            loading: false,
            pdfData: result,
          };
          console.log("State updated with PDF data:", newFiles[index]);
          return newFiles;
        });
      } catch (error) {
        console.error("PDF conversion error:", error);

        setFiles((prevFiles) => {
          const newFiles = [...prevFiles];
          newFiles[index] = { ...newFiles[index], loading: false };
          return newFiles;
        });
      }
    },
    [files]
  );

  const handleDownload = useCallback(
    (index: number) => {
      const fileItem = files[index];
      if (!fileItem || !fileItem.pdfData) return;

      const blob = new Blob([fileItem.pdfData], { type: "application/pdf" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download =
        fileItem.file.name.replace(/\.[^/.]+$/, "") + ".pdf" || "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [files]
  );

  const handleDeleteFile = useCallback((file: File) => {
    setFiles((prevFiles) => prevFiles.filter((item) => item.file !== file));
  }, []);

  return (
    <Container
      css={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <HStack
        css={{
          w: "full",
          justifyContent: "space-between",
          height: "60px",
          borderBottom: "1px solid",
          borderColor: "gray.200",
        }}
      >
        <Text fontSize="xl" fontWeight="bold">
          Umay Render
        </Text>
        <ColorModeButton />
      </HStack>
      <VStack
        css={{
          marginTop: "60px",
          flex: "1",
        }}
      >
        <Text
          css={{
            fontSize: "25px",
            fontWeight: "bold",
          }}
        >
          Free HTML to PDF Converter
        </Text>
        <Text
          css={{
            color: "gray.500",
            fontSize: "18px",
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          Convert HTML to PDF with professional quality. Open-source, no usage
          limits, and completely free alternative to expensive conversion
          services.
        </Text>

        <FileUpload.Root
          maxW="xl"
          alignItems="stretch"
          maxFiles={10}
          maxFileSize={5 * 1024 * 1024}
          accept={["text/html"]}
          onFileChange={handleFileChange}
          css={{
            marginTop: "20px",
          }}
        >
          {!files.length && (
            <>
              <FileUpload.HiddenInput />
              <FileUpload.Dropzone
                css={{
                  cursor: "pointer",
                }}
              >
                <Icon size="md" color="fg.muted">
                  <LuUpload />
                </Icon>
                <FileUpload.DropzoneContent>
                  <Box>Drag and drop files here</Box>
                  <Box color="fg.muted">
                    <Text>HTML</Text>
                    <Text>up to 5MB</Text>
                  </Box>
                </FileUpload.DropzoneContent>
              </FileUpload.Dropzone>
            </>
          )}

          <FileUpload.ItemGroup>
            {files.map((fileItem, index) => (
              <FileUpload.Item
                key={fileItem.file.name + index}
                file={fileItem.file}
                css={{
                  justifyContent: "space-between",
                }}
              >
                <HStack>
                  <FileUpload.ItemPreview type="text/html">
                    <Icon size="md" color="fg.muted">
                      <LuCode />
                    </Icon>
                  </FileUpload.ItemPreview>
                  <FileUpload.ItemName />
                  <FileUpload.ItemSizeText />
                </HStack>

                <HStack
                  css={{
                    w: "auto",
                  }}
                >
                  {fileItem.loading ? (
                    <Spinner size="sm" />
                  ) : fileItem.pdfData ? (
                    <Button
                      size="sm"
                      variant="solid"
                      colorScheme="blue"
                      onClick={() => handleDownload(index)}
                    >
                      <HStack>
                        <Icon>
                          <LuDownload />
                        </Icon>
                        <Text>Download</Text>
                      </HStack>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleConvert(index)}
                    >
                      Convert
                    </Button>
                  )}

                  <Button
                    size="sm"
                    onClick={() => handleDeleteFile(fileItem.file)}
                    variant="ghost"
                  >
                    Remove
                  </Button>
                </HStack>
              </FileUpload.Item>
            ))}
          </FileUpload.ItemGroup>
        </FileUpload.Root>
      </VStack>

      <VStack>
        <HStack css={{ spaceX: "20px" }}>
          <Link
            href="https://github.com/tolgaand/umay-render"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HStack css={{ gap: "8px" }}>
              <Icon as={LuGithub} />
              <Text>GitHub</Text>
            </HStack>
          </Link>
          <Link
            href="https://www.npmjs.com/package/umay-render"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HStack css={{ gap: "8px" }}>
              <Icon as={LuPackage} />
              <Text>NPM</Text>
            </HStack>
          </Link>
          <Link
            href="https://github.com/tolgaand/umay-render/tree/main/packages/umay-cli"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HStack css={{ gap: "8px" }}>
              <Icon as={LuTerminal} />
              <Text>CLI</Text>
            </HStack>
          </Link>
        </HStack>

        <Box
          width="full"
          py={4}
          textAlign="center"
          borderTopWidth="1px"
          borderTopColor="gray.200"
        >
          <Text fontSize="sm">
            Made with <Icon as={LuHeart} /> using Umay Render SDK
          </Text>
          <Text fontSize="xs" mt={1}>
            Open Source under MIT License
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}
