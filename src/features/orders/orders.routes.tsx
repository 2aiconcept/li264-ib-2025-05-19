import { lazy, Suspense } from "react";
import ListOrders from "./views/ListOrders";

// Lazy loaded components
const AddOrder = lazy(() => import("./views/AddOrder"));
const EditOrder = lazy(() => import("./views/EditOrder"));

// export const preloadAddOrder = () => {
//   import("./views/Addorder");
// };
// export const preloadEditOrder = () => {
//   import("./views/Editorder");
// };

export const OrdersRoutes = {
  path: "orders",
  children: [
    {
      index: true,
      element: <ListOrders />,
    },
    {
      path: "add",
      element: (
        <Suspense fallback={<>Loading...</>}>
          <AddOrder />
        </Suspense>
      ),
    },
    {
      path: "edit/:id",
      element: (
        <Suspense fallback={<>Loading...</>}>
          <EditOrder />
        </Suspense>
      ),
    },
  ],
};
