import React from "react";
import { Button, Modal } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

function CreateDigitalSignature({
  show,
  onHide,
  setRef,
  trimSignature,
  resetRef,
}) {
  const intl = useIntl();
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Aggiungi firma digitale</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-align-center text-center justify-content-center">
        <SignatureCanvas
          penColor="black"
          canvasProps={{ width: 800, height: 100, className: "sigCanvas" }}
          ref={(ref) => setRef(ref)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-background" onClick={trimSignature}>
          {intl.formatMessage({ id: "saveChangesButton" })}
        </Button>
        <Button variant="danger" onClick={resetRef}>
          {intl.formatMessage({ id: "resetButton" })}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

CreateDigitalSignature.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
  setRef: PropTypes.func.isRequired,
  trimSignature: PropTypes.func.isRequired,
  resetRef: PropTypes.func.isRequired,
};

export default CreateDigitalSignature;
