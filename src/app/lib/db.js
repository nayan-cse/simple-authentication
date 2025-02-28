import mysql from "mysql2/promise";

export const db = mysql.createPool({
    host: "localhost", // Change if needed
    user: "root", // Your MySQL username
    password: "", // Your MySQL password
    database: "next_auth",
});
