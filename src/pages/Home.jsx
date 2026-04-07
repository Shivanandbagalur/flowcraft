import { useCallback, useState } from "react";
import { ReactFlowProvider } from "reactflow";

import FlowCanvas from "../components/FlowCanvas.jsx";
import Header from "../components/Header.jsx";
import PreviewPanel from "../components/PreviewPanel.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Toast from "../components/Toast.jsx";
import { FlowContext } from "../context/FlowContext.jsx";
import { useFlow } from "../hooks/useFlow.js";

export default function Home() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNodeText,
    deleteNode,
    saveFlow,
    loadFlow,
    resetFlow,
    clearFlow,
    toast,
  } = useFlow();

  const [showPreview, setShowPreview] = useState(false);
  const [mode, setMode] = useState("build");

  const handlePreview = useCallback(() => setShowPreview(true), []);
  const handleClosePreview = useCallback(() => {
    setShowPreview(false);
    setMode("build");
  }, []);
  const handleModeChange = useCallback((m) => setMode(m), []);

  return (
    <FlowContext.Provider value={{ updateNodeText, deleteNode }}>
      <div className="app-shell">
        <Header
          onPreview={handlePreview}
          onSave={saveFlow}
          onLoad={loadFlow}
          onReset={resetFlow}
          onClear={clearFlow}
          mode={mode}
          onModeChange={handleModeChange}
        />
        <div className="app-body">
          <Sidebar nodes={nodes} edges={edges} />
          <ReactFlowProvider>
            <FlowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              addNode={addNode}
            />
          </ReactFlowProvider>
        </div>
      </div>

      {showPreview && (
        <PreviewPanel
          nodes={nodes}
          edges={edges}
          onClose={handleClosePreview}
        />
      )}

      <Toast toast={toast} />
    </FlowContext.Provider>
  );
}
