# FlowCraft — Visual Chatbot Flow Builder

A node-based visual workflow engine for designing and simulating chatbot conversations.

FlowCraft enables users to build conversational logic using a drag-and-drop interface, eliminating the need for hardcoded chatbot logic. The system models conversations as a directed graph and executes them through dynamic traversal during preview.

---

## ⚙️ How It Works

FlowCraft represents chatbot conversations as a **directed graph**:

- **Nodes** → Represent conversational steps (message, input, condition)
- **Edges** → Define transitions between steps
- **Traversal Engine** → Executes nodes sequentially during preview

### Execution Flow:

1. Start from the **Start node**
2. Traverse connected nodes
3. Execute node-specific behavior:
   - Message → Display text
   - Input → Wait for user response
   - Condition → Choose next branch
4. Continue until **End node**

This approach separates UI design from execution logic, similar to real-world workflow engines.

---

## 🧠 Engineering Highlights

- Implemented a **graph-based execution engine** using adjacency relationships
- Designed a **modular component architecture** for scalability
- Built a **custom hook (`useFlow`)** to manage node/edge state cleanly
- Handled **dynamic traversal with user-driven state transitions**
- Optimized UI interactions for smooth drag-drop and real-time updates

## ✨ Features

### Flow Builder

- **Drag & Drop Canvas** — Drag node types from the sidebar onto the React Flow canvas
- **5 Node Types** — Start, Message, User Input, Condition, End — each visually distinct
- **Visual Connections** — Click and drag from any node handle to connect nodes
- **Delete Key Support** — Select a node or edge and press `Delete` to remove it

### Node Editing

- **Inline Editing** — Double-click any node text to edit it in place
- **Keyboard Shortcuts** — `Enter` to save, `Escape` to cancel
- **Per-node Delete** — Hover a node to reveal the delete button

### Preview / Simulation

- **Live Chatbot Preview** — Click "Run Preview" to simulate the conversation
- **Typing Indicators** — Realistic typing delay before bot messages appear
- **User Input Handling** — Input nodes pause the simulation and wait for user response
- **Condition Branches** — Auto-advances through the first available branch
- **Restart** — Restart the conversation at any time

### Save / Load

- **Export JSON** — Save your entire flow (nodes + edges) as `flow.json`
- **Import JSON** — Load a previously saved flow back onto the canvas
- **Reset** — Restore the built-in demo flow
- **Clear** — Empty the canvas to start fresh

### UI/UX

- Dark industrial aesthetic with color-coded node types
- MiniMap for navigating large flows
- Zoom controls and canvas panning
- Toast notifications for save/load feedback
- Stat panel showing node and edge counts

---

## 🛠 Tech Stack

| Layer            | Technology                              |
| ---------------- | --------------------------------------- |
| Framework        | React 18 + Vite                         |
| Flow Engine      | React Flow (reactflow)                  |
| State Management | Custom hook (`useFlow`) with useReducer |
| Styling          | Pure CSS with CSS custom properties     |
| ID generation    | `Math.random().toString(36)` (no deps)  |

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

### Build for production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
voiceflow-clone/
├── index.html
├── vite.config.js
├── package.json
├── README.md
└── src/
    ├── App.jsx                   # Root component
    ├── main.jsx                  # React DOM entry
    ├── components/
    │   ├── FlowCanvas.jsx        # React Flow wrapper + drop zone
    │   ├── NodeComponent.jsx     # All 5 node types + edit/delete
    │   ├── Sidebar.jsx           # Draggable node palette + stats
    │   ├── Header.jsx            # Toolbar with actions
    │   ├── PreviewPanel.jsx      # Chatbot simulation UI
    │   └── Toast.jsx             # Notification toasts
    ├── context/
    │   └── FlowContext.jsx       # Context for node mutations
    ├── hooks/
    │   └── useFlow.js            # All flow state + operations
    ├── pages/
    │   └── Home.jsx              # Main page layout
    ├── data/
    │   └── initialFlow.js        # Default demo flow
    ├── utils/
    │   └── helpers.js            # ID gen, serialization, traversal
    └── styles/
        └── main.css              # Full design system
```

---

## 🗺 Node Types

| Node           | Color  | Purpose                                |
| -------------- | ------ | -------------------------------------- |
| **Start**      | Teal   | Entry point — every flow must have one |
| **Message**    | Blue   | Bot sends a message to the user        |
| **User Input** | Green  | Pauses flow and collects user response |
| **Condition**  | Purple | Branch logic (yes/no paths)            |
| **End**        | Red    | Terminates the conversation            |

---

## 🔮 Future Improvements

- [ ] **Variables** — Store user inputs and reference them in later messages
- [ ] **Condition evaluation** — Actually evaluate conditions against stored variables
- [ ] **Multiple flows** — Tabbed flow management
- [ ] **Custom node types** — User-defined nodes via plugin system
- [ ] **Undo/Redo** — Full history stack
- [ ] **Cloud sync** — Save flows to a backend
- [ ] **Export to code** — Generate webhook-ready flow JSON or code
- [ ] **Analytics** — Track which paths users take in preview mode
- [ ] **Collaborative editing** — Real-time multi-user canvas with CRDTs
- [ ] **Node search** — Spotlight/command palette to find and focus nodes

---

## 📄 License

Built for educational/internship assignment purposes.
