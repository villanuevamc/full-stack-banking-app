var express = require("express");
var app = express();
var cors = require("cors");

// used to serve static files from public directory
app.use(express.static("public"));
app.use(cors());

var admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "bad-bank-f6332",
    clientEmail:
      "firebase-adminsdk-cptw4@bad-bank-f6332.iam.gserviceaccount.com",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDCKVEk/fEXdWB6\nA6bY/3nWdzAJ45uNsTIngMXgh9aWf0FVTWD7yovVK2+VcfDYqtJ2tbhUD5s7iWj4\ngqDcKFTb0kmN0I1WE0iNl+f/B1qg5Nd9xRTz/O/JKeex8BzLWWMCjRmJiu8BVN5k\nvlk1Vw39oCwVu2g+gIPO+ri4xDuEnr214zZn8wqdAR6GA3ktIOfUK3Zr23Jf05FZ\nf/gVfVQBVNeFKu8Lttex8Q0yrlEFES5J1hErWzrdbjkKDcBA0r1pE1zct7H5dI6V\niMKy+/IhsBoH826kE9hJmJ5oh06kstGRDZv2NS/P+oFKDCQtcjzLCv2CqrGEqCFB\nqhVTcFg5AgMBAAECggEAKvKZtN2JFT/M8eBZ6TkFmcdudFmI4Hw4FF3bJ1HUySBn\n8rb1g2ynpqT/fyafeEW83S5QEiQLmc1Iz2ORsnEnaCJpS7m8cbQ9Qbi+w/478Uf9\nVKAiBOBHqA8hZY4vyFlC2d8dLXvyZzB/Kvih4fcaLKZf6gS0x9KElWWHM7OQWMKj\nbYR4FlBQuglvUZzoquek/LA5O4bLgxAmWM//36fEMBQVkBYYqZB5iudtmKFjwgoU\nP1NWmQENYIq/fG7NNurN+w4iw1GsTQsXzZkRF+XzpzOmmYB6kDmZPovs11+iCt5U\nxMRCOWzlYeyj+gTQBRAn2r81IjHbSr+ZQyy4m6awKQKBgQDtt3iayAMU4y8FMAuE\n6ZdpPmoqtcZI70SKzo1Szrp9cZo2REZRo2fFbqMCdj8gOv8f9uZyEYLM76z0MKP9\n6KbZVlp9UHxy1MdIRiSRoFufcAol18I4nZciq5O6qqA9AmmANa+C+irED47ky/86\nvK9V0Xk3oO7urv4xLDwAsf4TrQKBgQDRGENJjm4DH4cBOJRJxirQuNKuz8SQQ6Xc\nXSaa7x+orReEGoQp2aCGClGA0JoGiBSBa8gFhQbXKyDMEr1JIpDejpnd0WVPLtwB\nFO6e4TbgrE9LL0yONoSYTM8naFENr+CoH/Ow2jiD8r/UtViJqGu4FPwO8wx3BVQc\n3z4IeXFIPQKBgQDEr4aBgrZSBPs1rqAJVAEsWjEbr5UlaZtrwiVae6QAAQvYlLsd\n9zb4O2dytQXcFBRdjTr07JouGK0gylIV1vaeYv2yK/McTAOrQCYnu+ezTs+GqjOQ\nBowzaoVr8Jtuf11tcH4MwBK8cCcKFePS5KWqOwyxw12ObYnyg6gN5zfTbQKBgFZa\niN+F/RU5Hg55CXT2bJRK4Gfl0q4p4gQCTIFMJG0LH10lflOyV0NEW6ixfgsYhC93\nDeKJr+uJGkBttNLRfbcMeatMYWS0W5PuyyW+qWVchFruq9VH2rbzcdI6mM7oRgXp\nPEFbvl9wD52PT4N6lRIvSHH8GrfE8ZoC8KGbVheZAoGAO7K9o2VypCbHbMDqelix\nUAt4nGYCNmzN9NbGu6DgLWolCv5fxc58aZY85eTQ2k5ge491LvjACfFv66sw9WkA\nraY3sZv4aVJfV05lYJKSLyTbMrJsYDN7JGXfsolzmM4Z0duzfC5N7LUqjdA5Dkku\nhk/S3GToaYL7eO2AZnUq22s=\n-----END PRIVATE KEY-----\n",
  }),
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
