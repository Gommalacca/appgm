import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import AsyncSelect from "react-select/async";
import { Divider } from "@material-ui/core";
import { useIntl } from "react-intl";
import { useAlert } from "react-alert";
import { FiTrash2 } from "react-icons/fi";
import {
  addFakeHoursToDaily,
  addHoursToProject,
  deleteHours,
  getAllProjects,
  getDailyProjectWorkers,
} from "functions/projects.functions";

import { saveReport } from "functions/reports.functions";

import AddHoursDailyModal from "components/workers/modal/AddHoursDaily";
import ConfirmActionModal from "components/modals/ConfirmAction";
import CreateDigitalSignature from "components/digitalSignature/modals/CreateDigitalSignature";

export default function DailyReports() {
  const intl = useIntl();
  const alert = useAlert();
  const [Workers, setWorkers] = useState([]);
  const [Projects, setProjects] = useState([]);
  const [trimmedData, setTrimmedData] = useState();
  const [ModalShow, setModalShow] = useState(false);
  const [UserToDelete, setUserToDelete] = useState({});
  const [refreshWorkers, setRefreshWorkers] = useState(false);
  const [ConfirmModalShow, setConfirmModalShow] = useState(false);
  const [digitalSignatureShow, setDigitalSignatureShow] = useState(false);
  const [CheckboxChecked, setCheckboxChecked] = useState(false);
  const [buttonActive, setButtonActive] = useState(true);
  var sigPad = {};

  useEffect(() => {
    const owner = localStorage.getItem("owner");
    const moderator = localStorage.getItem("moderator");
    if (!owner && !moderator) setCheckboxChecked(false);
    if (refreshWorkers) setRefreshWorkers(false);
    if (Projects.length === 0) return;
    if (CheckboxChecked) {
      getDailyProjectWorkers(Projects.id, (error, result) => {
        if (refreshWorkers) setRefreshWorkers(false);
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
          setWorkers(result);
        } else return;
      });
    }
  }, [refreshWorkers]);

  const setRef = (e) => {
    sigPad = e;
  };

  const resetRef = () => {
    sigPad.clear();
  };

  const trimSignature = () => {
    setTrimmedData(sigPad.getTrimmedCanvas().toDataURL("image/png"));
    setDigitalSignatureShow(false);
  };

  const onDeleteHours = () => {
    if (!CheckboxChecked) {
      const workers = Workers.filter((item) => item.id !== UserToDelete.id);
      setWorkers(workers);
      setConfirmModalShow(false);
      return;
    }
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

  const onSaveHours = async (_hours, _worker) => {
    const projectId = Projects.id;
    const workerId = _worker.id;
    const hours = _hours.value;
    if (!CheckboxChecked && Workers.length > 0) {
      const user = Workers.filter((item) => item.id === workerId);
      if (user.length > 0) {
        return alert.info(
          intl.formatMessage({ id: "userAlreadyExistRemoveFirst" })
        );
      }
    }
    if (CheckboxChecked) {
      addHoursToProject(
        projectId,
        workerId,
        hours,
        new Date().toISOString(),
        (error, result) => {
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
            if (CheckboxChecked) {
              setRefreshWorkers(true);
              return;
            }
            var _hours = [];
            _hours.push(result.hours.id);
            deleteHours(_hours, async (err, res) => {
              if (err) {
                if (err.code === "ECONNABORTED") {
                  return alert.error(
                    intl.formatMessage({ id: "lostConnectionToServer" })
                  );
                }
                if (err.response === undefined) {
                  return;
                }
                if (err.response.status == 400) {
                  return alert.error(intl.formatMessage({ id: "badData" }));
                }
                if (err.response.status == 401) {
                  return alert.error(
                    intl.formatMessage({ id: "unauthorized" })
                  );
                }
                if (err.response.status == 500) {
                  return alert.error(
                    intl.formatMessage({ id: "internalServerError" })
                  );
                }
                return alert.error("Contact an administrator");
              }
              if (res) {
                let workers = [...Workers];
                let obj = {
                  id: _worker.id,
                  firstname: _worker.firstname,
                  lastname: _worker.lastname,
                  Hours: [result.hours],
                };
                workers.push(obj);
                setWorkers(workers);
              }
            });
          }
        }
      );
    } else {
      addFakeHoursToDaily(
        projectId,
        workerId,
        hours,
        new Date().toISOString(),
        (error, result) => {
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
            var _hours = [];
            _hours.push(result.hours.id);

            let workers = [...Workers];
            let obj = {
              id: _worker.id,
              firstname: _worker.firstname,
              lastname: _worker.lastname,
              Hours: [result.hours],
            };
            workers.push(obj);
            setWorkers(workers);
          }
        }
      );
    }
  };

  const promiseOptions = (inputValue) =>
    new Promise((resolve, reject) => {
      return getAllProjects((error, result) => {
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
          alert.error("Contact an administrator");
          reject(error.message);
        }
        if (result) {
          const filter = result.filter((i) => {
            if (Projects.some((item) => item.id === i.id)) return;

            if (Projects.includes(i)) return;
            return i.name.toLowerCase().includes(inputValue.toLowerCase());
          });
          resolve(filter);
        }
      });
    });

  const onSelectChange = (selectedOptions) => {
    setProjects(selectedOptions);
    setRefreshWorkers(true);
  };

  const getHours = (hours) => {
    var sum = 0;
    if (!hours) return;
    for (var x = 0; x < hours.length; x++) {
      sum += hours[x].Hours;
    }
    return sum;
  };
  const archiveDaily = () => {
    const workers = [...Workers];
    workers.forEach((item) => delete item.ProjectAssignments);
    const digital = trimmedData ? trimmedData : null;
    setButtonActive(false);
    let obj = {
      projectId: Projects.id,
      workers: workers,
      digitalSignature: digital,
    };
    if (workers.length == 0) {
      setButtonActive(true);
      return alert.error(intl.formatMessage({ id: "noWorkerFound" }));
    }
    saveReport(obj, (error, result) => {
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
        alert.success(intl.formatMessage({ id: "success" }));
        setButtonActive(true);
        return;
      }
      return;
    });
  };

  const onCheckboxChange = () => {
    if (CheckboxChecked && Workers.length > 0) {
      setWorkers([]);
    }
    setCheckboxChecked(!CheckboxChecked);
    setRefreshWorkers(true);
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
        <Col md={2}>
          <h3>{intl.formatMessage({ id: "selectProject" })}</h3>
        </Col>
        <Col md={3}>
          <AsyncSelect
            defaultOptions
            styles={selectSyle}
            loadOptions={promiseOptions}
            getOptionLabel={(opt) => opt.name}
            getOptionValue={(opt) => opt.id}
            onChange={onSelectChange}
          />
        </Col>
        <Col md={2} style={{ marginTop: "1vh" }}>
          {(localStorage.getItem("moderator") ||
            localStorage.getItem("owner")) && (
            <Form>
              <Form.Group controlId="checkbox">
                <Form.Check
                  onChange={() => onCheckboxChange()}
                  checked={CheckboxChecked}
                  type="checkbox"
                  style={{ fontSize: "12px" }}
                  label={intl.formatMessage({ id: "autofillworkers" })}
                />
              </Form.Group>
            </Form>
          )}
        </Col>
      </Row>
      {Projects.id &&
        (localStorage.getItem("moderator") ||
          localStorage.getItem("owner")) && (
          <Row style={{ marginTop: "2vh" }}>
            <Col>
              <Button
                className="uppercase body-text btn-background"
                style={{ fontSize: "12px" }}
                onClick={() => setModalShow(!ModalShow)}
              >
                {intl.formatMessage({ id: "projectButtonAddWorkers" })}
              </Button>
            </Col>
          </Row>
        )}
      {Projects.id &&
        !CheckboxChecked &&
        !(
          localStorage.getItem("moderator") || localStorage.getItem("owner")
        ) && (
          <Row style={{ marginTop: "2vh" }}>
            <Col>
              <Button
                className="uppercase body-text btn-background"
                style={{ fontSize: "12px" }}
                onClick={() => setModalShow(!ModalShow)}
              >
                {intl.formatMessage({ id: "projectButtonAddWorkers" })}
              </Button>
            </Col>
          </Row>
        )}
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
      {Projects.id && (
        <>
          {trimmedData && (
            <Row style={{ marginBottom: "1vh" }}>
              <Col>
                <img
                  className="sigImage"
                  src={trimmedData}
                  style={{ maxWidth: "30vh" }}
                />
              </Col>
            </Row>
          )}

          <Row>
            <Col>
              <>
                {trimmedData ? (
                  <Button
                    className="uppercase btn-background small-button"
                    onClick={() => {
                      setTrimmedData(null);
                    }}
                  >
                    {intl.formatMessage({ id: "removeSignature" })}
                  </Button>
                ) : (
                  <Button
                    className="uppercase btn-background small-button"
                    onClick={() => {
                      setDigitalSignatureShow(true);
                    }}
                  >
                    {intl.formatMessage({ id: "addSignature" })}{" "}
                  </Button>
                )}
                <Button
                  style={{ background: buttonActive ? "" : "gray" }}
                  className="uppercase btn-background small-button mx-2"
                  onClick={() => archiveDaily()}
                >
                  {intl.formatMessage({ id: "archiveDaily" })}
                </Button>
              </>
            </Col>
          </Row>
        </>
      )}
      <AddHoursDailyModal
        show={ModalShow}
        projectID={Projects.id}
        onHide={setModalShow}
        onSaveHours={onSaveHours}
      />
      <ConfirmActionModal
        show={ConfirmModalShow}
        onHide={setConfirmModalShow}
        onDelete={onDeleteHours}
        modalTitle={intl.formatMessage({ id: "deleteWorkerHoursTitleModal" })}
        modalBody={intl.formatMessage({ id: "deleteWorkerHoursBodyModal" })}
        modalButtonClose={intl.formatMessage({ id: "closeButton" })}
        modalButtonSave={intl.formatMessage({ id: "saveChangesButton" })}
      />
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
