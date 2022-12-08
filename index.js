var express = require("express");
var app = express();
var cors = require("cors");

// used to serve static files from public directory
app.use(express.static("public"));
app.use(cors());

var admin = require("firebase-admin");
const { query } = require("express");
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://bad-bank-f6332-default-rtdb.firebaseio.com",
});

const db = admin.firestore();

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
app.get("/account/create/:name/:email/:password", function (req, res) {
  const { name, email, password } = req.params;
  admin
    .auth()
    .createUser({
      displayName: name,
      email: email,
      password: password,
    })
    .then((userRecord) => {
      db.collection("users")
        .add({
          name: name,
          email: email,
          balance: 0,
        })
        .then((docRef) => {
          res
            .status(200)
            .send(
              `Successfully created new user: ${userRecord} and added user to db: ${docRef}`
            );
        })
        .catch((error) => {
          admin
            .auth()
            .deleteUser(userRecord.uid)
            .then(() => {
              throw new Error(
                `Successfully deleted user after failed db store: ${error}`
              );
            })
            .catch((err) => {
              throw new Error(
                `Couldn't delete user ${err}\nafter failed db store ${error}`
              );
            });
        });
    })
    .catch((error) => {
      res.status(500).send(`Error creating new user: ${error}`);
    });
});

// get single user
app.get("/account/user/:email", checkIfAuthenticated, function (req, res) {
  const { email } = req.params;
  db.collection("users")
    .where("email", "==", email)
    .get()
    .then((snapshot) => {
      var user;
      snapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        user = { data: doc.data(), id: doc.id };
      });
      res.status(200).send(user);
    })
    .catch((error) => {
      res.status(500).send(`Couldn't find user in db: ${error}`);
    });
});

// update user balance
app.get(
  "/account/user/:uid/:balance",
  checkIfAuthenticated,
  function (req, res) {
    const { uid, balance } = req.params;
    db.collection("users")
      .doc(uid)
      .update({ balance: balance })
      .then(() => {
        res.status(200).send("User's balance updated");
      })
      .catch((error) => {
        res.status(500).send(`Couldn't update user's info: ${error}`);
      });
  }
);

// all accounts
app.get("/account/all", checkIfAuthenticated, function (_, res) {
  db.collection("users")
    .get()
    .then((snapshot) => {
      var accountData = [];
      snapshot.forEach((doc) => {
        accountData.push(doc.data());
      });
      res.status(200).send(accountData);
    })
    .catch((error) => {
      res.status(500).send(`Couldn't pull account data from db: ${error}`);
    });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Running on port: " + port);
