export const initialNodes = [
  {
    id: "start-1",
    type: "startNode",
    position: { x: 80, y: 200 },
    data: { label: "Start", text: "Flow begins here" },
  },
  {
    id: "message-1",
    type: "messageNode",
    position: { x: 340, y: 120 },
    data: {
      label: "Message",
      text: "Hello! Welcome to our support bot. How can I help you today?",
    },
  },
  {
    id: "input-1",
    type: "inputNode",
    position: { x: 340, y: 310 },
    data: {
      label: "Input",
      text: "Please type your question or concern below.",
    },
  },
  {
    id: "message-2",
    type: "messageNode",
    position: { x: 620, y: 200 },
    data: {
      label: "Message",
      text: "Thanks for reaching out! Let me look into that for you.",
    },
  },
  {
    id: "end-1",
    type: "endNode",
    position: { x: 900, y: 200 },
    data: {
      label: "End",
      text: "Thank you for chatting with us. Have a great day! 👋",
    },
  },
];

export const initialEdges = [
  {
    id: "e-start-msg",
    source: "start-1",
    target: "message-1",
    animated: false,
  },
  {
    id: "e-msg-input",
    source: "message-1",
    target: "input-1",
    animated: false,
  },
  {
    id: "e-input-msg2",
    source: "input-1",
    target: "message-2",
    animated: false,
  },
  {
    id: "e-msg2-end",
    source: "message-2",
    target: "end-1",
    animated: false,
  },
];
