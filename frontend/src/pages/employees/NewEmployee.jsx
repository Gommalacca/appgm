import React, { useState, useCallback } from "react";
import { userRegister } from "functions/auth.functions";
import { addEmployeeToCompany } from "functions/employees.functions";
import { Container } from "react-bootstrap";
import { NewEmployeeForm } from "./form/NewEmployeeForm";
import { useHistory } from "react-router-dom";
import { useIntl } from "react-intl";
import { useAlert } from "react-alert";

export default function NewEmployee() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const history = useHistory();
  const intl = useIntl();
  const alert = useAlert();

  const handleOnClick = useCallback(
    () => history.push("/allEmployees"),
    [history]
  );

  const onFirstNameChange = (_firstname) => {
    if (_firstname === "") {
      setFirstname("");
      return;
    }
    setFirstname(_firstname);
  };
  const onLastNameChange = (_lastname) => {
    if (_lastname === "") {
      setLastname("");
      return;
    }
    setLastname(_lastname);
  };

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

  const createUser = () => {
    // First create user then add as employee to company
    var user = {
      firstname: firstname,
      lastname: lastname,
      email: Email,
      password: Password,
    };
    userRegister(user, (error, result) => {
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
        addEmployeeToCompany(result.id, (err, response) => {
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
          if (response) {
            handleOnClick();
          }
        });
      }
    });
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center uppercase"
      style={{ height: "100%" }}
    >
      <NewEmployeeForm
        onRegister={createUser}
        onEmailChange={validateEmail}
        onPasswordChange={validatePassword}
        onLastNameChange={onLastNameChange}
        onFirstNameChange={onFirstNameChange}
        Email={Email}
        Password={Password}
      />
    </Container>
  );
}
