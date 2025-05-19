import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink
            to="/orders"
            className="nav-link"
          >
            Orders
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/customers"
            className="nav-link"
          >
            Customers
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/products"
            className="nav-link"
          >
            Products
          </NavLink>
        </li>
        <li className="nav-item">
          <a className="nav-link disabled">Disabled</a>
        </li>
      </ul>
    </div>
  );
}
export default Sidebar;
