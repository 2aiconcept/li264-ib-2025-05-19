import { createRoot } from "react-dom/client";
import "./index.css";
// Importer le CSS de Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes";
import { Provider } from "react-redux";
import store from "../store/index";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
