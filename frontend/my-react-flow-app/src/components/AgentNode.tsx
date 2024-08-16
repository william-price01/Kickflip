import React, { useCallback, useState, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Card,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { API } from "../store/api";

interface AgentNodeData {
  input?: string;
  ruleset?: string;
  onSubmit?: (id: string, value: string) => void;
}

interface AgentNodeProps {
  data: AgentNodeData;
  id: string;
}

const AgentNode: React.FC<AgentNodeProps> = ({ data, id }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [apiType, setApiType] = useState<"process" | "generateImage">(
    "process",
  );

  useEffect(() => {
    console.log(`AgentNode ${id} received new input:`, data.input);
    console.log(`AgentNode ${id} received new ruleset:`, data.ruleset);
  }, [id, data.input, data.ruleset]);

  const handleProcess = useCallback(async () => {
    if (prompt) {
      console.log(`AgentNode ${id} starting to process prompt:`, prompt);
      setIsProcessing(true);
      try {
        let result;
        if (apiType === "process") {
          result = await API.process({
            task_type: "prompt",
            input: prompt,
            ruleset: data.ruleset,
          });
        } else {
          result = await API.generateImage({
            image_prompt: prompt,
            ruleset_input: data.ruleset || "",
          });
        }
        console.log(`AgentNode ${id} received processed result:`, result);
        if (data.onSubmit) {
          console.log(
            `AgentNode ${id} calling onSubmit with result:`,
            result.result || result,
          );
          data.onSubmit(id, result.result || result);
        } else {
          console.error(`AgentNode ${id}: onSubmit function is not defined`);
        }
      } catch (error) {
        console.error(`AgentNode ${id} error processing:`, error);
        if (data.onSubmit) {
          data.onSubmit(id, "Error processing input");
        }
      } finally {
        setIsProcessing(false);
        console.log(`AgentNode ${id} finished processing`);
      }
    } else {
      console.warn(
        `AgentNode ${id} attempted to process, but no prompt available`,
      );
    }
  }, [prompt, data, id, apiType]);

  const handleApiTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newApiType: "process" | "generateImage",
  ) => {
    if (newApiType !== null) {
      setApiType(newApiType);
    }
  };

  return (
    <Card
      sx={{
        background: "white",
        padding: 2,
        borderRadius: 1,
        border: "1px solid #ddd",
        width: 250,
      }}
    >
      <Handle type="target" position={Position.Left} id="ruleset" />
      <Typography variant="h6" gutterBottom>
        Agent Node
      </Typography>
      <ToggleButtonGroup
        value={apiType}
        exclusive
        onChange={handleApiTypeChange}
        aria-label="API Type"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
      >
        <ToggleButton value="process" aria-label="Process">
          Process
        </ToggleButton>
        <ToggleButton value="generateImage" aria-label="Generate Image">
          Generate Image
        </ToggleButton>
      </ToggleButtonGroup>
      <TextField
        fullWidth
        variant="outlined"
        label={apiType === "process" ? "Enter prompt" : "Enter image prompt"}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        margin="normal"
      />
      <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
        Ruleset: {data.ruleset || "No ruleset provided"}
      </Typography>
      <Button
        onClick={handleProcess}
        variant="contained"
        color="primary"
        fullWidth
        disabled={isProcessing || !prompt}
      >
        {isProcessing ? <CircularProgress size={24} /> : "Process"}
      </Button>
      <Handle type="source" position={Position.Right} id="output" />
    </Card>
  );
};

export default AgentNode;
