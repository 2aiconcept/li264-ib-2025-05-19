import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "./layout/components/MainLayout";
import PageNotFound from "./features/404/views/PageNotFound";
import { OrdersRoutes } from "./features/orders/orders.routes";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        element: (
          <Navigate
            to="/orders"
            replace
          />
        ),
      },

      OrdersRoutes,
      //   CustomerRoutes,
      //   ProductsRoutes,
      {
        path: "*",
        Component: PageNotFound,
      },
    ],
  },
]);
