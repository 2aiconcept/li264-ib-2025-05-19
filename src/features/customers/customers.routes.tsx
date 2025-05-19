import { lazy, Suspense } from "react";

// Lazy loaded components
const ListCustomers = lazy(() => import("./views/ListCustomers"));
const AddCustomer = lazy(() => import("./views/AddCustomer"));
const EditCustomer = lazy(() => import("./views/EditCustomer"));

export const preloadAddCustomer = () => {
  import("./views/AddCustomer");
};
export const preloadEditCustomer = () => {
  import("./views/EditCustomer");
};

export const CustomerRoutes = {
  path: "customers",
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<></>}>
          <ListCustomers />
        </Suspense>
      ),
    },
    {
      path: "add",
      element: (
        <Suspense fallback={<></>}>
          <AddCustomer />
        </Suspense>
      ),
    },
    {
      path: "edit/:id",
      element: (
        <Suspense fallback={<></>}>
          <EditCustomer />
        </Suspense>
      ),
    },
  ],
};
