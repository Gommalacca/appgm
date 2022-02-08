import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { Divider } from "@material-ui/core";
import { useIntl } from "react-intl";
import { useHistory, useLocation } from "react-router-dom";
import { RiAddBoxLine } from "react-icons/ri";
import CreateDigitalSignature from "components/digitalSignature/modals/CreateDigitalSignature";
import { saveDigitalSignature } from "functions/reports.functions";
import { useAlert } from "react-alert";

export default function LookUpReport() {
  const alert = useAlert();
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const [Workers, setWorkers] = useState([]);
  const [report, setReport] = useState({});
  const [DigitalSignature, setDigitalSignature] = useState();
  const [digitalSignatureShow, setDigitalSignatureShow] = useState(false);
  const [trimmedData, setTrimmedData] = useState();

  var sigPad = {};
  const setRef = (e) => {
    sigPad = e;
  };
  const resetRef = () => {
    sigPad.clear();
  };

  const trimSignature = () => {
    const digitalUrl = sigPad.getTrimmedCanvas().toDataURL("image/png");
    setTrimmedData(digitalUrl);
    saveDigitalSignature(digitalUrl, report.id, (error, result) => {
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
        return;
      }
    });
    setDigitalSignatureShow(false);
  };
  const getHours = (hours) => {
    var sum = 0;
    if (!hours) return;
    for (var x = 0; x < hours.length; x++) {
      sum += hours[x].Hours;
    }
    return sum;
  };

  useEffect(() => {
    if (location.state !== undefined) {
      const report = location.state.report;
      if (!report) history.push("/");
      setReport(report);
      const workers = [...Workers];
      workers.push(report.workers);
      setWorkers(workers);
      if (report.digitalSignature) {
        setDigitalSignature(report.digitalSignature);
      }
    } else {
      history.push("/");
    }
  }, [location]);
  return (
    <Container
      fluid
      style={{ height: "100%", marginTop: "4vh", textTransform: "uppercase" }}
    >
      <Row>
        <Col>
          <h1>{report.projectName}</h1>
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
              {Workers.map((_item, xIndex) => {
                return (
                  <React.Fragment key={xIndex}>
                    {_item.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{item.firstname}</td>
                          <td>
                            {item.Hours !== undefined && item.Hours.length > 0
                              ? getHours(item.Hours)
                              : 0}
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row style={{ marginBottom: "3vh" }}>
        <Col>
          {DigitalSignature && !trimmedData ? (
            <img
              className="sigImage"
              src={DigitalSignature}
              style={{ maxWidth: "25vh" }}
            />
          ) : trimmedData && !DigitalSignature ? (
            <img
              className="sigImage"
              src={trimmedData}
              style={{ maxWidth: "30vh" }}
            />
          ) : (
            <RiAddBoxLine
              style={{ cursor: "pointer" }}
              onClick={() => setDigitalSignatureShow(true)}
              size={"20px"}
            />
          )}
        </Col>
      </Row>
      <CreateDigitalSignature
        trimSignature={trimSignature}
        setRef={setRef}
        show={digitalSignatureShow}
        onHide={setDigitalSignatureShow}
        resetRef={resetRef}
      />
    </Container>
  );
}
