import { useCallback } from "react";

const PALETTE = [
  {
    type: "startNode",
    name: "Start",
    desc: "Entry point of the flow",
    cls: "palette-start",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  {
    type: "messageNode",
    name: "Message",
    desc: "Send a message to user",
    cls: "palette-message",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    type: "inputNode",
    name: "User Input",
    desc: "Collect user response",
    cls: "palette-input",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    type: "conditionNode",
    name: "Condition",
    desc: "Branch based on logic",
    cls: "palette-condition",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    type: "endNode",
    name: "End",
    desc: "Terminate the conversation",
    cls: "palette-end",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <rect x="9" y="9" width="6" height="6" />
      </svg>
    ),
  },
];

export default function Sidebar({ nodes, edges, onDragStart }) {
  const handleDragStart = useCallback(
    (e, type) => {
      e.dataTransfer.setData("application/reactflow-type", type);
      e.dataTransfer.effectAllowed = "move";
      onDragStart?.(type);
    },
    [onDragStart],
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">Node Types</div>
        {PALETTE.map((item) => (
          <div
            key={item.type}
            className={`node-palette-item ${item.cls}`}
            draggable
            onDragStart={(e) => handleDragStart(e, item.type)}
            title={`Drag to add ${item.name} node`}
          >
            <div className="node-palette-icon">{item.icon}</div>
            <div className="node-palette-info">
              <div className="node-palette-name">{item.name}</div>
              <div className="node-palette-desc">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-section">
        <div className="sidebar-label">How to use</div>
        <div
          style={{
            fontSize: "11px",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            padding: "0 4px",
          }}
        >
          <p style={{ marginBottom: 6 }}>
            <strong style={{ color: "var(--text-secondary)" }}>Drag</strong>{" "}
            nodes onto the canvas
          </p>
          <p style={{ marginBottom: 6 }}>
            <strong style={{ color: "var(--text-secondary)" }}>Connect</strong>{" "}
            by dragging from a node's right handle to another's left
          </p>
          <p style={{ marginBottom: 6 }}>
            <strong style={{ color: "var(--text-secondary)" }}>
              Double-click
            </strong>{" "}
            node text to edit
          </p>
          <p>
            <strong style={{ color: "var(--text-secondary)" }}>Preview</strong>{" "}
            your bot flow anytime
          </p>
        </div>
      </div>

      <div className="sidebar-stats">
        <div className="sidebar-label">Flow Stats</div>
        <div className="stat-row">
          <span className="stat-label">Nodes</span>
          <span className="stat-value">{nodes.length}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Connections</span>
          <span className="stat-value">{edges.length}</span>
        </div>
      </div>
    </aside>
  );
}
