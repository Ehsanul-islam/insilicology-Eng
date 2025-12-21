import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Import seed utility (available as window.seedDemoCourse in dev)
import "./utils/seedDemoCourse";

createRoot(document.getElementById("root")!).render(<App />);
