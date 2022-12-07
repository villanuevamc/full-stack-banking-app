const useHistory = ReactRouterDOM.useHistory;

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { user, setUser, setCurrentPage, lastPage, setLastPage } =
    React.useContext(UserContext);
  const history = useHistory();

  function login() {
    auth().signInWithEmailAndPassword(email, password);

    /*if (!user) {
      alert("That user does not exist");
      setEmail("");
      setPassword("");
      return;s
    }*/

    alert("Successfully logged in!");
    setLastPage("#/createAccount/");
    setCurrentPage("#/");
    history.push("/#");
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
