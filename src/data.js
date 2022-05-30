import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const databaseConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
}

const connection = new Pool({databaseConfig});

export default connection;