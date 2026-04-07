import { useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  ConditionNode,
  EndNode,
  InputNode,
  MessageNode,
  StartNode,
} from "./NodeComponent.jsx";

const nodeTypes = {
  startNode: StartNode,
  messageNode: MessageNode,
  inputNode: InputNode,
  conditionNode: ConditionNode,
  endNode: EndNode,
};

const minimapNodeColor = (node) => {
  const colors = {
    startNode: "#2dd4a0",
    messageNode: "#4f8ef7",
    inputNode: "#4fc87a",
    conditionNode: "#a855f7",
    endNode: "#f75a5a",
  };
  return colors[node.type] ?? "#555";
};

export default function FlowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  addNode,
}) {
  const reactFlowWrapper = useRef(null);
  const [rfInstance, setRfInstance] = [null, () => {}];

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("application/reactflow-type");
      if (!type) return;

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds) return;

      // We need to convert screen coords to flow coords.
      // ReactFlow stores viewport in the DOM via transform
      const flowEl = reactFlowWrapper.current?.querySelector(
        ".react-flow__viewport",
      );
      let scale = 1,
        tx = 0,
        ty = 0;
      if (flowEl) {
        const style = window.getComputedStyle(flowEl);
        const matrix = new DOMMatrix(style.transform);
        scale = matrix.a;
        tx = matrix.e;
        ty = matrix.f;
      }

      const position = {
        x: (e.clientX - bounds.left - tx) / scale - 100,
        y: (e.clientY - bounds.top - ty) / scale - 40,
      };

      addNode(type, position);
    },
    [addNode],
  );

  const hasNodes = nodes.length > 0;

  return (
    <div className="canvas-wrapper" ref={reactFlowWrapper}>
      {!hasNodes && (
        <div className="canvas-empty-hint">
          <h3>Your canvas is empty</h3>
          <p>Drag a node from the sidebar to get started</p>
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        deleteKeyCode="Delete"
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls />
        <MiniMap
          nodeColor={minimapNodeColor}
          maskColor="rgba(13,13,15,0.7)"
          style={{ bottom: 16, right: 16 }}
        />
      </ReactFlow>
    </div>
  );
}
