import axios from "axios";
import config from "../config/config";

const getInstanceToken = () => {
  let token = localStorage.getItem("nicktoken");
  if (!token) return null;
  return axios.create({
    headers: { Authorization: "Bearer " + token },
    baseURL: `${config.baseUrl}/project`,
    timeout: 10000,
  });
};

const getAllProjects = (callback) => {
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("No jwt instance found!"));

  const owner = localStorage.getItem("owner");
  const moderator = localStorage.getItem("moderator");
  if (owner || moderator) {
    jwtInstance
      .get("/")
      .then((response) => callback(null, response.data))
      .catch((error) => callback(error));
  } else {
    jwtInstance
      .get("/workerProject")
      .then((response) => callback(null, response.data))
      .catch((error) => callback(error));
  }
};

export const getAllDailyProject = (date, callback) => {
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("No jwt instance found!"));

  const owner = localStorage.getItem("owner");
  const moderator = localStorage.getItem("moderator");
  if (owner || moderator) {
    jwtInstance
      .get(`/daily/${date}`)
      .then((response) => callback(null, response.data))
      .catch((error) => callback(error));
  } else {
    jwtInstance
      .get(`/workerProject/${date}`)
      .then((response) => callback(null, response.data))
      .catch((error) => callback(error));
  }
};

const getWorkersProject = (projectID, callback) => {
  const jwtInstance = getInstanceToken();
  if (typeof projectID !== "number") callback(new Error("Must be a number!"));
  if (jwtInstance == null) callback(new Error("No jwt instance found!"));
  jwtInstance
    .get(`/workers/${projectID}`)
    .then((response) => callback(null, response.data))
    .catch((error) => callback(error));
};

const createProject = ({ name, startAt, locality }, callback) => {
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("JWT instance is null"));

  jwtInstance
    .post(`/`, {
      name: name,
      startAt: startAt,
      locality: locality,
    })
    .then((response) => {
      return callback(null, response.data);
    })
    .catch((error) => {
      return callback(error);
    });
};

const deleteProject = (projectId, callback) => {
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("JWT instance is null"));
  if (typeof projectId !== "number") callback(new Error("Must be a number!"));
  jwtInstance
    .delete(`/${projectId}`)
    .then((response) => {
      return callback(null, response.data);
    })
    .catch((error) => {
      return callback(error);
    });
};

const addWorkersToProject = (projectID, employeesId, callback) => {
  if (typeof projectID !== "number") return callback(new Error("Bad data"));
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("No jwt instance found!"));
  var employees = [];
  employeesId.forEach((element) => {
    employees.push(element.id);
  });
  jwtInstance
    .post("/worker", {
      projectId: projectID,
      employeesId: employees,
    })
    .then((response) => callback(null, response.data))
    .catch((error) => callback(error));
};

const deleteWorkerFromProject = (projectID, workerID, callback) => {
  if (typeof projectID !== "number" || typeof workerID !== "string")
    return callback(new Error("Bad data"));
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("No jwt instance found!"));
  const deleteObj = {
    projectId: projectID,
    employeeId: workerID,
  };
  jwtInstance
    .delete("/worker", {
      data: deleteObj,
    })
    .then((response) => callback(null, response.data))
    .catch((error) => callback(error));
};

const getProjectNotes = (projectID, callback) => {
  if (typeof projectID !== "number") return callback(new Error("Bad data"));
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("No jwt instance found!"));
  jwtInstance
    .get(`/notes/${projectID}`)
    .then((response) => callback(null, response.data))
    .catch((error) => callback(error));
};

const getProjectDailyNotes = (projectID, date, callback) => {
  if (typeof projectID !== "number") return callback(new Error("Bad data"));
  try {
    var _date = new Date(date);
    if (!_date) {
      return;
    }
  } catch (e) {
    return;
  }
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("No jwt instance found!"));
  jwtInstance
    .get(`/notes/${projectID}/${date}`)
    .then((response) => callback(null, response.data))
    .catch((error) => callback(error));
};

