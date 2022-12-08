const useHistory = ReactRouterDOM.useHistory;

function Withdraw() {
  const [status, setStatus] = React.useState("");
  const [bgColor, setBgColor] = React.useState("dark");
  const [withdraw, setWithdraw] = React.useState("");
  const [balance, setBalance] = React.useState("");
  const [uid, setUid] = React.useState("");
  const { user, setUser, loggedIn } = React.useContext(UserContext);
  const history = useHistory();
  if (!loggedIn) history.push("/#");

  React.useEffect(() => {
    async function fetchUser() {
      const url = `/account/user/${user.email}`;
      var token = await user.getIdToken();
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
          setBalance(jsonRes.data.balance);
          setUid(jsonRes.id);
        })
        .catch((error) => {
          console.log(`Couldn't get user's account info: ${error}`);
        });
    }
    fetchUser();
  }, [user]);

  const handleDeposit = async () => {
    if (isNaN(withdraw)) {
      setStatus("Error: Withdrawal value must be a number");
      setBgColor("danger");
      setTimeout(() => setStatus(""), 3000);
      setTimeout(() => setBgColor("dark"), 3000);
      return;
    }

    if (withdraw <= 0) {
      setStatus("Error: Withdrawal value must be greater than 0");
      setBgColor("danger");
      setTimeout(() => setStatus(""), 3000);
      setTimeout(() => setBgColor("dark"), 3000);
      return;
    }

    if (withdraw > user.balance) {
      setStatus(
        "Transaction failed: Withdrawal value can't be greater than balance"
      );
      setBgColor("danger");
      setTimeout(() => setStatus(""), 3000);
      setTimeout(() => setBgColor("dark"), 3000);
      return;
    }

    var newBalance = Number(balance) - Number(withdraw);

    const url = `/account/user/${uid}/${newBalance}`;
    var token = await user.getIdToken();
    await fetch(url, {
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
        alert(`Withdrawal of $${withdraw} successfully made!`);
        setWithdraw("");
        setBalance(newBalance);
      })
      .catch((error) => {
        console.log(`Couldn't update user's account: ${error}`);
        setStatus("Error: Couldn't update user's account");
        setBgColor("danger");
        setTimeout(() => setStatus(""), 3000);
        setTimeout(() => setBgColor("dark"), 3000);
      });
  };

  return (
    <Card
      bgcolor={bgColor}
      txtcolor="white"
      header="WITHDRAW"
      status={status}
      body={
        <div>
          <div className="d-flex">
            <div>Balance</div>
            <div className="ml-auto">{balance}</div>
          </div>
          <br />
          Withdrawal Amount
          <br />
          <input
            type="input"
            className="form-control"
            id="withdraw"
            placeholder="Enter withdrawal amount"
            value={withdraw}
            onChange={(e) => setWithdraw(e.currentTarget.value)}
          />
          <br />
          <button
            id="subtractWithdrawal"
            type="subtractWithdrawal"
            disabled={!withdraw}
            defaultValue=""
            className="btn btn-light"
            onClick={handleDeposit}
          >
            Withdraw
          </button>
        </div>
      }
    />
  );
}
