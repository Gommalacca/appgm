import axios from "axios";
import config from "../config/config";

const getInstanceToken = () => {
  let token = localStorage.getItem("nicktoken");
  if (!token) return null;
  return axios.create({
    headers: { Authorization: "Bearer " + token },
    baseURL: `${config.baseUrl}/reports`,
    timeout: 1000,
  });
};
const saveReport = (report, callback) => {
  if (!report) return callback(new Error("Report is undefined!"));
  if (typeof report !== "object")
    return callback(new Error("Report obj is undefined"));
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("No jwt instance found!"));
  jwtInstance
    .post(`/`, {
      projectId: report.projectId,
      workers: report.workers,
      digitalSignature: report.digitalSignature,
    })
    .then((response) => callback(null, response.data))
    .catch((error) => callback(error));
};

const getAllDailyReports = (callback) => {
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("No jwt instance found!"));
  jwtInstance
    .get("/daily")
    .then((response) => callback(null, response.data))
    .catch((error) => callback(error));
};

const getReport = (reportId, callback) => {
  if (!reportId) return callback(new Error("Report is undefined!"));
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("No jwt instance found!"));
  jwtInstance
    .get(`/${reportId}`)
    .then((response) => callback(null, response.data))
    .catch((error) => callback(error));
};

const deleteDailyReport = (reportId, callback) => {
  if (!reportId) return callback(new Error("Report is undefined!"));
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("No jwt instance found!"));
  jwtInstance
    .delete(`/${reportId}`)
    .then((response) => callback(null, response.data))
    .catch((error) => callback(error));
};

const saveDigitalSignature = (digitalSignature, reportId, callback) => {
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) return;
  jwtInstance
    .post(`/digitalSignature`, {
      reportId: reportId,
      digitalSignature: digitalSignature,
    })
    .then((response) => {
      return callback(null, response.data);
    })
    .catch((error) => {
      return callback(error);
    });
};

export {
  saveReport,
  getAllDailyReports,
  getReport,
  deleteDailyReport,
  saveDigitalSignature,
};
