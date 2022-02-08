import React, { useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import Select from "react-select";
import { hours } from "./data/hours";
import DatePicker, { registerLocale } from "react-datepicker";
import it from "date-fns/locale/it";

function AddHoursWorker({ onAddHours, show, onHide }) {
  const intl = useIntl();
  registerLocale("it", it);

  const [selected, setSelected] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  const saveHour = () => {
    onAddHours(selected.value, startDate, "");
    onHide();
  };

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
    <Modal
      show={show}
      onHide={onHide}
      centered
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
            <Col xs={6} md={4} style={{ marginBottom: "1vh" }}>
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
            <Col xs={6} md={6}>
              <span>{intl.formatMessage({ id: "whenDate" })}</span>
              <br />
              <DatePicker
                selected={startDate}
                locale="it"
                dateFormat="dd/MM/yyyy"
                // @ts-ignore
                onChange={(date) => setStartDate(date)}
              />
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-background" onClick={saveHour}>
          {intl.formatMessage({ id: "saveChangesButton" })}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

AddHoursWorker.propTypes = {
  onAddHours: PropTypes.func.isRequired,
  show: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
};

export default AddHoursWorker;
