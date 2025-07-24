const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

/************************************
 * @DESC - MIDDLEWARE INIITILIZATION
 * @PACKAGE - EXPRESS
 ***********************************/
const app = express();
app.use(cors());

/************************************
 * @DESC    - PARSER JSON BODY
 * @PACKAGE - body-parser
 ***********************************/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/************************************
 * @DESC    - COOKIE PARSER & SESSION
 * @PACKAGE - cookie-parser & express-session
 ***********************************/
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: false,
    name: "sessionId",
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60000, // 1 minute for example
      path: "/",
      domain: "example.com" // replace with your domain
    }
  })
);

// SET STATIC FOLDER FOR PRODUCTTION BUILD

app.use(express.static("build"));
app.use("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

/************************************
 * @DESC    - PORT INITILIZATION
 * @PACKAGE - NODEJS
 ***********************************/
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Started Server on Port`, PORT));
