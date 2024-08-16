import { useCallback, useRef } from "react";
import {
  ReactFlow,
  addEdge,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  NodeTypes,
  OnConnect,
} from "@xyflow/react";
import NodeMenu from "../components/NodeMenu";
import InputNode from "../components/InputNode";
import AgentNode from "../components/AgentNode";
import OutputNode from "../components/OutputNode";
import "@xyflow/react/dist/style.css";
import { Grid } from "@mui/material";

const nodeTypes: NodeTypes = {
  inputNode: InputNode,
  agentNode: AgentNode,
  outputNode: OutputNode,
};

type NodeData = {
  input?: string;
  output?: string;
  onSubmit?: (id: string, value: string) => void;
};

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const edgesRef = useRef(edges);

  const onConnect: OnConnect = useCallback(
    (params) => {
      console.log("New connection created:", params);
      setEdges((eds) => {
        const newEdges = addEdge(params, eds);
        edgesRef.current = newEdges;
        return newEdges;
      });
    },
    [setEdges],
  );

  const updateNodeData = useCallback(
    (nodeId: string, newData: Partial<NodeData>) => {
      console.log(`Updating node ${nodeId} with data:`, newData);
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, ...newData } };
          }
          return node;
        }),
      );
    },
    [setNodes],
  );

  const handleNodeSubmit = useCallback(
    (sourceId: string, value: string) => {
      console.log(`Node ${sourceId} submitted value:`, value);
      const edge = edgesRef.current.find((e) => e.source === sourceId);
      if (edge) {
        console.log(
          `Passing data from node ${sourceId} to node ${edge.target}`,
        );
        updateNodeData(edge.target, { input: value });
      } else {
        console.error(`No edge found from node ${sourceId} to any target node`);
        console.log("Current edges:", edgesRef.current);
      }
    },
    [updateNodeData],
  );

  const addNode = useCallback(
    (type: "inputNode" | "agentNode" | "outputNode") => {
      const newNode: Node<NodeData> = {
        id: `${type}_${nodes.length + 1}`,
        type,
        position: { x: Math.random() * 500, y: Math.random() * 300 },
        data: {
          input: "",
          output: "",
          onSubmit: handleNodeSubmit,
        },
      };
      console.log(`Adding new node:`, newNode);
      setNodes((nds) => [...nds, newNode]);
    },
    [nodes, setNodes, handleNodeSubmit],
  );

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Grid container>
        <Grid item xs={12}>
          <NodeMenu addNode={addNode} />
        </Grid>
      </Grid>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={(changes) => {
          onEdgesChange(changes);
          setEdges((eds) => {
            edgesRef.current = eds;
            return eds;
          });
        }}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      ></ReactFlow>
    </div>
  );
}

export default Flow;
