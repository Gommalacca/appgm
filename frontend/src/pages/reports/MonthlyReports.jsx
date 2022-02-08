import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import Select from "react-select";
import { useAlert } from "react-alert";
import { useIntl } from "react-intl";
import { FiTrash2 } from "react-icons/fi";
import { Divider } from "@material-ui/core";

import { MonthIT, MonthEN } from "../../data/month";
import ConfirmActionModal from "components/modals/ConfirmAction";

import { getMonthlyReport } from "functions/company.functions";
import { deleteHours } from "functions/projects.functions";

export default function MonthlyReports() {
  const intl = useIntl();
  const alert = useAlert();

  const [Months, setMonths] = useState([]);
  const [Workers, setWorkers] = useState([]);
  const [UserToDelete, setUserToDelete] = useState([]);
  const [ConfirmModalShow, setConfirmModalShow] = useState(false);

  const onDeleteHours = () => {
    var hours = UserToDelete.Hours.map((item) => item.id);
    deleteHours(hours, (error, result) => {
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
        const newWorkers = Workers.filter(
          (item) => item.id !== UserToDelete.id
        );
        setConfirmModalShow(false);
        setWorkers(newWorkers);
      }
    });
  };

  const delReport = (user) => {
    setUserToDelete(user);
    setConfirmModalShow(true);
  };

  useEffect(() => {
    const locale = intl.locale;
    switch (locale) {
      case "en":
        setMonths(MonthEN);
        break;
      case "it":
        setMonths(MonthIT);
        break;
      default:
        setMonths([]);
        break;
    }
  }, [intl.locale]);

  const onSelectChange = (month) => {
    getMonthlyReport(month.value, (error, result) => {
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
        setWorkers(result);
        return;
      }
    });
  };

  const getHours = (hours) => {
    var sum = 0;
    if (!hours) return;
    for (var x = 0; x < hours.length; x++) {
      sum += hours[x].Hours;
    }
    return sum;
  };
  const selectSyle = {
    control: (base) => ({
      ...base,
      border: "1px solid #d3d3d3",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid #d3d3d3",
      },
      "&:focus": {
        border: "1px solid #d3d3d3",
      },
    }),
  };
  return (
    <Container
      fluid
      style={{ height: "100%", marginTop: "4vh", textTransform: "uppercase" }}
    >
      <Row>
        <Col className="no-pad" md={2}>
          <h3> {intl.formatMessage({ id: "projectSelectMonth" })}:</h3>
        </Col>
        <Col className="no-pad" md={3}>
          <Select
            onChange={onSelectChange}
            isSearchable
            styles={selectSyle}
            name="color"
            defaultValue={Months[0]}
            options={Months}
          />
        </Col>
      </Row>
      <Divider style={{ marginTop: "4vh" }} />
      <Row>
        <Col style={{ height: "60vh", overflowY: "auto", width: "100%" }}>
          <Table responsive>
            <thead>
              <tr>
                <th>
                  {intl.formatMessage({ id: "projectTableHeaderWorker" })}
                </th>
                <th>
                  {intl.formatMessage({
                    id: "projectTableHeaderWorkerHours",
                  })}
                </th>
              </tr>
            </thead>
            <tbody>
              {Workers.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <FiTrash2
                        style={{ cursor: "pointer", marginRight: "2em" }}
                        onClick={() => delReport(item)}
                        size="14px"
                      ></FiTrash2>
                      {item.firstname} {item.lastname}
                    </td>
                    <td>
                      {item.Hours !== undefined && item.Hours.length > 0
                        ? getHours(item.Hours)
                        : 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
      <ConfirmActionModal
        show={ConfirmModalShow}
        onHide={setConfirmModalShow}
        onDelete={onDeleteHours}
        modalTitle={intl.formatMessage({ id: "deleteWorkerHoursTitleModal" })}
        modalBody={intl.formatMessage({ id: "deleteWorkerHoursBodyModal" })}
        modalButtonClose={intl.formatMessage({ id: "closeButton" })}
        modalButtonSave={intl.formatMessage({ id: "saveChangesButton" })}
      />
    </Container>
  );
}
