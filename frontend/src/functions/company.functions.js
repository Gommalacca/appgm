import axios from "axios";
import config from "../config/config";

const getInstance = () => {
  let token = localStorage.getItem("nicktoken");
  if (!token) return null;
  return axios.create({
    headers: { Authorization: "Bearer " + token },
    baseURL: `${config.baseUrl}/company`,
    timeout: 10000,
  });
};

const getMonthlyReport = (month, callback) => {
  const jwtInstance = getInstance();
  if (jwtInstance == null) callback(new Error("JWT instance is null"));
  if (typeof month !== "number" && month > 11)
    callback(new Error("Too many months"));
  const owner = localStorage.getItem("owner");
  const moderator = localStorage.getItem("moderator");
  if (owner || moderator) {
    jwtInstance
      .get(`/monthlyReport/${month}`)
      .then((response) => {
        return callback(null, response.data);
      })
      .catch((error) => {
        return callback(error);
      });
  } else {
    jwtInstance
      .get(`/getMonthlyReportsWorkers/${month}`)
      .then((response) => {
        if (response.data.length == 0) return callback(null, []);
        let arr = [];
        arr.push(response.data);
        callback(null, arr);
      })
      .catch((error) => callback(error));
  }
};

const getRecentReport = (callback) => {
  const jwtInstance = getInstance();
  if (jwtInstance == null) callback(new Error("JWT instance is null"));
  const owner = localStorage.getItem("owner");
  const moderator = localStorage.getItem("moderator");

  if (owner || moderator) {
    jwtInstance
      .get(`/recentReports`)
      .then((response) => {
        return callback(null, response.data);
      })
      .catch((error) => {
        return callback(error);
      });
  } else {
    jwtInstance
      .get(`/recentReportsWorkers`)
      .then((response) => {
        if (response.data.length == 0) return callback(null, []);
        callback(null, response.data);
      })
      .catch((error) => callback(error));
  }
};

export { getMonthlyReport, getRecentReport };
