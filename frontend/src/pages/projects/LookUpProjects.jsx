import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAlert } from "react-alert";
import { useIntl } from "react-intl";
import { FiTrash2, FiDownload } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";

import AddHoursWorker from "components/workers/modal/AddHoursWorker";
import ConfirmActionModal from "components/modals/ConfirmAction";
import AddProjectWorkerModal from "components/workers/modal/AddProjectWorker";

import {
  addHoursToProject,
  addWorkersToProject,
  deleteHours,
  deleteProject,
  deleteWorkerFromProject,
  getWorkersProject,
} from "functions/projects.functions";

import MonthlyPdfDocument from "components/pdf/MonthlyDocument";
import { PDFDownloadLink } from "@react-pdf/renderer";

export default function LookUpProjects() {
  const intl = useIntl();
  const alert = useAlert();
  const history = useHistory();
  const location = useLocation();
  const [project, setProject] = useState({});
  const [workers, setWorkers] = useState([]);
  const [ConfirmModalShow, setConfirmModalShow] = useState(false);
  const [ProjectToDelete, setProjectToDelete] = useState({});
  const [WorkerToDelete, setWorkerToDelete] = useState({});
  const [RefreshWorkers, setRefreshWorkers] = useState(false);
  const [addWokerShow, addWorkerSetShow] = useState(false);
  const [confirmHoursModalShow, setConfirmHoursModalShow] = useState(false);
  const [addWorkerHoursModal, setAddWorkerHoursModalShow] = useState(false);
  const [wantPdf, setWantPdf] = useState(false);

  useEffect(() => {
    if (location.state !== undefined) {
      const project = location.state.project;
      if (!project) history.push("/");
      getWorkersProject(project.id, (error, result) => {
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
          const workers = result;
          if (!workers) history.push("/");
          project.totalHours = 20;
          setProject(project);
          setWorkers(workers);
          if (RefreshWorkers) setRefreshWorkers(false);
        }
      });
    } else {
      history.push("/");
    }
    if (project === null) {
      history.push("/");
    }
  }, [location, RefreshWorkers]);

  const handleAddWorkerShow = () => addWorkerSetShow(true);

  const addWorkers = (_workers) => {
    if (_workers.length === 0)
      return alert.error(intl.formatMessage({ id: "internalServerError" }));
    addWorkersToProject(project.id, _workers, (error, result) => {
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
        var oldWorkers = [...workers];
        for (var x = 0; x < result.length; x++) {
          oldWorkers.push({
            id: result[x].id,
            firstname: result[x].firstname,
            lastname: result[x].lastname,
            tag: result[x].tag,
          });
        }
        setWorkers(oldWorkers);
        setRefreshWorkers(true);
      }
    });
  };

  const onDeleteProject = () => {
    setConfirmModalShow(false);

    deleteProject(ProjectToDelete.id, (error, result) => {
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
        setProjectToDelete({});
        history.push("/allProjects");
      }
    });
  };

  const askDeleteHours = () => {
    setConfirmModalShow(false);
    setConfirmHoursModalShow(true);
  };

  const onDeleteWorker = () => {
    const projectID = project.id;
    const workerID = WorkerToDelete.id;

    deleteWorkerFromProject(projectID, workerID, (error, result) => {
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
        setWorkerToDelete({});
        setConfirmModalShow(false);
        if (confirmHoursModalShow) setConfirmHoursModalShow(false);
        const newWorker = workers.filter((item) => item.id !== workerID);
        setWorkers(newWorker);
      }
    });
  };

  const onDeleteHours = () => {
    if (WorkerToDelete.Hours.length === 0) {
      setConfirmHoursModalShow(false);
      onDeleteWorker();
      return;
    }
    var hours = WorkerToDelete.Hours.map((item) => item.id);
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
        setConfirmHoursModalShow(false);
        onDeleteWorker();
      }
    });
  };

  const delWorker = (worker) => {
    setWorkerToDelete(worker);
    setConfirmModalShow(true);
  };

  const delProject = (project) => {
    setProjectToDelete(project);
    setConfirmModalShow(true);
  };

  const hideModal = () => {
    setConfirmModalShow(false);
    setWorkerToDelete({});
    setProjectToDelete({});
  };

  const getHours = (hours) => {
    var sum = 0;
    if (!hours) return;
    for (var x = 0; x < hours.length; x++) {
      sum += hours[x].Hours;
    }
    return sum;
  };

  const setProjectTotalHours = () => {
    var sum = 0;
    workers.forEach((item) => {
      const hours = item.Hours;
      if (!hours) return;
      for (var x = 0; x < hours.length; x++) {
        sum += hours[x].Hours;
      }
    });
    return sum;
  };

  const onAddWokerHours = (hours, date, workerId) => {
    addHoursToProject(project.id, workerId, hours, date, (error, result) => {
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
        setRefreshWorkers(true);
      }
    });
  };

  const createPdf = () => {
    setWantPdf(!wantPdf);
  };

  return (
    <Container
      fluid
      style={{ height: "100%", marginTop: "2em" }}
      className="uppercase"
    >
      {project && (
        <>
          <Row>
            <Col>
              <span style={{ fontSize: "12px" }}>
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to="/allProjects"
                >
                  {intl.formatMessage({ id: "allProjects" })}
                </Link>{" "}
                /
              </span>
              <h2 className="no-cursor">
                {project.name}
                {(localStorage.getItem("owner") ||
                  localStorage.getItem("moderator")) && (
                  <FiTrash2
                    style={{ cursor: "pointer" }}
                    onClick={() => delProject(project)}
                    size="18px"
                  ></FiTrash2>
                )}
              </h2>
            </Col>
            <hr />
          </Row>
          <Row
            className="no-gutters "
            style={{
              marginBottom: "1em",
              textAlign: "left",
              maxWidth: "90rem",
            }}
          >
            {localStorage.getItem("owner") ||
            localStorage.getItem("moderator") ? (
              <></>
            ) : (
              <Col xs="4" md="1">
                <Button
                  className="uppercase btn-background"
                  onClick={() =>
                    setAddWorkerHoursModalShow(!addWorkerHoursModal)
                  }
                  style={{ fontSize: "10px", textAlign: "center" }}
                >
                  {intl.formatMessage({ id: "addHoursToProject" })}
                </Button>
              </Col>
            )}
            {(localStorage.getItem("owner") ||
              localStorage.getItem("moderator")) && (
              <Col xs="4" md="1" style={{ marginRight: "2rem" }}>
                <Button
                  className="uppercase btn-background"
                  onClick={handleAddWorkerShow}
                  style={{
                    fontSize: "10px",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {intl.formatMessage({ id: "addWorker" })}
                </Button>
              </Col>
            )}
            <Col xs="4" md="1">
              <Link
                style={{
                  textDecoration: "none",
                  color: "white",
                  textAlign: "center",
                }}
                to={{
                  pathname: "/lookUpNotes",
                  state: {
                    project: project,
                  },
                }}
              >
                <Button
                  style={{ fontSize: "10px", textAlign: "center" }}
                  className="btn-background uppercase"
                >
                  {intl.formatMessage({ id: "projectNotes" })}
                </Button>
              </Link>
            </Col>

            {(localStorage.getItem("owner") ||
              localStorage.getItem("moderator")) && (
              <>
                {!wantPdf && (
                  <Col xs="2" md="1" style={{ whiteSpace: "nowrap" }}>
                    <Button
                      className="uppercase btn-background"
                      style={{ fontSize: "10px", textAlign: "center" }}
                      onClick={() => createPdf()}
                    >
                      {intl.formatMessage({ id: "createPdf" })}
                    </Button>
                  </Col>
                )}
                {wantPdf && (
                  <Col xs="2" md="1" style={{ whiteSpace: "nowrap" }}>
                    <PDFDownloadLink
                      document={
                        <MonthlyPdfDocument
                          Project={project}
                          Workers={workers}
                        />
                      }
                      fileName={`${project.name}.pdf`}
                    >
                      {({ loading }) =>
                        loading ? (
                          <FiDownload style={{ color: "gray" }} size={"24px"} />
                        ) : (
                          <FiDownload
                            onClick={() => createPdf()}
                            size={"24px"}
                          />
                        )
                      }
                    </PDFDownloadLink>
                  </Col>
                )}
              </>
            )}
          </Row>
          <Row>
            <Col style={{ height: "60vh", overflowY: "auto", width: "100%" }}>
              <Table responsive>
                <thead>
                  <tr>
                    <th className="no-cursor">
                      {intl.formatMessage({ id: "projectTableHeaderWorker" })}
                    </th>
                    <th className="no-cursor">
                      {intl.formatMessage({
                        id: "projectTableHeaderWorkerHours",
                      })}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="no-cursor">
                          {(localStorage.getItem("owner") ||
                            localStorage.getItem("moderator")) && (
                            <FiTrash2
                              style={{ cursor: "pointer", marginRight: "2em" }}
                              onClick={() => delWorker(item)}
                              size="14px"
                            ></FiTrash2>
                          )}
                          {item.firstname} {item.lastname}
                        </td>
                        <td className="no-cursor">
                          {item.Hours !== undefined && item.Hours.length > 0 ? (
                            <>
                              {getHours(item.Hours)}{" "}
                              <Link
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                }}
                                to={{
                                  pathname: "/lookUpHours",
                                  state: {
                                    hours: item.Hours,
                                  },
                                }}
                              >
                                <AiOutlineEye
                                  size={"18px"}
                                  style={{ cursor: "pointer" }}
                                />
                              </Link>
                            </>
                          ) : (
                            <>
                              0
                              <Link
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                }}
                                to={{
                                  pathname: "/lookUpHours",
                                  state: {
                                    hours: 0,
                                  },
                                }}
                              >
                                <AiOutlineEye
                                  size={"18px"}
                                  style={{ cursor: "pointer" }}
                                />
                              </Link>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row className="text-align-center" style={{ textAlign: "center" }}>
            <Col>
              <span style={{ fontWeight: "bolder" }} className="no-cursor">
                {setProjectTotalHours()}{" "}
                {intl.formatMessage({ id: "totalHours" })}
              </span>
            </Col>
          </Row>

          <AddProjectWorkerModal
            show={addWokerShow}
            setShow={addWorkerSetShow}
            addWorkers={addWorkers}
            workers={workers}
          />
        </>
      )}
      {ProjectToDelete.id && (
        <ConfirmActionModal
          show={ConfirmModalShow}
          onHide={hideModal}
          onDelete={onDeleteProject}
          modalTitle={intl.formatMessage({ id: "deleteProjectTitleModal" })}
          modalBody={intl.formatMessage({ id: "deleteProjectBodyModal" })}
          modalButtonClose={intl.formatMessage({ id: "closeButton" })}
          modalButtonSave={intl.formatMessage({ id: "saveChangesButton" })}
        />
      )}
      {WorkerToDelete.id && (
        <ConfirmActionModal
          show={ConfirmModalShow}
          onHide={hideModal}
          onDelete={askDeleteHours}
          modalTitle={intl.formatMessage({ id: "deleteWorkerTitleModal" })}
          modalBody={intl.formatMessage({ id: "deleteWorkerBodyModal" })}
          modalButtonClose={intl.formatMessage({ id: "closeButton" })}
          modalButtonSave={intl.formatMessage({ id: "yesButton" })}
        />
      )}
      {
        <ConfirmActionModal
          show={confirmHoursModalShow}
          onHide={onDeleteWorker}
          onDelete={onDeleteHours}
          modalTitle={intl.formatMessage({ id: "deleteWorkerHoursTitleModal" })}
          modalBody={intl.formatMessage({
            id: "askToDeleteWorkerHoursBodyModal",
          })}
          modalButtonClose={intl.formatMessage({ id: "noButton" })}
          modalButtonSave={intl.formatMessage({ id: "yesButton" })}
        />
      }

      <AddHoursWorker
        show={addWorkerHoursModal}
        onHide={setAddWorkerHoursModalShow}
        onAddHours={onAddWokerHours}
      />
    </Container>
  );
}
