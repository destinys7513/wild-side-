import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initDB } from "./lib/storage";

document.documentElement.classList.add("dark");

async function bootstrap() {
  try {
    await initDB();
  } catch {
  }
  createRoot(document.getElementById("root")!).render(<App />);
}

bootstrap();
