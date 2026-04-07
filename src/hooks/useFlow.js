import { useCallback, useState } from "react";
import { addEdge, useEdgesState, useNodesState } from "reactflow";
import { initialEdges, initialNodes } from "../data/initialFlow.js";
import {
  downloadFile,
  generateId,
  NODE_TYPE_META,
  parseFlow,
  serializeFlow,
} from "../utils/helpers.js";

/**
 * Central state and logic for the flow builder.
 * Encapsulates all node/edge mutations so components stay thin.
 */
export function useFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [toast, setToast] = useState(null);

  //  Toast helper
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 2800);
  }, []);

  //  Edge connect
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) =>
        addEdge({ ...params, id: generateId("edge"), animated: false }, eds),
      );
    },
    [setEdges],
  );

  //  Add node from palette drop
  const addNode = useCallback(
    (type, position) => {
      const meta = NODE_TYPE_META[type];
      const newNode = {
        id: generateId(type),
        type,
        position,
        data: {
          label: meta?.label ?? type,
          text: meta?.defaultText ?? "",
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes],
  );

  //  Update node text
  const updateNodeText = useCallback(
    (nodeId, text) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, text } } : n,
        ),
      );
    },
    [setNodes],
  );

  //  Delete node + its edges
  const deleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId),
      );
    },
    [setNodes, setEdges],
  );

  //  Delete edge
  const deleteEdge = useCallback(
    (edgeId) => {
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    },
    [setEdges],
  );

  //  Save flow as JSON download
  const saveFlow = useCallback(() => {
    const json = serializeFlow(nodes, edges);
    downloadFile(json, "flow.json");
    showToast("Flow saved as flow.json");
  }, [nodes, edges, showToast]);

  //  Load flow from JSON file
  const loadFlow = useCallback(
    (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const { nodes: n, edges: ed, error } = parseFlow(e.target.result);
        if (error) {
          showToast(`Load failed: ${error}`, "error");
          return;
        }
        setNodes(n);
        setEdges(ed);
        showToast("Flow loaded successfully");
      };
      reader.readAsText(file);
    },
    [setNodes, setEdges, showToast],
  );

  //  Clear canvas
  const clearFlow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    showToast("Canvas cleared");
  }, [setNodes, setEdges, showToast]);

  //  Reset to initial
  const resetFlow = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    showToast("Flow reset to default");
  }, [setNodes, setEdges, showToast]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNodeText,
    deleteNode,
    deleteEdge,
    saveFlow,
    loadFlow,
    clearFlow,
    resetFlow,
    toast,
  };
}
