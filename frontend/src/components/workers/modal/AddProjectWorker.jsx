import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import { getAllEmployees } from "functions/employees.functions";
import { useAlert } from "react-alert";

const AddProjectWorkerModal = ({ show, setShow, addWorkers, workers }) => {
  const [selected, setSelected] = useState([]);
  const intl = useIntl();
  const animatedComponents = makeAnimated();
  const alert = useAlert();
  const handleAddWorkerClose = () => {
    setShow(false);
  };
  const handleAddWorkerAdd = () => {
    setShow(false);
    addWorkers(selected);
    setSelected([]);
  };

  const promiseOptions = (inputValue) =>
    new Promise((resolve, reject) => {
      return getAllEmployees((error, result) => {
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
            if (workers.some((item) => item.id === i.id)) return;

            if (workers.includes(i)) return;
            return i.firstname.toLowerCase().includes(inputValue.toLowerCase());
          });
          resolve(filter);
        }
      });
    });

  const onSelectChange = (selectedOptions) => {
    setSelected(selectedOptions);
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
    <Modal style={{ top: "5em" }} show={show} onHide={handleAddWorkerClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {intl.formatMessage({ id: "addWorkerModalHeader" })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AsyncSelect
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          styles={selectSyle}
          cacheOptions
          defaultOptions
          loadOptions={promiseOptions}
          getOptionLabel={(opt) => opt.tag}
          getOptionValue={(opt) => opt.id}
          onChange={onSelectChange}
          value={selected}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleAddWorkerClose}>
          {intl.formatMessage({ id: "closeButton" })}
        </Button>
        <Button className="btn-background" onClick={handleAddWorkerAdd}>
          {intl.formatMessage({ id: "saveChangesButton" })}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

AddProjectWorkerModal.propTypes = {
  setShow: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  addWorkers: PropTypes.func.isRequired,
  workers: PropTypes.array.isRequired,
};

export default AddProjectWorkerModal;
