function Spa() {
  const [users, setUsers] = React.useState([
    {
      name: "TestUser",
      email: "testuser@gmail.com",
      password: "testtest",
      balance: 100,
    },
  ]);
  const [currentUser, setCurrentUser] = React.useState({});
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(window.location.hash);
  const [lastPage, setLastPage] = React.useState("");

  return (
    <HashRouter>
      <UserContext.Provider
        value={{
          users,
          setUsers,
          currentUser,
          setCurrentUser,
          loggedIn,
          setLoggedIn,
          currentPage,
          setCurrentPage,
          lastPage,
          setLastPage,
        }}
      >
        <NavBar />
        <div className="container" style={{ padding: "20px" }}>
          <Route path="/" exact component={Home} />
          <Route path="/createAccount/" component={CreateAccount} />
          <Route path="/login/" component={Login} />
          <Route path="/deposit/" component={Deposit} />
          <Route path="/withdraw/" component={Withdraw} />
          <Route path="/allData/" component={AllData} />
        </div>
      </UserContext.Provider>
    </HashRouter>
  );
}

ReactDOM.render(<Spa />, document.getElementById("root"));
