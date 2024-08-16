import { Box, Button, MenuItem, Menu } from "@mui/material";
import React from "react";

export type NodeType =
  | "inputNode"
  | "agentNode"
  | "outputNode"
  | "ImageGenerationOutputNode";

export type NodeMenuProps = {
  addNode: (type: NodeType) => void;
};

export default function NodeMenu({ addNode }: NodeMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddNode = (type: NodeType) => {
    addNode(type);
    handleClose();
  };

  return (
    <Box>
      <Button
        onClick={handleClick}
        variant="contained"
        color="primary"
        aria-controls="simple-menu"
        aria-haspopup="true"
      >
        Add Node
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleAddNode("inputNode")}>
          Input Node
        </MenuItem>
        <MenuItem onClick={() => handleAddNode("agentNode")}>
          Agent Node
        </MenuItem>
        <MenuItem onClick={() => handleAddNode("outputNode")}>
          Output Node
        </MenuItem>
        <MenuItem onClick={() => handleAddNode("ImageGenerationOutputNode")}>
          Image Generation Output Node
        </MenuItem>
      </Menu>
    </Box>
  );
}
