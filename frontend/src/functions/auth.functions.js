import axios from "axios";
import config from "../config/config";

const getInstanceToken = () => {
  let token = localStorage.getItem("nicktoken");
  if (!token) return null;
  return axios.create({
    headers: { Authorization: "Bearer " + token },
    baseURL: `${config.baseUrl}/auth`,
    timeout: 1000,
  });
};

const getInstance = () => {
  return axios.create({
    baseURL: `${config.baseUrl}/auth`,
    timeout: 10000,
  });
};

const userLogin = (email, password, callback) => {
  const jwtInstance = getInstance();
  if (jwtInstance == null) return;
  jwtInstance
    .post("/login", {
      email: email,
      password: password,
    })
    .then((response) => callback(null, response))
    .catch((error) => callback(error));
};

const userRegister = ({ firstname, lastname, email, password }, callback) => {
  const jwtInstance = getInstance();
  if (jwtInstance == null) return;
  jwtInstance
    .post("/register", {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
    })
    .then((result) => callback(null, result.data))
    .catch((error) => callback(error));
};

const userChangePassword = (oldPassword, newPassword, callback) => {
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) return;
  jwtInstance
    .post(`/password/`, {
      userID: localStorage.getItem("userID"),
      oldPassword: oldPassword,
      newPassword: newPassword,
    })
    .then((response) => {
      return callback(null, response.data);
    })
    .catch((error) => {
      return callback(error);
    });
};
export { userLogin, userRegister, userChangePassword };
