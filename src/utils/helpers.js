export function generateId(prefix = "node") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export const NODE_TYPE_META = {
  startNode: {
    label: "Start",
    colorVar: "--accent-teal",
    defaultText: "Flow begins here",
    canDelete: false,
  },
  messageNode: {
    label: "Message",
    colorVar: "--accent-blue",
    defaultText: "Enter your message...",
    canDelete: true,
  },
  inputNode: {
    label: "User Input",
    colorVar: "--accent-green",
    defaultText: "What do you want to ask the user?",
    canDelete: true,
  },
  conditionNode: {
    label: "Condition",
    colorVar: "--accent-purple",
    defaultText: "Describe the condition...",
    canDelete: true,
  },
  endNode: {
    label: "End",
    colorVar: "--accent-red",
    defaultText: "Conversation ends here.",
    canDelete: true,
  },
};

export function serializeFlow(nodes, edges) {
  return JSON.stringify({ nodes, edges }, null, 2);
}

export function parseFlow(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
      throw new Error("Invalid flow format");
    }
    return { nodes: data.nodes, edges: data.edges, error: null };
  } catch (err) {
    return { nodes: null, edges: null, error: err.message };
  }
}

export function downloadFile(content, filename, mimeType = "application/json") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function getFlowOrder(nodes, edges) {
  const adj = {};
  for (const n of nodes) adj[n.id] = [];
  for (const e of edges) {
    if (adj[e.source]) adj[e.source].push(e.target);
  }

  const startNode = nodes.find((n) => n.type === "startNode");
  if (!startNode) return [];

  const order = [];
  const visited = new Set();
  const queue = [startNode.id];

  while (queue.length > 0) {
    const id = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    order.push(id);
    const children = adj[id] || [];
    queue.push(...children);
  }

  return order;
}

export function buildAdjacency(edges) {
  const adj = {};
  for (const e of edges) {
    if (!adj[e.source]) adj[e.source] = [];
    adj[e.source].push(e.target);
  }
  return adj;
}
