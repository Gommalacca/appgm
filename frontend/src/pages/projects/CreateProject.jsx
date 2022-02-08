import React, { useCallback, useState } from "react";
import { Button, Container, Form, Row } from "react-bootstrap";
import { useAlert } from "react-alert";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import it from "date-fns/locale/it";
import { createProject } from "functions/projects.functions";

export default function CreateProject() {
  const alert = useAlert();
  const intl = useIntl();
  const history = useHistory();
  const [startDate, setStartDate] = useState(new Date());
  const [projectName, setProjectName] = useState("");
  const [projectPlace, setProjectPlace] = useState("");

  const handleOnClick = useCallback(
    () => history.push("/allProjects"),
    [history]
  );

  const onProjectNameChange = (e) => {
    setProjectName(e);
  };

  const onProjectPlaceChange = (e) => {
    setProjectPlace(e);
  };

  const onProjectCreate = () => {
    var project = {
      name: projectName,
      startAt: startDate,
      locality: projectPlace,
    };
    createProject(project, (error, result) => {
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
        handleOnClick();
      }
    });
  };

  registerLocale("it", it);
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center uppercase"
      style={{ height: "100%" }}
    >
      <Row>
        <Form>
          <h3> {intl.formatMessage({ id: "createproject" })}</h3>
          <Form.Group>
            <Form.Label>{intl.formatMessage({ id: "projectName" })}</Form.Label>
            <Form.Control
              size="lg"
              type="text"
              onChange={(e) => onProjectNameChange(e.currentTarget.value)}
              id="projectName"
              placeholder={intl.formatMessage({ id: "projectName" })}
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>
              {intl.formatMessage({ id: "projectPlace" })}
            </Form.Label>

            <Form.Control
              size="lg"
              type="text"
              onChange={(e) => onProjectPlaceChange(e.currentTarget.value)}
              id="projectPlace"
              placeholder={intl.formatMessage({ id: "projectPlace" })}
            />
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>{intl.formatMessage({ id: "projectDate" })}</Form.Label>
            <br />
            <DatePicker
              selected={startDate}
              locale="it"
              dateFormat="dd/MM/yyyy"
              // @ts-ignore
              onChange={(date) => setStartDate(date)}
            />
          </Form.Group>
          <br />
          <Button className="btn-background" onClick={onProjectCreate}>
            {intl.formatMessage({ id: "createproject" })}
          </Button>
        </Form>
      </Row>
    </Container>
  );
}
