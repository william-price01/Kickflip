import React, { useState, useCallback } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { TextField, Button, Box, Typography, Card } from "@mui/material";

interface InputNodeProps {
  id: string;
}

const InputNode: React.FC<InputNodeProps> = ({ id }) => {
  const [input, setInput] = useState("");
  const { getNode, setNodes, getEdges } = useReactFlow();

  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setInput(evt.target.value);
  }, []);

  const onSubmit = useCallback(() => {
    const edges = getEdges();
    const connectedEdge = edges.find((e) => e.source === id);
    if (connectedEdge) {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === connectedEdge.target) {
            return {
              ...node,
              data: { ...node.data, ruleset: input },
            };
          }
          return node;
        }),
      );
    }
    setInput(""); // Clear input after submission
  }, [id, input, getEdges, setNodes]);

  return (
    <Card
      sx={{
        background: "white",
        padding: 2,
        borderRadius: 1,
        border: "1px solid #ddd",
        width: 200,
      }}
    >
      <Typography variant="h6">Input Node</Typography>
      <TextField
        value={input}
        onChange={onChange}
        placeholder="Enter input"
        fullWidth
        margin="normal"
      />
      <Button onClick={onSubmit} variant="contained" color="primary">
        Submit
      </Button>
      <Handle type="source" position={Position.Bottom} id="a" />
    </Card>
  );
};

export default InputNode;
