import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useIntl } from "react-intl";
import { Link, useHistory, useLocation } from "react-router-dom";

import { Container, Row, Col, Button } from "react-bootstrap";
import { BiCommentAdd } from "react-icons/bi";
import { FiTrash2 } from "react-icons/fi";
import { Divider, ListItem, ListItemText, Typography } from "@material-ui/core";

import parse from "html-react-parser";

import AddNoteModal from "components/notes/modals/AddNote";
import ConfirmActionModal from "../../components/modals/ConfirmAction";

import {
  createProjectNote,
  deleteProjectNote,
  getProjectNotes,
} from "functions/projects.functions";

export default function LookUpNotes() {
  const location = useLocation();
  const history = useHistory();
  const intl = useIntl();
  const alert = useAlert();

  const [project, setProject] = useState({});
  const [ModalShow, setModalShow] = useState(false);
  const [notes, setNotes] = useState([]);

  // When you delete a note at first will be stored here and getted later.
  const [noteToDelete, setNoteToDelete] = useState({});
  const [ConfirmModalShow, SetConfirmModalShow] = useState(false);

  const onSaveNotes = (description) => {
    const projectID = project.id;
    createProjectNote(projectID, description, (error, result) => {
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
        let obj = {
          ...result.data.notes,
          user: result.data.user,
        };
        let newNotes = [...notes];
        newNotes.push(obj);
        setNotes(newNotes);
        SetConfirmModalShow(false);
      }
    });
  };

  useEffect(() => {
    if (location.state !== undefined) {
      const project = location.state.project;
      if (!project) history.push("/");
      getProjectNotes(project.id, (error, result) => {
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
          setProject(project);
          setNotes(result);
        }
      });
    } else {
      history.push("/");
    }
  }, [location]);

  const deleteNote = (note) => {
    setNoteToDelete(note);
    SetConfirmModalShow(true);
  };

  const onDeleteNote = () => {
    deleteProjectNote(noteToDelete.id, (error, result) => {
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
        const newComments = notes.filter((item) => item.id !== noteToDelete.id);
        if (newComments.length === notes.length) return;
        setNotes(newComments);
        setNoteToDelete({});
        SetConfirmModalShow(false);
      }
    });
  };

  return (
    <Container
      fluid
      style={{ height: "100%", marginTop: "2em", textTransform: "uppercase" }}
    >
      <Row>
        <Col>
          <span style={{ fontSize: "12px" }}>
            <Link
              style={{ textDecoration: "none", color: "black" }}
              to="/allProjects"
            >
              {intl.formatMessage({ id: "allProjects" })}
            </Link>{" "}
            /{" "}
            <Link
              style={{ textDecoration: "none", color: "black" }}
              to={{
                pathname: "/lookUpProject",
                state: {
                  project: project,
                },
              }}
            >
              {project.name}
            </Link>
          </span>
          <h2>
            {intl.formatMessage({ id: "note" })} {project.name}{" "}
            <BiCommentAdd
              onClick={() => setModalShow(true)}
              style={{ cursor: "pointer" }}
              size={28}
            ></BiCommentAdd>{" "}
          </h2>
        </Col>
      </Row>
      <Divider />
      <Row>
        {notes.map((item, index) => {
          return (
            <Container fluid key={index}>
              <ListItem>
                <ListItemText
                  style={{ color: "black" }}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component={"div"}
                        color="textPrimary"
                        style={{
                          display: "inline",
                          fontSize: "12px",
                        }}
                      >
                        <strong>
                          {item.user.firstname} {item.user.lastname}
                        </strong>{" "}
                        {new Date(item.createdAt).toLocaleString()}
                        <FiTrash2
                          onClick={() => deleteNote(item)}
                          size={"18px"}
                          style={{ marginLeft: "1vh", cursor: "pointer" }}
                        />
                        <Divider
                          style={{ marginTop: "1vh", marginBottom: "1vh" }}
                        />
                        <div>{parse(item.note)}</div>
                      </Typography>
                      {item.link && (
                        <Button
                          className="btn-background"
                          style={{ marginTop: "2vh" }}
                          size="sm"
                        >
                          {intl.formatMessage({ id: "attachmentButton" })}
                        </Button>
                      )}
                    </React.Fragment>
                  }
                />
              </ListItem>
            </Container>
          );
        })}
      </Row>
      <ConfirmActionModal
        show={ConfirmModalShow}
        onHide={SetConfirmModalShow}
        onDelete={onDeleteNote}
        modalTitle={intl.formatMessage({ id: "deleteNoteTitleModal" })}
        modalBody={intl.formatMessage({ id: "deleteNoteBodyModal" })}
        modalButtonClose={intl.formatMessage({ id: "closeButton" })}
        modalButtonSave={intl.formatMessage({ id: "saveChangesButton" })}
      />
      <AddNoteModal
        show={ModalShow}
        onHide={setModalShow}
        onSaveNotes={onSaveNotes}
      />
    </Container>
  );
}
