const useHistory = ReactRouterDOM.useHistory;

function Withdraw() {
  const [status, setStatus] = React.useState("");
  const [bgColor, setBgColor] = React.useState("dark");
  const [withdraw, setWithdraw] = React.useState("");
  const { currentUser, setCurrentUser, loggedIn } =
    React.useContext(UserContext);
  const history = useHistory();
  if (!loggedIn) history.push("/#");

  function handleDeposit() {
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

    if (withdraw > currentUser.balance) {
      setStatus(
        "Transaction failed: Withdrawal value can't be greater than balance"
      );
      setBgColor("danger");
      setTimeout(() => setStatus(""), 3000);
      setTimeout(() => setBgColor("dark"), 3000);
      return;
    }

    currentUser.balance = Number(currentUser.balance) - Number(withdraw);
    setCurrentUser(currentUser);
    alert(`Withdrawal of $${withdraw} successfully made!`);
    setWithdraw("");
  }

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
            <div className="ml-auto">{currentUser.balance}</div>
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
