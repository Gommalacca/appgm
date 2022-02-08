import React from "react";
import { useIntl } from "react-intl";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import { BsArchive } from "react-icons/bs";
import { FaTachometerAlt } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import {
  AiOutlineProject,
  AiOutlineSchedule,
  AiOutlineUser,
} from "react-icons/ai";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "redux/ducks/auth";
import { useHistory } from "react-router";
import reactLogo from "../assets/logo-gm.png";

const Aside = ({ toggled, handleToggleSidebar }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const history = useHistory();
  const deleteJWT = () => {
    history.go(0);
    dispatch(logoutUser());
  };
  return (
    <ProSidebar
      image=""
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
      className="uppercase"
    >
      <SidebarHeader>
        <div
          style={{
            padding: "24px",
            textTransform: "uppercase",
            fontWeight: "bold",
            fontSize: 10,
            letterSpacing: "1px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img width={80} src={reactLogo} alt="react logo" />
          </div>
          <br />
          {localStorage.getItem("companyName")}
          <br />
          <span style={{ fontSize: "12px" }}>
            {intl.formatMessage({ id: "sidebarWelcome" })} [
            {localStorage.getItem("firstname")}]{" "}
            <span style={{ fontSize: "8px" }}>
              TAG: {localStorage.getItem("userTag")}{" "}
            </span>
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="circle">
          <MenuItem
            className="sidebar-menu-title"
            style={{ fontSize: "14px", fontWeight: "bold" }}
            icon={<FaTachometerAlt />}
          >
            {intl.formatMessage({ id: "dashboard" })}
            <Link to="/"></Link>
          </MenuItem>
          {localStorage.getItem("owner") === "true" ? (
            <SubMenu
              className="sidebar-menu-title"
              style={{ fontSize: "14px", fontWeight: "bold" }}
              title={intl.formatMessage({ id: "projects" })}
              icon={<AiOutlineProject />}
            >
              <MenuItem
                style={{ fontSize: "12px" }}
                className="sidebar-menu-subtitle"
              >
                {intl.formatMessage({ id: "createproject" })}
                <Link to="/newProject"></Link>
              </MenuItem>
              <MenuItem
                style={{ fontSize: "12px" }}
                className="sidebar-menu-subtitle"
              >
                {intl.formatMessage({ id: "seeallprojects" })}{" "}
                <Link to="/allProjects"></Link>
              </MenuItem>
            </SubMenu>
          ) : (
            <MenuItem
              style={{ fontSize: "14px", fontWeight: "bold" }}
              className="sidebar-menu-title"
              icon={<FaTachometerAlt />}
            >
              {intl.formatMessage({ id: "seeallprojects" })}{" "}
              <Link to="/allProjects"></Link>
            </MenuItem>
          )}
          {(localStorage.getItem("owner") === "true" ||
            localStorage.getItem("moderator") === "true") && (
            <SubMenu
              title={intl.formatMessage({ id: "employees" })}
              icon={<AiOutlineUser />}
              className="sidebar-menu-title"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              <MenuItem
                className="sidebar-menu-subtitle"
                style={{ fontSize: "12px" }}
              >
                {intl.formatMessage({ id: "createEmployee" })}
                <Link to="/newEmployee"></Link>
              </MenuItem>
              <MenuItem
                className="sidebar-menu-subtitle"
                style={{ fontSize: "12px" }}
              >
                {intl.formatMessage({ id: "seeAllEmployees" })}
                <Link to="/allEmployees"></Link>
              </MenuItem>
            </SubMenu>
          )}
          <SubMenu
            title={intl.formatMessage({ id: "reports" })}
            icon={<AiOutlineSchedule />}
            className="sidebar-menu-title"
            style={{ fontSize: "14px", fontWeight: "bold" }}
          >
            <MenuItem
              className="sidebar-menu-subtitle"
              style={{ fontSize: "12px" }}
            >
              {intl.formatMessage({ id: "monthly" })}
              <Link to="/monthlyReports"></Link>
            </MenuItem>
            <MenuItem
              className="sidebar-menu-subtitle"
              style={{ fontSize: "12px" }}
            >
              {intl.formatMessage({ id: "daily" })}
              <Link to="/dailyReports"></Link>
            </MenuItem>
          </SubMenu>
        </Menu>
        <Menu iconShape="circle">
          <MenuItem
            className="sidebar-menu-title"
            style={{ fontSize: "14px", fontWeight: "bold" }}
            icon={<BsArchive />}
          >
            {intl.formatMessage({ id: "archive" })}
            <Link to="/archive"></Link>
          </MenuItem>
        </Menu>
      </SidebarContent>

      <SidebarFooter style={{ textAlign: "center" }}>
        <Menu>
          <MenuItem
            className="sidebar-menu-title"
            style={{ fontSize: "14px", fontWeight: "bold" }}
            onClick={deleteJWT}
            icon={<FiLogOut />}
          >
            {intl.formatMessage({ id: "logout" })}
          </MenuItem>
        </Menu>
      </SidebarFooter>
    </ProSidebar>
  );
};

Aside.propTypes = {
  toggled: PropTypes.bool,
  handleToggleSidebar: PropTypes.func,
};

export default Aside;
