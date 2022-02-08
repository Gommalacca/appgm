import React from "react";
import {
  Form,
  FormGroup,
  FormLabel,
  Button,
  FormControl,
} from "react-bootstrap";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

export const NewEmployeeForm = ({
  onRegister,
  onEmailChange,
  onPasswordChange,
  onFirstNameChange,
  onLastNameChange,
  Email,
  Password,
}) => {
  const intl = useIntl();
  return (
    <Form style={{ margin: "20px", width: "50%" }}>
      <FormGroup>
        <h3> {intl.formatMessage({ id: "createEmployee" })}</h3>
        <FormLabel htmlFor="firstname">
          {intl.formatMessage({ id: "firstname" })}
        </FormLabel>
        <FormControl
          type="text"
          size={"lg"}
          className={"input-accepted"}
          id="firstname"
          onChange={(e) => onFirstNameChange(e.currentTarget.value)}
          placeholder={intl.formatMessage({ id: "firstname" })}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel htmlFor="lastname">
          {intl.formatMessage({ id: "lastname" })}
        </FormLabel>
        <FormControl
          type="text"
          size={"lg"}
          className={"input-accepted"}
          id="lastname"
          onChange={(e) => onLastNameChange(e.currentTarget.value)}
          placeholder={intl.formatMessage({ id: "lastname" })}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel htmlFor="inputEmail">
          {intl.formatMessage({ id: "email" })}
        </FormLabel>
        <FormControl
          size={"lg"}
          className={Email ? "input-accepted" : "blocked-input"}
          id="inputEmail"
          autoComplete="email"
          type="email"
          aria-describedby="emailHelp"
          onChange={(e) => onEmailChange(e.currentTarget.value)}
          placeholder={intl.formatMessage({ id: "email" })}
        />
      </FormGroup>

      <FormGroup>
        <FormLabel htmlFor="inputPassword">
          {intl.formatMessage({ id: "password" })}
        </FormLabel>
        <FormControl
          autoComplete="current-password"
          size={"lg"}
          type="password"
          className={Password ? "input-accepted" : "blocked-input"}
          id="inputPassword"
          onChange={(e) => onPasswordChange(e.currentTarget.value)}
          placeholder={intl.formatMessage({ id: "password" })}
        />
      </FormGroup>

      <div className="text-center">
        <Button className="btn-background" onClick={onRegister}>
          {intl.formatMessage({ id: "saveChangesButton" })}
        </Button>
      </div>
    </Form>
  );
};

NewEmployeeForm.propTypes = {
  onRegister: PropTypes.func.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onFirstNameChange: PropTypes.func.isRequired,
  onLastNameChange: PropTypes.func.isRequired,
  Email: PropTypes.string,
  Password: PropTypes.string,
};
