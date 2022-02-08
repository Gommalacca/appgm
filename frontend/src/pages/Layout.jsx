import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch as Switcher, Route } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Aside from "../components/Aside";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { Container } from "react-bootstrap";
import Switch from "react-switch";
import { useSelector } from "react-redux";
import { PageTransition } from "@steveeeie/react-page-transition";
import PrivateRoute from "functions/middleware/PrivateRoute";

import Main from "./Main";
import AllProjects from "./projects/AllProjects";
import CreateProject from "./projects/CreateProject";
import LookUpProjects from "./projects/LookUpProjects";
import LookUpHours from "./hours/LookUpHours";
import NewEmployee from "./employees/NewEmployee";
import AllEmployees from "./employees/AllEmployees";
import LookUpEmployee from "./employees/LookUpEmployee";
import LookUpNotes from "./notes/LookUpNotes";
import DailyReports from "./reports/DailyReports";
import MonthlyReports from "./reports/MonthlyReports";
import Login from "./Login";
import Archive from "./archive/Archive";
import LookUpReport from "./reports/LookUpReport";

function Layout({ setLocale }) {
  const [toggled, setToggled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  var auth = useSelector((state) => state.Auth);
  var company = useSelector((state) => state.User);

  useEffect(() => {
    let token = localStorage.getItem("nicktoken");

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [auth, company]);

  const handleLanguageChange = (checked) => {
    setLocale(checked ? "en" : "it");
    setCollapsed(!collapsed);
  };
  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  const intl = useIntl();
  return (
    <div className={`app toggled`}>
      <div
        className="btn-toggle"
        style={{
          position: "absolute",
          width: "2em",
          height: "2em",
          left: "0.3em",
          top: "0.3em",

          zIndex: 100,
        }}
        onClick={() => handleToggleSidebar(true)}
      >
        <FaBars />
      </div>

      <div
        style={{
          position: "absolute",
          top: "0.3em",
          right: "0.3em",

          zIndex: 100,
        }}
        className="d-flex"
      >
        <span
          style={{
            fontWeight: "bold",
            marginRight: "0.3em",
            fontSize: "14px",
          }}
        >
          {intl.formatMessage({ id: "languageInUse" })}
        </span>
        <div>
          <Switch
            height={16}
            width={30}
            checkedIcon={false}
            uncheckedIcon={false}
            onChange={() => handleLanguageChange(!collapsed)}
            checked={collapsed}
            onColor="#bbbbbb"
            offColor="#bbbbbb"
          />
        </div>
      </div>
      <BrowserRouter>
        {isAuthenticated && (
          <Aside toggled={toggled} handleToggleSidebar={handleToggleSidebar} />
        )}
        <Container fluid>
          <Route
            render={({ location }) => {
              return (
                <PageTransition
                  preset="moveToLeftFromRight"
                  enterAnimation={""}
                  exitAnimation={""}
                  transitionKey={location.pathname}
                >
                  <Switcher location={location}>
                    <Route exact path="/login" component={() => <Login />} />
                    <PrivateRoute exact path="/" component={() => <Main />} />
                    <PrivateRoute
                      exact
                      path="/newProject"
                      component={() => <CreateProject />}
                    />
                    <PrivateRoute
                      exact
                      path="/allProjects"
                      component={() => <AllProjects />}
                    />
                    <PrivateRoute
                      exact
                      path="/newEmployee"
                      component={() => <NewEmployee />}
                    />
                    <PrivateRoute
                      exact
                      path="/allEmployees"
                      component={() => <AllEmployees />}
                    />
                    <PrivateRoute
                      exact
                      path="/dailyReports"
                      component={() => <DailyReports />}
                    />
                    <PrivateRoute
                      exact
                      path="/monthlyReports"
                      component={() => <MonthlyReports />}
                    />
                    <PrivateRoute
                      exact
                      path="/archive"
                      component={() => <Archive />}
                    />
                    <PrivateRoute
                      exact
                      path="/lookUpNotes"
                      component={() => <LookUpNotes />}
                    />
                    <PrivateRoute
                      exact
                      path="/lookUpProject"
                      component={() => <LookUpProjects />}
                    />
                    <PrivateRoute
                      exact
                      path="/lookUpHours"
                      component={() => <LookUpHours />}
                    />
                    <PrivateRoute
                      exact
                      path="/lookUpReport"
                      component={() => <LookUpReport />}
                    />
                    <PrivateRoute
                      exact
                      path="/lookUpEmployee"
                      component={() => <LookUpEmployee />}
                    />
                  </Switcher>
                </PageTransition>
              );
            }}
          />
        </Container>
      </BrowserRouter>
    </div>
  );
}

Layout.propTypes = {
  setLocale: PropTypes.func,
};

export default Layout;
