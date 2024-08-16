import React, { useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, Typography } from "@mui/material";

interface OutputNodeData {
  input?: string;
}

interface OutputNodeProps {
  data: OutputNodeData;
  id: string;
}

const OutputNode: React.FC<OutputNodeProps> = ({ data, id }) => {
  useEffect(() => {
    console.log(`OutputNode ${id} data updated:`, data);
  }, [data, id]);

  return (
    <Card sx={{ width: 250, maxWidth: "100%" }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Output Node
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {data.input || "Waiting for output..."}
        </Typography>
      </CardContent>
      <Handle type="target" position={Position.Left} />
    </Card>
  );
};

export default OutputNode;
