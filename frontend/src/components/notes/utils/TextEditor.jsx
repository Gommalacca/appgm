import React from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import PropTypes from "prop-types";

function TextEditor({ onDescriptionChange, editorState }) {
  return (
    <Editor
      toolbarHidden
      editorState={editorState}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      onEditorStateChange={onDescriptionChange}
    />
  );
}

TextEditor.propTypes = {
  onDescriptionChange: PropTypes.func.isRequired,
  editorState: PropTypes.object.isRequired,
};

export default TextEditor;
