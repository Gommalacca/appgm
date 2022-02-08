import React, { useState } from "react";
import { useAlert } from "react-alert";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";

import { Button, Container, Modal } from "react-bootstrap";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import AddNoteForm from "../forms/AddNote";
function AddNoteModal({ onSaveNotes, show, onHide }) {
  const [Editor, setEditorState] = useState(EditorState.createEmpty());
  const [Desc, setDesc] = useState("");
  const alert = useAlert();
  const intl = useIntl();
  const onDescriptionChange = (description) => {
    setEditorState(description);
    try {
      setDesc(() => draftToHtml(convertToRaw(description.getCurrentContent())));
    } catch (error) {
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
    }
  };

  const saveComment = () => {
    onSaveNotes(Desc);
    setEditorState(EditorState.createEmpty());
    onHide();
  };
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {intl.formatMessage({ id: "addNoteToProject" })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="d-flex justify-content-center">
          <AddNoteForm
            onDescriptionChange={onDescriptionChange}
            editorState={Editor}
          />
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-background" onClick={saveComment}>
          {intl.formatMessage({ id: "saveChangesButton" })}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

AddNoteModal.propTypes = {
  onSaveNotes: PropTypes.func.isRequired,
  show: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
};

export default AddNoteModal;
