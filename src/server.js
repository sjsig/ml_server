import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import dotenv from "dotenv";
import apiRouter from "./router";
import mysql from "mysql";

dotenv.config({ silent: true });

const config = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      reconnect: true,
   }

console.log(config)

// initialize
const app = express();

//Database connection
global.connection = mysql.createConnection(config);
global.connection.connect();


setInterval(keepAlive, 59000);
function keepAlive() {
    global.connection.query('SELECT 1');
    console.log("Fired Keep-Alive");
    return;
}

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan("dev"));

// enable only if you want templating
app.set("view engine", "ejs");

// enable only if you want static assets from folder static
app.use(express.static("static"));

// this just allows us to render ejs from the ../app/views directory
app.set("views", path.join(__dirname, "../src/views"));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", apiRouter);

// default index route
app.get("/", (req, res) => {
  res.send("help my subconcious is trapped in this computer beep boop");
});

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port, function () {
  console.log(`listening on: ${port}`);
});
