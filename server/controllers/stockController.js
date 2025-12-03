const { ConnectionPool } = require("mssql")

const config = {
    user: "username",
    password: "password",
    server: `server_name`,
    database: "database_name",
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

/* Endpoint Functions */