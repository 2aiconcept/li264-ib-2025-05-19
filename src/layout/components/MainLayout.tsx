import { Outlet } from "react-router-dom";
// import Header from "./Header";
import "./MainLayout.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
// import Sidebar from "./Sidebar";
// import { useState } from "react";

function MainLayout() {
  // const user = {firstName: 'Christophe', lastName: 'Gueroult'}
  // const [user, setUser] = useState({
  //   firstName: "Chris",
  //   lastName: "Gueroult",
  // });

  // const changeUser = () => {
  //   setUser({ ...user, lastName: "Dupond" });
  // };

  // const links = [
  //   { path: "/orders", label: "orders" },
  //   { path: "/customers", label: "customers" },
  //   { path: "/products", label: "products" },
  // ];

  return (
    <div className="d-flex h-100">
      <div className="p-3 text-bg-dark">
        <div>
          {<Header />}
          <hr />
        </div>
        <hr />
        <div>
          {
            /* <Sidebar navlinks={links} /> */
            <Sidebar />
          }
        </div>
      </div>
      <div className="flex-grow-1 p-3">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
