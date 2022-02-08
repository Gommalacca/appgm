import TextEditor from "../utils/TextEditor";
import React from "react";
import { Form, FormGroup, FormLabel } from "react-bootstrap";
import PropTypes from "prop-types";

function AddNoteForm({ onDescriptionChange, editorState }) {
  return (
    <Form style={{ margin: "20px", width: "100%" }}>
      <FormGroup>
        <FormLabel htmlFor="projectNotes">Descrizione nota: </FormLabel>
        <TextEditor
          onDescriptionChange={onDescriptionChange}
          editorState={editorState}
        />
      </FormGroup>
    </Form>
  );
}

AddNoteForm.propTypes = {
  onDescriptionChange: PropTypes.func.isRequired,
  editorState: PropTypes.object.isRequired,
};

export default AddNoteForm;
