const useHistory = ReactRouterDOM.useHistory;

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { setUser, setCurrentPage, setLastPage } =
    React.useContext(UserContext);
  const history = useHistory();

  function login() {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        var user = userCredential.user;
        var token = await user.getIdToken();
        const url = `/account/user/${email}`;
        await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(`${response}`);
            }

            return res.json();
          })
          .then((jsonRes) => {
            setUser(jsonRes);
            setLastPage("#/createAccount/");
            setCurrentPage("#/");
            history.push("/#");
          })
          .catch((error) => {
            throw new Error(`${error}`);
          });
      })
      .catch((error) => {
        console.log("Login failed: ", error);
        alert("User cannot be logged in or does not exist");
        setEmail("");
        setPassword("");
      });
  }

  return (
    <Card
      bgcolor="dark"
      txtcolor="white"
      header="LOGIN"
      body={
        <>
          <br />
          Email address
          <br />
          <input
            type="input"
            className="form-control"
            id="userEmail"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <br />
          Password
          <br />
          <input
            type="password"
            className="form-control"
            id="userPassword"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <br />
          <button
            id="submit"
            type="submit"
            disabled={!email || !password}
            className="btn btn-light"
            onClick={login}
          >
            Login
          </button>
        </>
      }
    />
  );
}
