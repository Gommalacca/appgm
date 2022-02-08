import axios from "axios";
import config from "../config/config";

const getInstanceToken = () => {
  let token = localStorage.getItem("nicktoken");
  if (!token) return null;
  return axios.create({
    headers: { Authorization: "Bearer " + token },
    baseURL: `${config.baseUrl}/company`,
    timeout: 10000,
  });
};

const getAllEmployees = (callback) => {
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("No jwt instance found!"));
  jwtInstance
    .get("/employees")
    .then((response) => callback(null, response.data))
    .catch((error) => callback(error));
};

const addEmployeeToCompany = (employeeId, callback) => {
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("JWT instance is null"));

  jwtInstance
    .post(`/add-employee`, {
      employeeId: employeeId,
    })
    .then((response) => {
      return callback(null, response.data);
    })
    .catch((error) => {
      return callback(error);
    });
};

const deleteEmployeeFromCompany = (employeeId, callback) => {
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("JWT instance is null"));

  jwtInstance
    .post(`/delete-employee`, {
      employeeId: employeeId,
    })
    .then((response) => {
      return callback(null, response.data);
    })
    .catch((error) => {
      return callback(error);
    });
};

const addModeratorToCompany = (employeeId, callback) => {
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("JWT instance is null"));

  jwtInstance
    .post(`/add-moderator`, {
      userId: employeeId,
    })
    .then((response) => {
      return callback(null, response.data);
    })
    .catch((error) => {
      return callback(error);
    });
};

const setAdvancedUserToCompany = (employeeId, callback) => {
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("JWT instance is null"));

  jwtInstance
    .post(`/advancedUser`, {
      userId: employeeId,
    })
    .then((response) => {
      return callback(null, response.data);
    })
    .catch((error) => {
      return callback(error);
    });
};

const deleteModaratorFromCompany = (employeeId, callback) => {
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("JWT instance is null"));

  jwtInstance
    .post(`/delete-moderator`, {
      userId: employeeId,
    })
    .then((response) => {
      return callback(null, response.data);
    })
    .catch((error) => {
      return callback(error);
    });
};

const getEmployeeHours = (employeeID, callback) => {
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("JWT instance is null"));
  jwtInstance
    .get(`/hours/${employeeID}`)
    .then((response) => callback(null, response.data))
    .catch((error) => callback(error));
};

export {
  getAllEmployees,
  addEmployeeToCompany,
  deleteEmployeeFromCompany,
  addModeratorToCompany,
  deleteModaratorFromCompany,
  setAdvancedUserToCompany,
  getEmployeeHours,
};
