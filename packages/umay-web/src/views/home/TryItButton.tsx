import { useState } from "react";
import { Button, Icon } from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu";
import ConversionDialog from "./ConversionDialog";

interface TryItButtonProps {
  variant?: "solid" | "outline";
  size?: "sm" | "md" | "lg";
  colorScheme?: string;
}

export default function TryItButton({
  variant = "solid",
  size = "md",
  colorScheme = "brand",
}: TryItButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        colorScheme={colorScheme}
        onClick={handleOpenDialog}
        rounded="full"
      >
        Try it now
        <Icon as={LuExternalLink} ml={2} />
      </Button>

      {isDialogOpen && (
        <ConversionDialog open={isDialogOpen} onClose={handleCloseDialog} />
      )}
    </>
  );
}
