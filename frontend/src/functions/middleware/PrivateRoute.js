import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import { logoutUser } from "../../redux/ducks/auth";
import PropTypes from "prop-types";
const PrivateRoute = ({ component: Component, ...rest }) => {
  // @ts-ignore
  var auth = useSelector((state) => state.Auth);
  var dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  useEffect(() => {
    let token = localStorage.getItem("nicktoken");

    if (token) {
      // @ts-ignore
      let tokenExpiration = jwt_decode(token).exp;

      let dateNow = new Date();
      if (tokenExpiration < dateNow.getTime() / 1000) {
        setIsAuthenticated(false);
        dispatch(logoutUser());
      } else {
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
    // eslint-disable-next-line
  }, [auth]);

  if (isAuthenticated === null) {
    return <></>;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated ? <Redirect to="/login" /> : <Component {...props} />
      }
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default PrivateRoute;
