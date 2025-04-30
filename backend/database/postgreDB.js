import{Client} from "pg";

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: "5432",
    password: "12345",
    database: "biyaheroDB"
});

client.connect().then(() => console.log("connected to the database"));

export default client;