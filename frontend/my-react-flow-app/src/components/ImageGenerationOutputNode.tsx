import React, { useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Snackbar,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";

interface ImageGenerationOutputNodeProps {
  data: {
    image_data: string;
    media_type: string;
    prompt: string;
  };
}

const ImageGenerationOutputNode: React.FC<ImageGenerationOutputNodeProps> = ({
  data,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const imageUrl = `data:${data.input.media_type};base64,${data.input.image_data}`;
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(data.prompt);
    setSnackbarOpen(true);
  };

  const handleDownloadImage = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "generated-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <Card sx={{ width: 300, maxWidth: "100%" }}>
      <Handle type="target" position={Position.Left} />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Generated Image
        </Typography>
        <Box sx={{ width: "100%", height: 200, overflow: "hidden", mb: 2 }}>
          <img
            src={imageUrl}
            alt="Generated"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Prompt: {data.input.prompt ?? "No prompt provided"}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyPrompt}
            variant="outlined"
            size="small"
          >
            Copy Prompt
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            onClick={handleDownloadImage}
            variant="outlined"
            size="small"
          >
            Download
          </Button>
        </Box>
      </CardContent>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message="Prompt copied to clipboard"
        autoHideDuration={2000}
      />
    </Card>
  );
};

export default ImageGenerationOutputNode;
