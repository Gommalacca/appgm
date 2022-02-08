import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import { useAlert } from "react-alert";
import { getRecentReport } from "functions/company.functions";
import { Link } from "react-router-dom";

const Main = () => {
  const [Projects, setProjects] = useState([]);
  const intl = useIntl();
  const alert = useAlert();

  useEffect(() => {
    getRecentReport((error, result) => {
      if (error) {
        let _projects = [];
        setProjects(_projects);

        if (error.code === "ECONNABORTED") {
          return alert.error(
            intl.formatMessage({ id: "lostConnectionToServer" })
          );
        }
        if (error.response === undefined) {
          return alert.error(
            intl.formatMessage({ id: "lostConnectionToServer" })
          );
        }
        if (error.response.status == 400) {
          return alert.error(intl.formatMessage({ id: "badData" }));
        }
        if (error.response.status == 401) {
          return alert.error(intl.formatMessage({ id: "unauthorized" }));
        }
        if (error.response.status == 500) {
          return alert.info(intl.formatMessage({ id: "noProjectsFound" }));
        }
        return alert.error("Contact an administrator");
      }
      if (result) {
        console.log(result);
        setProjects(result);
      }
    });
  }, []);

  return (
    <>
      <header>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css"
        />
      </header>
      {Projects.length > 0 ? (
        <div className="twitter-styles container">
          <div className="col-md-12">
            <div className="panel panel-default">
              <div className="panel-heading">Employees</div>
              <div className="panel-body">
                <table className="table table-condensed table-striped">
                  <thead>
                    <tr>
                      <th>Data</th>
                      {localStorage.getItem("owner") && <th>Nome</th>}
                      <th>Progetto</th>
                      <th>Ore</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Projects.map((item, index) => (
                      <tr
                        key={`show-${index}`}
                        data-toggle="collapse"
                        data-target={`#project${index}`}
                        className="accordion-toggle"
                      >
                        <td>
                          {
                            new Date(item.createdAt)
                              .toLocaleString()
                              .split(",")[0]
                          }
                        </td>

                        {localStorage.getItem("owner") && (
                          <td>
                            <Link
                              style={{ textDecoration: "none", color: "black" }}
                              to={{
                                pathname: "/lookUpEmployee",
                                state: {
                                  employee: item.User,
                                },
                              }}
                            >
                              {item.User.firstname} {item.User.lastname}
                            </Link>
                          </td>
                        )}

                        <td>
                          <Link
                            key={index}
                            style={{ textDecoration: "none", color: "black" }}
                            to={{
                              pathname: "/lookUpProject",
                              state: {
                                project: item.Project,
                              },
                            }}
                          >
                            {item.Project.name}
                          </Link>
                        </td>
                        <td>{item.Hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <span>{intl.formatMessage({ id: "noProjectsFound" })}</span>
      )}
    </>
  );
};

Main.propTypes = {
  handleLanguageChange: PropTypes.func,
};

export default Main;
