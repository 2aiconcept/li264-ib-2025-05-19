import { NavLink } from "react-router-dom";
import "./Sidebar.css";

type NavItem = {
  label: string;
  path: string;
};

interface SidebarProps {
  navlinks: NavItem[];
}
function Sidebar({ navlinks }: SidebarProps) {
  return (
    <div>
      <ul className="nav flex-column">
        {navlinks.map((link, index) => (
          <li
            className="nav-item"
            key={index}
          >
            <NavLink
              to={link.path}
              className="nav-link"
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Sidebar;
