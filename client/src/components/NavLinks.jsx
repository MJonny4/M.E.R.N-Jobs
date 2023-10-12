import { useDashboardContext } from "../pages/DashboardLayout";
import links from "../utils/links";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const NavLinks = ({ isBigSidebar }) => {
    const { toggleSidebar, user } = useDashboardContext();
    return (
        <div className="nav-links">
            {links.map((link) => {
                const { text, path, icon } = link;
                const { role } = user;

                if (path === "admin" && role !== "admin") return null;

                return (
                    <NavLink
                        to={path}
                        key={text}
                        className={"nav-link"}
                        onClick={isBigSidebar ? null : toggleSidebar}
                        end
                    >
                        <span className="icon">{icon}</span>
                        {text}
                    </NavLink>
                );
            })}
        </div>
    );
};

NavLinks.propTypes = {
    isBigSidebar: PropTypes.bool,
};

export default NavLinks;
