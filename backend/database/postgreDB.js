import {Pool} from "pg";

const client = new Pool({
  connectionString: process.env.DATABASE_URL
});

console.log("connected to database")

export default client;