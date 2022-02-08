import { getAllEmployees } from "functions/employees.functions";
import React, { useState, useEffect } from "react";
import { ListGroup, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useIntl } from "react-intl";
import { useAlert } from "react-alert";
import { RiAdminLine } from "react-icons/ri";

export default function AllWorkers() {
  const [employees, setEmployees] = useState([]);
  const intl = useIntl();
  const alert = useAlert();

  useEffect(() => {
    getAllEmployees((error, result) => {
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
        setEmployees(result);
      }
    });
  }, []);
  return (
    <Container
      fluid
      style={{ height: "100%", marginTop: "1.5em" }}
      className="uppercase"
    >
      <Row>
        <Col>
          <ListGroup variant="flush">
            {employees.length === 0 ? (
              <span>No employees found</span>
            ) : (
              <>
                {employees.map((employee, index) => {
                  return (
                    <ListGroup.Item
                      key={index}
                      style={{ fontSize: "22px", fontWeight: "bold" }}
                      action
                    >
                      <Link
                        style={{ textDecoration: "none", color: "black" }}
                        to={{
                          pathname: "/lookUpEmployee",
                          state: {
                            employee: employee,
                          },
                        }}
                      >
                        {employee.firstname} {employee.lastname}
                      </Link>
                      {employee.moderator && (
                        <RiAdminLine style={{ marginLeft: "4vh" }} />
                      )}
                    </ListGroup.Item>
                  );
                })}
              </>
            )}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}
