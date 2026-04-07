import { useCallback, useEffect, useRef, useState } from "react";
import { buildAdjacency } from "../utils/helpers.js";

//  Icons

const IconBot = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <line x1="12" y1="3" x2="12" y2="7" />
    <circle cx="9" cy="16" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="16" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const IconUser = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconSend = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
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

const IconRefresh = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-3.12" />
  </svg>
);

//  Node type badge colors
const NODE_BADGE = {
  startNode: {
    bg: "var(--accent-teal-dim)",
    color: "var(--accent-teal)",
    label: "start",
  },
  messageNode: {
    bg: "var(--accent-blue-dim)",
    color: "var(--accent-blue)",
    label: "message",
  },
  inputNode: {
    bg: "var(--accent-green-dim)",
    color: "var(--accent-green)",
    label: "input",
  },
  conditionNode: {
    bg: "var(--accent-purple-dim)",
    color: "var(--accent-purple)",
    label: "condition",
  },
  endNode: {
    bg: "var(--accent-red-dim)",
    color: "var(--accent-red)",
    label: "end",
  },
};

//  Typing indicator
function TypingIndicator() {
  return (
    <div className="chat-bubble-row">
      <div className="chat-mini-avatar bot-mini-avatar">
        <IconBot />
      </div>
      <div className="chat-bubble bot">
        <div className="typing-indicator">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

//  Main Component
export default function PreviewPanel({ nodes, edges, onClose }) {
  const [messages, setMessages] = useState([]);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [started, setStarted] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const adj = useRef({});
  const nodeMap = useRef({});

  useEffect(() => {
    adj.current = buildAdjacency(edges);
    nodeMap.current = Object.fromEntries(nodes.map((n) => [n.id, n]));
  }, [nodes, edges]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when waiting
  useEffect(() => {
    if (waitingForInput) inputRef.current?.focus();
  }, [waitingForInput]);

  // Start simulation
  const startSimulation = useCallback(() => {
    const startNode = nodes.find((n) => n.type === "startNode");
    if (!startNode) {
      setMessages([
        {
          id: Date.now(),
          role: "system",
          text: "No Start node found. Add a Start node to begin.",
        },
      ]);
      setIsEnded(true);
      setStarted(true);
      return;
    }
    setMessages([]);
    setWaitingForInput(false);
    setIsEnded(false);
    setCurrentNodeId(startNode.id);
    setStarted(true);
  }, [nodes]);

  // Process current node
  const processNode = useCallback((nodeId) => {
    const node = nodeMap.current[nodeId];
    if (!node) {
      setIsEnded(true);
      return;
    }

    const badge = NODE_BADGE[node.type];

    const simulateTyping = (text, then) => {
      setIsTyping(true);
      setTimeout(
        () => {
          setIsTyping(false);
          setMessages((m) => [
            ...m,
            { id: Date.now(), role: "bot", text, nodeType: node.type, badge },
          ]);
          then?.();
        },
        600 + Math.min(text.length * 8, 800),
      );
    };

    if (node.type === "startNode") {
      // Silently advance to next
      const next = (adj.current[nodeId] ?? [])[0];
      if (next) setTimeout(() => processNode(next), 200);
      else {
        setIsEnded(true);
      }
    } else if (node.type === "messageNode") {
      simulateTyping(node.data.text || "(empty message)", () => {
        const next = (adj.current[nodeId] ?? [])[0];
        if (next) {
          setCurrentNodeId(next);
          setTimeout(() => processNode(next), 300);
        } else {
          setIsEnded(true);
        }
      });
    } else if (node.type === "inputNode") {
      simulateTyping(node.data.text || "Please provide a response:", () => {
        setCurrentNodeId(nodeId);
        setWaitingForInput(true);
      });
    } else if (node.type === "conditionNode") {
      simulateTyping(`[Condition] ${node.data.text || "Evaluating..."}`, () => {
        // Auto-take "yes" branch for simulation
        const children = adj.current[nodeId] ?? [];
        const next = children[0];
        if (next) {
          setMessages((m) => [
            ...m,
            {
              id: Date.now(),
              role: "system",
              text: "Taking the first available branch...",
            },
          ]);
          setTimeout(() => {
            setCurrentNodeId(next);
            processNode(next);
          }, 400);
        } else {
          setIsEnded(true);
        }
      });
    } else if (node.type === "endNode") {
      simulateTyping(node.data.text || "Goodbye!", () => {
        setIsEnded(true);
        setWaitingForInput(false);
      });
    }
  }, []);

  // Trigger processNode when currentNodeId changes and simulation has started
  useEffect(() => {
    if (!started || !currentNodeId) return;
    if (waitingForInput) return;
    // processNode is called imperatively, not via effect for main path
  }, [started, currentNodeId, waitingForInput]);

  // Kick off on mount
  useEffect(() => {
    startSimulation();
  }, []); // eslint-disable-line

  // After startSimulation sets started + currentNodeId, process the start node
  useEffect(() => {
    if (started && currentNodeId && !waitingForInput && !isEnded) {
      const node = nodeMap.current[currentNodeId];
      if (node?.type === "startNode") processNode(currentNodeId);
    }
  }, [started]); // eslint-disable-line

  const handleSendInput = useCallback(() => {
    if (!inputValue.trim() || !waitingForInput) return;
    const text = inputValue.trim();
    setInputValue("");
    setWaitingForInput(false);

    setMessages((m) => [...m, { id: Date.now(), role: "user", text }]);

    // Advance to next node after input
    const next = (adj.current[currentNodeId] ?? [])[0];
    if (next) {
      setTimeout(() => {
        setCurrentNodeId(next);
        processNode(next);
      }, 400);
    } else {
      setIsEnded(true);
    }
  }, [inputValue, waitingForInput, currentNodeId, processNode]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendInput();
    }
  };

  const currentNode = currentNodeId ? nodeMap.current[currentNodeId] : null;
  const currentBadge = currentNode ? NODE_BADGE[currentNode.type] : null;

  return (
    <div
      className="preview-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="preview-panel">
        {/* Header */}
        <div className="preview-header">
          <div className="preview-header-left">
            <div className="preview-bot-avatar">
              <IconBot />
            </div>
            <div>
              <div className="preview-bot-name">FlowCraft Bot</div>
              <div className="preview-bot-status">
                {isEnded
                  ? "Conversation ended"
                  : waitingForInput
                    ? "Waiting for input"
                    : "Active"}
              </div>
            </div>
          </div>
          <button className="preview-close" onClick={onClose}>
            <IconX />
          </button>
        </div>

        {/* Current node indicator */}
        {currentNode && (
          <div className="preview-node-info">
            Current node:&nbsp;
            <span
              className="preview-node-badge"
              style={{
                background: currentBadge?.bg,
                color: currentBadge?.color,
              }}
            >
              {currentBadge?.label}
            </span>
            <span style={{ marginLeft: 4, color: "var(--text-muted)" }}>
              {currentNode.id}
            </span>
          </div>
        )}

        {/* Messages */}
        <div className="preview-messages">
          {messages.map((msg) => {
            if (msg.role === "system") {
              return (
                <div key={msg.id} className="chat-bubble-row">
                  <div className="chat-bubble system">{msg.text}</div>
                </div>
              );
            }
            if (msg.role === "bot") {
              return (
                <div key={msg.id} className="chat-bubble-row">
                  <div className="chat-mini-avatar bot-mini-avatar">
                    <IconBot />
                  </div>
                  <div className="chat-bubble bot">{msg.text}</div>
                </div>
              );
            }
            return (
              <div key={msg.id} className="chat-bubble-row user">
                <div className="chat-mini-avatar user-mini-avatar">
                  <IconUser />
                </div>
                <div className="chat-bubble user">{msg.text}</div>
              </div>
            );
          })}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        <div className="preview-footer">
          {isEnded ? (
            <button className="preview-restart-btn" onClick={startSimulation}>
              <IconRefresh /> Restart conversation
            </button>
          ) : (
            <div className="preview-input-row">
              <input
                ref={inputRef}
                className="preview-input"
                placeholder={
                  waitingForInput
                    ? "Type your response..."
                    : "Waiting for bot..."
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!waitingForInput || isTyping}
              />
              <button
                className="preview-send-btn"
                onClick={handleSendInput}
                disabled={!waitingForInput || !inputValue.trim() || isTyping}
              >
                <IconSend />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
