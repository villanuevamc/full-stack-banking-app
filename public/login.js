const useHistory = ReactRouterDOM.useHistory;

function Login() {
  const [userEmail, setUserEmail] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");
  const {
    users,
    setCurrentUser,
    setLoggedIn,
    setCurrentPage,
    lastPage,
    setLastPage,
  } = React.useContext(UserContext);
  const history = useHistory();

  function login() {
    const user = users.find((user) => {
      if (user.email === userEmail && user.password === userPassword)
        return user;
    });

    if (!user) {
      alert("That user does not exist");
      setUserEmail("");
      setUserPassword("");
      return;
    }

    setCurrentUser(user);
    setLoggedIn(true);
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
            value={userEmail}
            onChange={(e) => setUserEmail(e.currentTarget.value)}
          />
          <br />
          Password
          <br />
          <input
            type="password"
            className="form-control"
            id="userPassword"
            placeholder="Enter password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.currentTarget.value)}
          />
          <br />
          <button
            id="submit"
            type="submit"
            disabled={!userEmail || !userPassword}
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
