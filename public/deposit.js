const useHistory = ReactRouterDOM.useHistory;

function Deposit() {
  const [status, setStatus] = React.useState("");
  const [bgColor, setBgColor] = React.useState("dark");
  const [deposit, setDeposit] = React.useState("");
  const { currentUser, setCurrentUser, loggedIn } =
    React.useContext(UserContext);
  const history = useHistory();
  if (!loggedIn) history.push("/#");

  function handleDeposit() {
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

    currentUser.balance = Number(currentUser.balance) + Number(deposit);
    setCurrentUser(currentUser);
    alert(`Deposit of $${deposit} successfully made!`);
    setDeposit("");
  }

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
            <div className="ml-auto">{currentUser.balance}</div>
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
