function AllData() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    // fetch all account from API
    var token;
    (async () => {
      token = await firebaseApp.auth().currentUser.getIdToken();
    })();

    fetch("/account/all")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
      });
  }, []);

  return (
    <Card
      bgcolor="dark"
      txtcolor="white"
      header="ALL DATA"
      body={
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Password</th>
              <th scope="col">Balance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((account) => (
              <tr key={account}>
                <td>{account.name}</td>
                <td>{account.email}</td>
                <td>{account.password}</td>
                <td>{account.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    />
  );
}
