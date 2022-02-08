import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { useAlert } from "react-alert";
import { useIntl } from "react-intl";
import { useHistory, useLocation } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { deleteWorkerHour, deleteHours } from "functions/projects.functions";

export default function LookUpHours() {
  const [hours, setHours] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const alert = useAlert();

  const history = useHistory();
  const location = useLocation();
  const intl = useIntl();

  useEffect(() => {
    if (location.state !== undefined) {
      const hours = location.state.hours;
      if (hours == null || hours == 0) {
        setHours(null);
        return;
      }
      if (!hours) history.push("/");
      const _hours = hours.reverse((item) => item.createdAt);
      var sum = 0;
      _hours.forEach((item) => {
        sum += item.Hours;
      });
      setHours(_hours);
      setTotalHours(sum);
    } else {
      history.push("/");
    }
  }, [location]);

  const onDeleteHours = (_hours) => {
    const moderator = localStorage.getItem("moderator");
    const owner = localStorage.getItem("owner");
    if (moderator || owner) {
      var arr = [];
      arr.push(_hours.id);
      deleteHours(arr, (error, result) => {
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
            return alert.error(
              intl.formatMessage({ id: "internalServerError" })
            );
          }
          return alert.error("Contact an administrator");
        }
        if (result) {
          const oldHours = [...hours];
          const newHours = oldHours.filter((item) => item.id !== _hours.id);
          setHours(newHours);
          return;
        }
      });
    } else {
      deleteWorkerHour(_hours.id, (error, result) => {
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
            return alert.error(
              intl.formatMessage({ id: "internalServerError" })
            );
          }
          return alert.error("Contact an administrator");
        }
        if (result) {
          const oldHours = [...hours];
          const newHours = oldHours.filter((item) => item.id !== _hours.id);

          setHours(newHours);
        }
      });
    }
    return;
  };

  return (
    <Container fluid style={{ height: "100%" }} className="uppercase">
      <Row style={{ marginTop: "2vh" }}>
        <Col>
          <strong>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => history.goBack()}
            >
              {intl.formatMessage({ id: "goBack" })}
            </span>
          </strong>
        </Col>
      </Row>

      <Row style={{ marginTop: "5vh" }}>
        <Col style={{ height: "80vh", overflowY: "auto", width: "100%" }}>
          <Table responsive>
            <thead>
              <tr>
                <th>{intl.formatMessage({ id: "hoursTableHeaderDate" })}</th>
                <th>
                  {intl.formatMessage({
                    id: "hoursTableHeaderHours",
                  })}
                </th>
              </tr>
            </thead>
            <tbody>
              {hours &&
                hours.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td>
                        {item.Hours}
                        <FiTrash2
                          style={{ marginLeft: "10px", cursor: "pointer" }}
                          onClick={() => onDeleteHours(item)}
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <span>
            {intl.formatMessage({ id: "totalHours" })}: {totalHours}
          </span>
        </Col>
      </Row>
    </Container>
  );
}
