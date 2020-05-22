import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import dotenv from "dotenv";
import apiRouter from "./router";
import mysql from "mysql";

dotenv.config({ silent: true });

// const config = {
//   database: {
//     host: "us-cdbr-east-06.cleardb.net",
//     user: "b51ff3c341730d",
//     password: "a58a7596",
//     database: "heroku_341a27901840f2f",
//   },
// };

// initialize
const app = express();

//Database connection
global.connection = mysql.createConnection(process.env.DB_URL);
global.connection.connect();

/*
function handleDisconnect() {
  console.log("reconnecting to db")
  global.connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  }); // Recreate the connection, since
                                                  // the old one cannot be reused.

  global.connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  global.connection.on('error', function(err) {
    console.log('db error', err.code);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      console.log("calling handle db")
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
       throw err;                                 // server variable configures this)
    }});
}

handleDisconnect();
*/
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
