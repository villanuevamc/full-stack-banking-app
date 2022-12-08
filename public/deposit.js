const useHistory = ReactRouterDOM.useHistory;

function Deposit() {
  const [status, setStatus] = React.useState("");
  const [bgColor, setBgColor] = React.useState("dark");
  const [deposit, setDeposit] = React.useState("");
  const [balance, setBalance] = React.useState("");
  const [uid, setUid] = React.useState("");
  const { user, setUser, loggedIn } = React.useContext(UserContext);
  const history = useHistory();
  if (!loggedIn) history.push("/#");

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((currUser) => {
      if (currUser) {
        setUser(currUser);
        return true;
      }
      return false;
    });
  });

  React.useEffect(() => {
    function fetchUser() {
      const url = `/account/user/${user.email}`;
      user?.getIdToken().then((token) => {
        fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            res;
            if (!res.ok) {
              throw new Error(`${res}`);
            }

            return res.json();
          })
          .then((jsonRes) => {
            setBalance(jsonRes.data.balance);
            setUid(jsonRes.id);
          })
          .catch((error) => {
            console.log(`Couldn't get user's account info: ${error}`);
          });
      });
    }
    fetchUser();
  }, [user]);

  const handleDeposit = async () => {
    if (isNaN(deposit)) {
      setStatus("Error: Deposit value must be a number");
      setBgColor("danger");
      setTimeout(() => setStatus(""), 3000);
      setTimeout(() => setBgColor("dark"), 3000);
      return;
    }

    if (deposit <= 0) {
      setStatus("Error: Deposit value must be greater than 0");
      setBgColor("danger");
      setTimeout(() => setStatus(""), 3000);
      setTimeout(() => setBgColor("dark"), 3000);
      return;
    }

    var newBalance = Number(balance) + Number(deposit);

    const url = `/account/user/${uid}/${newBalance}`;
    user?.getIdToken().then((token) => {
      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`${res}`);
          }

          console.log(`Success ${res}`);
          alert(`Deposit of $${deposit} successfully made!`);
          setDeposit("");
          setBalance(JSON.stringify(newBalance));
        })
        .catch((error) => {
          console.log(`Couldn't update user's account: ${error}`);
          setStatus("Error: Couldn't update user's account");
          setBgColor("danger");
          setTimeout(() => setStatus(""), 3000);
          setTimeout(() => setBgColor("dark"), 3000);
        });
    });
  };

  return (
    <Card
      bgcolor={bgColor}
      txtcolor="white"
      header="DEPOSIT"
      status={status}
      body={
        <div>
          <div className="d-flex">
            <div>Balance</div>
            <div className="ml-auto">{balance}</div>
          </div>
          <br />
          Deposit Amount
          <br />
          <input
            type="input"
            className="form-control"
            id="deposit"
            placeholder="Enter deposit amount"
            value={deposit}
            onChange={(e) => setDeposit(e.currentTarget.value)}
          />
          <br />
          <button
            id="addDeposit"
            type="addDeposit"
            disabled={!deposit}
            className="btn btn-light"
            onClick={handleDeposit}
          >
            Deposit
          </button>
        </div>
      }
    />
  );
}
