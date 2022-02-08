import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { loginUser } from "redux/ducks/auth";
import { Redirect } from "react-router";
import { userLogin } from "../functions/auth.functions";
import { useAlert } from "react-alert";

export default function Login() {
  const [redirect, setRedirect] = useState(false);
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const dispatch = useDispatch();

  const intl = useIntl();
  const alert = useAlert();

  const validateEmail = (_email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(_email)) {
      setEmail(_email);
    } else {
      setEmail("");
    }
  };
  const validatePassword = (_password) => {
    const re = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );
    if (re.test(_password)) {
      setPassword(_password);
    } else {
      setPassword("");
    }
  };

  const login = () => {
    if (!Email) {
      return alert.info(intl.formatMessage({ id: "emailRules" }));
    }

    if (!Password) {
      return alert.info(intl.formatMessage({ id: "passwordRules" }));
    }
    userLogin(Email, Password, (err, result) => {
      if (err) {
        if (err.code === "ECONNABORTED") {
          return alert.error(
            intl.formatMessage({ id: "lostConnectionToServer" })
          );
        }
        if (err.response === undefined) {
          return alert.error(
            intl.formatMessage({ id: "lostConnectionToServer" })
          );
        }
        if (err.response.status == 400) {
          return alert.show(intl.formatMessage({ id: "badEmailOrPassword" }));
        }
        if (err.response.status == 500) {
          return alert.error(intl.formatMessage({ id: "internalServerError" }));
        }
      }
      if (result) {
        if (result.data.company) {
          localStorage.setItem("companyName", result.data.company.name);
          if (result.data.company.ownerId === result.data.user.id) {
            localStorage.setItem("owner", "true");
          }
          if (result.data.company.moderatorId === result.data.user.id) {
            localStorage.setItem("moderator", "true");
          }
        }
        localStorage.setItem("nicktoken", result.data.token);
        localStorage.setItem("firstname", result.data.user.firstname);
        localStorage.setItem("lastname", result.data.user.lastname);
        localStorage.setItem("userID", result.data.user.id);
        localStorage.setItem("userTag", result.data.user.tag);
        localStorage.setItem("role", result.data.user.role);
        setRedirect(true);
        dispatch(loginUser());
      }
    });
  };

  if (redirect) {
    return (
      <Redirect
        to={{
          pathname: "/",
        }}
      />
    );
  }

  return (
    <Container
      fluid
      style={{ height: "100%" }}
      className="d-flex justify-content-center align-items-center"
    >
      <Row>
        <Col>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                {intl.formatMessage({ id: "enterEmailLabel" })}
              </Form.Label>
              <Form.Control
                autoComplete="email"
                type="email"
                placeholder={intl.formatMessage({
                  id: "enterEmailPlaceHolder",
                })}
                onChange={(e) => validateEmail(e.currentTarget.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>
                {intl.formatMessage({ id: "enterPasswordLabel" })}
              </Form.Label>
              <Form.Control
                type="password"
                autoComplete="current-password"
                placeholder={intl.formatMessage({
                  id: "enterPasswordPlaceHolder",
                })}
                onChange={(e) => validatePassword(e.currentTarget.value)}
              />
            </Form.Group>
            <Button className="btn-background" onClick={login}>
              {intl.formatMessage({ id: "loginButton" })}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
