import { Pool } from 'pg';
const env = process.env.NODE_ENV || 'development';
const config = require("./config")[env];

export const pool = new Pool({
    max: 1000,
    connectionString: `${config.dialect}://${config.username}:${config.password}@${config.host}:5432/${config.database}`,
    idleTimeoutMillis: 30000
});
