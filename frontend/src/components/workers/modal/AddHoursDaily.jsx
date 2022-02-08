import React, { useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { getWorkersProject } from "functions/projects.functions";
import { hours } from "./data/hours";
import { useAlert } from "react-alert";

function AddHoursDailyModal({ projectID, onSaveHours, show, onHide }) {
  const intl = useIntl();
  const [promiseSelect, setPromiseSelected] = useState([]);
  const [selected, setSelected] = useState([]);
  const [Workers, setWorkers] = useState([]);
  const saveWorker = () => {
    const worker = [...Workers];
    worker.push(selected);
    setWorkers(worker);
    onSaveHours(selected, promiseSelect);
    onHide();
  };
  const alert = useAlert();

  const onPromiseSelectChange = (selectedOptions) => {
    setPromiseSelected(selectedOptions);
  };
  const onSelectChange = (selectedOptions) => {
    setSelected(selectedOptions);
  };

  const promiseOptions = (inputValue) =>
    new Promise((resolve, reject) => {
      return getWorkersProject(projectID, (error, result) => {
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
          reject(error);
        }
        if (result) {
          const filter = result.filter((i) => {
            if (Workers.some((item) => item.id === i.id)) return;

            if (Workers.includes(i)) return;
            return i.firstname.toLowerCase().includes(inputValue.toLowerCase());
          });
          resolve(filter);
        }
      });
    });
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
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {intl.formatMessage({ id: "AddWorkerHoursDaily" })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="">
          <Row>
            <Col xs={8} md={8} style={{ marginBottom: "1vh" }}>
              <span>{intl.formatMessage({ id: "workers" })}</span>
              <AsyncSelect
                cacheOptions
                defaultOptions
                styles={selectSyle}
                loadOptions={promiseOptions}
                getOptionLabel={(opt) => opt.tag}
                getOptionValue={(opt) => opt.id}
                onChange={onPromiseSelectChange}
                value={promiseSelect}
              />
            </Col>
            <Col xs={4} md={4}>
              <span>{intl.formatMessage({ id: "Hours" })}</span>
              <Select
                styles={selectSyle}
                onChange={onSelectChange}
                isSearchable
                name="color"
                defaultValue={hours[0]}
                options={hours}
                value={selected}
              />
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-background" onClick={saveWorker}>
          {intl.formatMessage({ id: "saveChangesButton" })}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

AddHoursDailyModal.propTypes = {
  projectID: PropTypes.number,
  onSaveHours: PropTypes.func.isRequired,
  show: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
};

export default AddHoursDailyModal;
