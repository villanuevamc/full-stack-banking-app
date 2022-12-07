function NavBar() {
  const {
    loggedIn,
    setLoggedIn,
    currentPage,
    setCurrentPage,
    lastPage,
    setLastPage,
    setCurrentUser,
  } = React.useContext(UserContext);

  React.useEffect(() => {
    // Since the window hash won't update by the time the onClick action
    // happens, a delay is added so we wait to update currentPage
    setTimeout(() => {
      const oldCurrent = document.getElementById(lastPage);
      if (oldCurrent) {
        oldCurrent.classList.remove("bg-dark");
        oldCurrent.classList.remove("text-white");
      }
      console.log("OLD: ", lastPage);
      setCurrentPage(window.location.hash);
    }, 10);
  }, [lastPage]);

  React.useEffect(() => {
    console.log("NEW: ", currentPage);
    const newCurrent = document.getElementById(currentPage);
    if (newCurrent) newCurrent.className += " bg-dark text-white";
  }, [currentPage]);

  function logout() {
    setLoggedIn(false);
    setCurrentUser({});
    setLastPage(currentPage);
    setCurrentPage("#/login/");
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a
          id="#/"
          className="navbar-brand"
          href="#"
          onClick={() => setLastPage(window.location.hash)}
        >
          BadBank
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          {!loggedIn ? (
            <div className="navbar-nav">
              <a
                id="#/login/"
                className="nav-item nav-link"
                href="#/login/"
                onClick={() => setLastPage(window.location.hash)}
              >
                Login
              </a>
              <a
                id="#/createAccount/"
                className="nav-item nav-link"
                href="#/createAccount/"
                onClick={() => setLastPage(window.location.hash)}
              >
                Create Account
              </a>
              <a
                id="#/allData/"
                className="nav-item nav-link"
                href="#/allData/"
                onClick={() => setLastPage(window.location.hash)}
              >
                All Data
              </a>
            </div>
          ) : (
            <div className="navbar-nav">
              <a
                id="#/createAccount/"
                className="nav-item nav-link"
                href="#/createAccount/"
                onClick={() => setLastPage(window.location.hash)}
              >
                Create Account
              </a>
              <a
                id="#/deposit/"
                className="nav-item nav-link"
                href="#/deposit/"
                onClick={() => setLastPage(window.location.hash)}
              >
                Deposit
              </a>
              <a
                id="#/withdraw/"
                className="nav-item nav-link"
                href="#/withdraw/"
                onClick={() => setLastPage(window.location.hash)}
              >
                Withdraw
              </a>
              <a
                id="#/allData/"
                className="nav-item nav-link"
                href="#/allData/"
                onClick={() => setLastPage(window.location.hash)}
              >
                All Data
              </a>
              <a
                id="logout"
                className="nav-item nav-link"
                href="#/login/"
                onClick={logout}
              >
                Log Out
              </a>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
