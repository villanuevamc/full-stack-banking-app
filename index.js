var express = require("express");
var app = express();
var cors = require("cors");

// used to serve static files from public directory
app.use(express.static("public"));
app.use(cors());

var admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://bad-bank-f6332-default-rtdb.firebaseio.com",
});

const getAuthToken = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    req.authToken = req.headers.authorization.split(" ")[1];
  } else {
    req.authToken = null;
  }
  next();
};

const checkIfAuthenticated = (req, res, next) => {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      const userInfo = await admin.auth().verifyIdToken(authToken);
      req.authId = userInfo.uid;
      return next();
    } catch (e) {
      return res
        .status(401)
        .send({ error: "You are not authorized to make this request " });
    }
  });
};

// create user account
app.get("/account/create/:name/:email/:password", async function (req, res) {
  const { name, email, password } = req;
  const user = await admin.auth().createUser({
    name,
    email,
    password,
    balance: 0,
  });
  return res.send(user);
});

// all accounts
app.get("/account/all", checkIfAuthenticated, function (_, res) {
  admin
    .getAuth()
    .getUsers([])
    .then((getUsersResult) => {
      console.log("Successfully fetched user data:");
      getUsersResult.users.forEach((userRecord) => {
        console.log(userRecord);
      });

      /*
    console.log('Unable to find users corresponding to these identifiers:');
    getUsersResult.notFound.forEach((userIdentifier) => {
      console.log(userIdentifier);
    });
    */
    })
    .catch((error) => {
      console.log("Error fetching user data:", error);
    });
});

var port = 3000;
app.listen(port);
console.log("Running on port: " + port);
