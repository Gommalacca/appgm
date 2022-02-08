import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { FiDownload } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import { Divider } from "@material-ui/core";

import { PDFDownloadLink } from "@react-pdf/renderer";
import DailyPdfDocument from "components/pdf/DailyDocument";

import {
  deleteDailyReport,
  getAllDailyReports,
} from "functions/reports.functions";

export default function Archive() {
  const [dailyReports, setDailyReports] = useState([]);
  console.log(dailyReports);
  const alert = useAlert();
  const intl = useIntl();
  useEffect(() => {
    getAllDailyReports((error, result) => {
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
        setDailyReports(result);
      }
    });
  }, []);

  const deleteReport = (reportId) => {
    deleteDailyReport(reportId, (error, res) => {
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
      if (res) {
        const reports = [...dailyReports];
        const rep = reports.filter((item) => item.id !== reportId);
        setDailyReports(rep);
      }
    });
  };

  return (
    <Container fluid style={{ height: "100%", marginTop: "2vh" }}>
      <Row className="uppercase">
        <Col>
          <h2>{intl.formatMessage({ id: "allDailyReports" })}</h2>
        </Col>
      </Row>
      <Divider />
      {dailyReports.length > 0 && (
        <Row style={{ marginTop: "4vh" }} className="uppercase">
          <Col>
            <span>
              <strong>{intl.formatMessage({ id: "date" })}</strong>
            </span>
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <ListGroup variant="flush">
            {dailyReports.map((dailyReport, index) => {
              return (
                <ListGroup.Item className="uppercase mt-md-0 mt-2" key={index}>
                  {new Date(dailyReport.createdAt).toLocaleString()} -{" "}
                  {dailyReport.projectName}
                  <Button
                    className="uppercase btn-background small-button mx-md-2"
                    size={"sm"}
                  >
                    <Link
                      key={index}
                      style={{ textDecoration: "none", color: "white" }}
                      to={{
                        pathname: "/lookUpReport",
                        state: {
                          report: dailyReport,
                        },
                      }}
                    >
                      {intl.formatMessage({ id: "seeElement" })}
                    </Link>
                  </Button>
                  {dailyReport.digitalSignature ? (
                    <>
                      <PDFDownloadLink
                        document={<DailyPdfDocument report={dailyReport} />}
                        fileName={`${dailyReport.projectName}.pdf`}
                      >
                        {({ loading }) =>
                          loading ? (
                            <FiDownload
                              className="mx-2"
                              style={{ color: "gray" }}
                              size={"24px"}
                            />
                          ) : (
                            <FiDownload
                              className="mx-2"
                              style={{ cursor: "pointer" }}
                              size={"24px"}
                            />
                          )
                        }
                      </PDFDownloadLink>
                    </>
                  ) : (
                    <FiDownload
                      style={{ color: "gray" }}
                      className="mx-2"
                      size={"24px"}
                    />
                  )}
                  {(localStorage.getItem("moderator") ||
                    localStorage.getItem("owner")) && (
                    <FiTrash2
                      style={{ cursor: "pointer" }}
                      className="mx-2"
                      size={"24px"}
                      onClick={() => deleteReport(dailyReport.id)}
                    />
                  )}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}
