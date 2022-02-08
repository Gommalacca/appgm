import React from "react";
import { Button, Modal } from "react-bootstrap";
import PropTypes from "prop-types";

function ConfirmActionModal({
  modalTitle,
  modalBody,
  modalButtonSave,
  modalButtonClose,
  show,
  onHide,
  onDelete,
}) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalBody}</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => onHide()}>
          {modalButtonClose}
        </Button>
        <Button className="btn-background" onClick={onDelete}>
          {modalButtonSave}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ConfirmActionModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  modalTitle: PropTypes.string.isRequired,
  modalBody: PropTypes.string.isRequired,
  modalButtonSave: PropTypes.string.isRequired,
  modalButtonClose: PropTypes.string.isRequired,
};

export default ConfirmActionModal;
