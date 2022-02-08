import {
  addModeratorToCompany,
  deleteEmployeeFromCompany,
  deleteModaratorFromCompany,
  getEmployeeHours,
  setAdvancedUserToCompany,
} from "functions/employees.functions";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { useIntl } from "react-intl";
import { useAlert } from "react-alert";
import { useHistory, useLocation } from "react-router-dom";
import ConfirmActionModal from "components/modals/ConfirmAction";

export default function LookUpEmployee() {
  const intl = useIntl();
  const alert = useAlert();
  const history = useHistory();
  const location = useLocation();

  const [employee, setEmployee] = useState({});
  const [ConfirmModalShow, setConfirmModalShow] = useState(false);
  const [refreshPage, setRefreshPage] = useState(false);
  const [EmployeeHours, setEmployeeHours] = useState([]);
  useEffect(() => {
    if (refreshPage) setRefreshPage(false);
    if (location.state !== undefined) {
      const employee = location.state.employee;
      if (!employee) history.push("/");
      setEmployee(employee);
      employeeHours(employee.id);
    } else {
      history.push("/");
    }
  }, [location, refreshPage]);

  const removeModerator = (employeeid) => {
    deleteModaratorFromCompany(employeeid, (error, result) => {
      if (error) {
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
          return alert.error(intl.formatMessage({ id: "internalServerError" }));
        }
        return alert.error("Contact an administrator");
      }
      if (result) {
        const employe = employee;
        employe.moderator = null;
        location.state.employee.moderator = null;
        setEmployee(employe);
        setRefreshPage(true);
      }
    });
  };

  const setAdvancedUser = (employeeId) => {
    setAdvancedUserToCompany(employeeId, (error, result) => {
      if (error) {
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
          return alert.error(intl.formatMessage({ id: "internalServerError" }));
        }
        return alert.error("Contact an administrator");
      }
      if (result) {
        var employe = employee;
        employe.EmployeesAssignments = result;
        setEmployee(employe);
        setRefreshPage(true);
      }
    });
  };

  const addModerator = (employeeid) => {
    addModeratorToCompany(employeeid, (error, result) => {
      if (error) {
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
          return alert.error(intl.formatMessage({ id: "internalServerError" }));
        }
        return alert.error("Contact an administrator");
      }
      if (result) {
        const employe = employee;
        employe.moderator = result;
        location.state.employee.moderator = result;
        setEmployee(employe);
        setRefreshPage(true);
      }
    });
  };

  const onDeleteEmployee = () => {
    deleteEmployeeFromCompany(employee.id, (error, result) => {
      if (error) {
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
          return alert.error(intl.formatMessage({ id: "internalServerError" }));
        }
        return alert.error("Contact an administrator");
      }
      if (result) {
        history.push("/allEmployees");
      }
    });
  };

  const employeeHours = (employeeId) => {
    getEmployeeHours(employeeId, (error, result) => {
      if (error) {
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
          return alert.error(intl.formatMessage({ id: "internalServerError" }));
        }
        return alert.error("Contact an administrator");
      }
      if (result) {
        setEmployeeHours(result);
      }
    });
  };
  return (
    <Container
      fluid
      style={{ height: "100%", marginTop: "2em" }}
      className="uppercase"
    >
      {employee && (
        <>
          <Row>
            <Col>
              <h5 style={{ display: "flex" }}>
                {intl.formatMessage({ id: "employeeLookUpPageTitle" })}:{" "}
                {employee.tag}
              </h5>
            </Col>
          </Row>
          <Row>
            <Col>
              <h6>
                Name: <span>{employee.firstname}</span>
              </h6>
            </Col>
          </Row>
          <Row>
            <Col>
              <h6>
                Firstname: <span>{employee.lastname}</span>
              </h6>
            </Col>
          </Row>
          <Row>
            <Col>
              <h6>
                Moderator: <span>{!employee.moderator ? "false" : "true"}</span>
              </h6>
            </Col>
          </Row>
          <Row>
            <Col>
              <h6>
                Advanced User:{" "}
                <span>
                  {employee.EmployeesAssignments !== undefined &&
                  employee.EmployeesAssignments.AdvancedUser
                    ? "true"
                    : "false"}
                </span>
              </h6>
            </Col>
          </Row>

          <Row style={{ marginTop: "2vh" }} noGutters={true}>
            <Col xs={12} md={1} className="mt-2 mx-md-2">
              {employee.moderator ? (
                <Button
                  className="btn-background small-button"
                  style={{
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => removeModerator(employee.id)}
                >
                  {intl.formatMessage({ id: "removeModerator" })}
                </Button>
              ) : (
                <Button
                  className="btn-background small-button "
                  style={{
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => addModerator(employee.id)}
                >
                  {intl.formatMessage({ id: "addModerator" })}
                </Button>
              )}
            </Col>
            <Col xs={12} md={1} className="mt-2">
              {employee.EmployeesAssignments !== undefined &&
              !employee.EmployeesAssignments.AdvancedUser ? (
                <Button
                  className="btn-background small-button"
                  style={{
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => setAdvancedUser(employee.id)}
                >
                  {intl.formatMessage({ id: "canArchiveDaily" })}
                </Button>
              ) : (
                <Button
                  className="btn-background small-button"
                  style={{
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => setAdvancedUser(employee.id)}
                >
                  {intl.formatMessage({ id: "cantArchiveDaily" })}
                </Button>
              )}
            </Col>
            <Col xs={12} md={1} className="mt-2">
              <Button
                className="btn-background small-button"
                style={{
                  whiteSpace: "nowrap",
                }}
                onClick={() => setConfirmModalShow(true)}
              >
                {intl.formatMessage({ id: "deleteEmployee" })}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table className="mt-5 px-3">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Project</th>
                    <th>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {EmployeeHours &&
                    EmployeeHours.Hours &&
                    EmployeeHours.Hours.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            {
                              new Date(item.createdAt)
                                .toLocaleString()
                                .split(",")[0]
                            }
                          </td>
                          <td>{item.Project.name}</td>
                          <td>{item.Hours}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Col>
          </Row>
        </>
      )}
      <ConfirmActionModal
        show={ConfirmModalShow}
        onHide={setConfirmModalShow}
        onDelete={onDeleteEmployee}
        modalTitle={intl.formatMessage({ id: "deleteEmployeeTitleModal" })}
        modalBody={intl.formatMessage({ id: "deleteEmployeeBodyModal" })}
        modalButtonClose={intl.formatMessage({ id: "closeButton" })}
        modalButtonSave={intl.formatMessage({ id: "saveChangesButton" })}
      />
    </Container>
  );
}