const createProjectNote = (projectID, description, callback) => {
  if (typeof projectID !== "number") return callback(new Error("Bad data"));
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("No jwt instance found!"));
  jwtInstance
    .post("/note", {
      projectID: projectID,
      description: description,
    })
    .then((response) => callback(null, response))
    .catch((error) => callback(error));
};

const deleteProjectNote = (noteId, callback) => {
  if (typeof noteId !== "number") return callback(new Error("Bad data"));
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("No jwt instance found!"));
  jwtInstance
    .delete(`/note/${noteId}`)
    .then((response) => callback(null, response.data))
    .catch((error) => callback(error));
};

const addHoursToProject = (projectId, workerId, hours, date, callback) => {
  if (typeof projectId !== "number")
    callback(new Error("Project id must be a number!"));
  if (typeof hours !== "number") callback(new Error("Hours must be a number!"));
  if (typeof workerId !== "string")
    callback(new Error("Worker id must be a string!"));

  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("No jwt instance found!"));
  const owner = localStorage.getItem("owner");
  const moderator = localStorage.getItem("moderator");
  if (owner || moderator) {
    jwtInstance
      .post("/hours/", {
        projectId: projectId,
        workerId: workerId,
        hours: hours,
        date: date,
      })
      .then((response) => callback(null, response.data))
      .catch((error) => callback(error));
  } else {
    jwtInstance
      .post("/workerHours/", {
        projectId: projectId,
        hours: hours,
        date: date,
      })
      .then((response) => callback(null, response.data))
      .catch((error) => callback(error));
  }
};

const addFakeHoursToDaily = (projectId, workerId, hours, date, callback) => {
  if (typeof projectId !== "number")
    callback(new Error("Project id must be a number!"));
  if (!projectId || !hours || !workerId) callback(new Error("Undefined!"));
  if (typeof hours !== "number") callback(new Error("Hours must be a number!"));
  if (typeof workerId !== "string")
    callback(new Error("Worker id must be a string!"));

  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("No jwt instance found!"));

  jwtInstance
    .post("/fakeHours/", {
      projectId: projectId,
      workerId: workerId,
      hours: hours,
      date: date,
    })
    .then((response) => callback(null, response.data))
    .catch((error) => callback(error));
};

const getDailyProjectWorkers = (projectId, callback) => {
  if (typeof projectId !== "number")
    callback(new Error("Project id must be a number!"));
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("No jwt instance found!"));
  jwtInstance
    .get(`/dailyWorkers/${projectId}`)
    .then((response) => callback(null, response.data))
    .catch((error) => callback(error));
};

const deleteHours = (hoursIds, callback) => {
  if (hoursIds.length == 0) callback(new Error("hours ids is 0!"));
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("No jwt instance found!"));
  jwtInstance
    .delete(`/hours/`, {
      data: {
        hoursIds: hoursIds,
      },
    })
    .then((response) => callback(null, response.data))
    .catch((error) => callback(error));
};

const deleteWorkerHour = (hourId, callback) => {
  if (hourId == 0) callback(new Error("hours ids is 0!"));
  const jwtInstance = getInstanceToken();
  if (jwtInstance == null) callback(new Error("No jwt instance found!"));
  jwtInstance
    .delete(`/workerHours/`, {
      data: {
        hourId: hourId,
      },
    })
    .then((response) => callback(null, response.data))
    .catch((error) => callback(error));
};

export {
  getWorkersProject,
  getAllProjects,
  createProject,
  deleteProject,
  addWorkersToProject,
  deleteWorkerFromProject,
  getProjectNotes,
  createProjectNote,
  deleteProjectNote,
  addHoursToProject,
  getDailyProjectWorkers,
  deleteHours,
  deleteWorkerHour,
  addFakeHoursToDaily,
  getProjectDailyNotes,
};
