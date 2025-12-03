const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser");
const mssql = require("mssql")
const { ipcMain } = require("electron")
const path = require("path")
const stockRoutes = require("./routes/stockRoutes.js")

function logToUI(msg) {
    if (process.send) {
        process.send({ type: "server-log", message: msg });
    } else {
        console.log("UI log:", msg);
    }
}
module.exports = { logToUI }
const nodeLog = console.log;
console.log = function (...args) {
    nodeLog(...args);
    logToUI(args.join(" "));
};


const app = express()
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
app.use(express.raw({ limit: '50mb', type: 'application/zip' }));

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

const connect = async () => {
    try {
        await mssql.connect(config);
        logToUI("Database connected");
    } catch (err) {
        console.error('Error connecting to the database', err);
    }
}
connect()

app.use("/", stockRoutes)

app.use((req, res) => {
    res.status(404).json({ message: "Sayfa bulunamadı" })
})

const port = 6161
app.listen(port, () => {
    logToUI(`Roftware Yazılım ve Bilişim Teknolojileri`)
})