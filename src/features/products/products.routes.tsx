import { lazy, Suspense } from "react";

// Lazy loaded components
const ListProducts = lazy(() => import("./views/ListProducts"));
const AddProduct = lazy(() => import("./views/AddProduct"));
const EditProduct = lazy(() => import("./views/EditProduct"));

export const preloadAddProduct = () => {
  import("./views/AddProduct");
};
export const preloadEditProduct = () => {
  import("./views/EditProduct");
};
export const ProductsRoutes = {
  path: "products",
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<></>}>
          <ListProducts />
        </Suspense>
      ),
    },
    {
      path: "add",
      element: (
        <Suspense fallback={<></>}>
          <AddProduct />
        </Suspense>
      ),
    },
    {
      path: "edit/:id",
      element: (
        <Suspense fallback={<></>}>
          <EditProduct />
        </Suspense>
      ),
    },
  ],
};
