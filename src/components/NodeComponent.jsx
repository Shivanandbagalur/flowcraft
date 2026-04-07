import { useCallback, useContext, useState } from "react";
import { Handle, Position } from "reactflow";
import { FlowContext } from "../context/FlowContext.jsx";

//  Icons

const IconPlay = () => (
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
);

const IconMessage = () => (
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
);

const IconInput = () => (
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
);

const IconCondition = () => (
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
);

const IconStop = () => (
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
);

const IconEdit = () => (
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
);

const IconTrash = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const IconCheck = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconX = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

//  Shared node shell

function NodeShell({
  id,
  typeClass,
  typeLabel,
  icon,
  children,
  canDelete = true,
  hasSource = true,
  hasTarget = true,
  extraHandles = null,
}) {
  const { updateNodeText, deleteNode } = useContext(FlowContext);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const handleEdit = useCallback((currentText) => {
    setDraft(currentText);
    setEditing(true);
  }, []);

  const handleSave = useCallback(() => {
    updateNodeText(id, draft);
    setEditing(false);
  }, [id, draft, updateNodeText]);

  const handleCancel = useCallback(() => setEditing(false), []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Escape") handleCancel();
    },
    [handleSave, handleCancel],
  );

  return (
    <div className={`flow-node ${typeClass}`}>
      {hasTarget && <Handle type="target" position={Position.Left} />}

      <div className="flow-node-header">
        <div className="flow-node-icon">{icon}</div>
        <span className="flow-node-type">{typeLabel}</span>
        <div className="flow-node-actions">
          {!editing && (
            <button
              className="node-action-btn"
              title="Edit"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(children?.props?.text ?? "");
              }}
            >
              <IconEdit />
            </button>
          )}
          {canDelete && !editing && (
            <button
              className="node-action-btn delete"
              title="Delete node"
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(id);
              }}
            >
              <IconTrash />
            </button>
          )}
        </div>
      </div>

      <div className="flow-node-body">
        {editing ? (
          <>
            <textarea
              className="node-text-editor"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              rows={3}
              placeholder="Enter text..."
            />
            <div className="node-edit-actions">
              <button className="node-edit-btn save" onClick={handleSave}>
                <IconCheck /> Save
              </button>
              <button className="node-edit-btn cancel" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </>
        ) : // Clone children, pass editing callbacks
        children ? (
          {
            ...children,
            props: {
              ...children.props,
              onEdit: () => handleEdit(children.props.text),
            },
          }
        ) : null}
      </div>

      {extraHandles}

      {hasSource && <Handle type="source" position={Position.Right} />}
    </div>
  );
}

//  Text display sub-component

function NodeText({ text, onEdit }) {
  if (!text)
    return (
      <span className="node-text-empty" onDoubleClick={onEdit}>
        Double-click to edit...
      </span>
    );
  return (
    <p className="node-text-display" onDoubleClick={onEdit}>
      {text}
    </p>
  );
}

//  Individual node types

export function StartNode({ id, data }) {
  return (
    <NodeShell
      id={id}
      typeClass="node-start"
      typeLabel="Start"
      icon={<IconPlay />}
      canDelete={false}
      hasTarget={false}
    >
      <NodeText text={data.text} />
    </NodeShell>
  );
}

export function MessageNode({ id, data }) {
  return (
    <NodeShell
      id={id}
      typeClass="node-message"
      typeLabel="Message"
      icon={<IconMessage />}
    >
      <NodeText text={data.text} />
    </NodeShell>
  );
}

export function InputNode({ id, data }) {
  return (
    <NodeShell
      id={id}
      typeClass="node-input"
      typeLabel="User Input"
      icon={<IconInput />}
    >
      <NodeText text={data.text} />
    </NodeShell>
  );
}

export function ConditionNode({ id, data }) {
  return (
    <NodeShell
      id={id}
      typeClass="node-condition"
      typeLabel="Condition"
      icon={<IconCondition />}
      hasSource={false}
      extraHandles={
        <>
          <div className="node-branch-labels">
            <span className="branch-label branch-yes">Yes</span>
            <span className="branch-label branch-no">No</span>
          </div>
          <Handle
            type="source"
            position={Position.Bottom}
            id="yes"
            style={{ left: "30%" }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="no"
            style={{ left: "70%" }}
          />
        </>
      }
    >
      <NodeText text={data.text} />
    </NodeShell>
  );
}

export function EndNode({ id, data }) {
  return (
    <NodeShell
      id={id}
      typeClass="node-end"
      typeLabel="End"
      icon={<IconStop />}
      hasSource={false}
    >
      <NodeText text={data.text} />
    </NodeShell>
  );
}
