import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// Importer le CSS de Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
