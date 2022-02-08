import dotenv from "dotenv";

dotenv.config();

const SERVER_BASE_URL = process.env.REACT_APP_BASE_URL || "/api";
const config = {
  baseUrl: SERVER_BASE_URL,
};
export default config;
