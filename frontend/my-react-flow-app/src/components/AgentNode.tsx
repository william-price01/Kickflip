import React, { useCallback, useState, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { processWithGriptape } from "../store/api";

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

  useEffect(() => {
    console.log(`AgentNode ${id} received new input:`, data.input);
    console.log(`AgentNode ${id} received new ruleset:`, data.ruleset);
  }, [id, data.input, data.ruleset]);

  const handleProcess = useCallback(async () => {
    if (prompt) {
      console.log(`AgentNode ${id} starting to process prompt:`, prompt);
      setIsProcessing(true);
      try {
        const result = await processWithGriptape({
          task_type: "prompt",
          input: prompt,
          ruleset: data.ruleset,
        });
        console.log(`AgentNode ${id} received processed result:`, result);
        if (data.onSubmit) {
          console.log(
            `AgentNode ${id} calling onSubmit with result:`,
            result.result,
          );
          data.onSubmit(id, result.result);
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
  }, [prompt, data, id]);

  return (
    <Box
      sx={{
        background: "white",
        padding: 2,
        borderRadius: 1,
        border: "1px solid #ddd",
        width: 250,
      }}
    >
      <Handle type="target" position={Position.Top} id="ruleset" />
      <Typography variant="h6">Agent Node</Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Enter prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        margin="normal"
      />
      <Typography variant="body2">
        Ruleset: {data.ruleset || "No ruleset provided"}
      </Typography>
      <Button
        onClick={handleProcess}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        disabled={isProcessing || !prompt}
      >
        {isProcessing ? <CircularProgress size={24} /> : "Process"}
      </Button>
      <Handle type="source" position={Position.Bottom} id="output" />
    </Box>
  );
};

export default AgentNode;
