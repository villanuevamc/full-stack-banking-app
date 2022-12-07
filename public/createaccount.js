function CreateAccount() {
  const [status, setStatus] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [bgColor, setBgColor] = React.useState("dark");
  const [accountButton, setAccountButton] = React.useState("Create Account");

  function validate(field, label) {
    if (!field) {
      setStatus(
        "Error: " +
          label.charAt(0).toUpperCase() +
          label.slice(1) +
          " is missing, all fields must be filled to create a new account"
      );
      setBgColor("danger");
      setTimeout(() => setStatus(""), 3000);
      setTimeout(() => setBgColor("dark"), 3000);
      return false;
    }

    if (label === "password" && field.length < 8) {
      setStatus(
        "Error: Password is too short, must be at least 8 characters long"
      );
      setBgColor("danger");
      setTimeout(() => setStatus(""), 3000);
      setTimeout(() => setBgColor("dark"), 3000);
      return false;
    }
    return true;
  }

  function handleCreate() {
    if (!validate(name, "name")) return;
    if (!validate(email, "email")) return;
    if (!validate(password, "password")) return;
    const url = `/account/create/${name}/${email}/${password}`;
    (async () => {
      var res = await fetch(url);
      var data = await res.json();
    })();

    clearForm();
    alert("Successfully created account!");
  }

  function clearForm() {
    setName("");
    setEmail("");
    setPassword("");
    setAccountButton("Add Another Account");
  }

  return (
    <Card
      id="accountCard"
      bgcolor={bgColor}
      header="Create Account"
      status={status}
      body={
        <>
          Name
          <br />
          <input
            type="input"
            className="form-control"
            id="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <br />
          Email address
          <br />
          <input
            type="input"
            className="form-control"
            id="email"
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
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <br />
          <button
            id="submit"
            type="submit"
            disabled={!name && !email && !password}
            className="btn btn-light"
            onClick={handleCreate}
          >
            {accountButton}
          </button>
        </>
      }
    />
  );
}
