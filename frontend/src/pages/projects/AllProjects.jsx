import { getAllProjects } from "functions/projects.functions";
import React, { useEffect, useState } from "react";
import { ListGroup, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useIntl } from "react-intl";
import { useAlert } from "react-alert";

export default function AllProjects() {
  const [projects, setProjects] = useState([]);

  const intl = useIntl();
  const alert = useAlert();

  useEffect(() => {
    getAllProjects((error, result) => {
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
          return alert.error(intl.formatMessage({ id: "internalServerError" }));
        }
        return alert.error("Contact an administrator");
      }
      if (result) {
        setProjects(result);
      }
    });
  }, []);

  return (
    <Container fluid style={{ height: "100%", marginTop: "1.5em" }}>
      <Row>
        <Col>
          <ListGroup variant="flush">
            {projects.length > 0 ? (
              <>
                {projects.map((item, index) => {
                  return (
                    <Link
                      key={index}
                      style={{ textDecoration: "none", color: "black" }}
                      to={{
                        pathname: "/lookUpProject",
                        state: {
                          project: item,
                        },
                      }}
                    >
                      <ListGroup.Item
                        style={{ fontSize: "24px", fontWeight: "bold" }}
                        action
                      >
                        <span className="uppercase">{item.name}</span>
                      </ListGroup.Item>
                    </Link>
                  );
                })}
              </>
            ) : (
              <span>{intl.formatMessage({ id: "noProjectsFound" })}</span>
            )}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}
