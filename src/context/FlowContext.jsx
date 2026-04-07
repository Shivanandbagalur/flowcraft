import { createContext } from "react";

export const FlowContext = createContext({
  updateNodeText: () => {},
  deleteNode: () => {},
});
